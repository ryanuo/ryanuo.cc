import base64
import os
import requests
from playwright.sync_api import sync_playwright
import json

def url_to_key(key):
    # 将URL中的斜杠替换为减号，并去除协议和域名部分，然后在最前面添加 "og-"
    key = "og-" + key.replace("https://", "").replace("http://", "").replace("/", "-")
    return key


# 请求xml地址
def get_json_url():
    if json_url.startswith('http'):
        response = requests.get(json_url)
        return response.json()
    else:
        with open(json_url, 'r') as file:
            return json.load(file)

    results = {}
    for item in items:
        results[url_to_key(item.get('url'))] = item.get('title', '')

    print(f'共生成{len(results)}个链接')
    return results


# 检查本地图片是否存在
def check_local_image():
    # 获取远程URL和对应的键值对
    img_map = get_json_url()

    # 保存不存在的文件名的列表
    not_found_list = []

    for u1 in img_map.items():
        # 构建本地文件路径，假设本地图片文件都在当前目录下的 "og" 文件夹中
        local_image_path = os.path.join(out_dir_list, u1[0] + ".png")

        # 检查本地图片是否存在
        if not os.path.exists(local_image_path):
            # 如果不存在，则将文件名添加到不存在列表中
            not_found_list.append(u1)

    return not_found_list


def save_base64_image(base64_string, filename):
    try:
        # 检查 Base64 字符串长度是否是 4 的倍数
        base64_data = base64_string.split(',')[1]
        # 将 Base64 字符串解码为二进制数据
        image_data = base64.b64decode(base64_data)

        # 将解码后的二进制数据写入文件
        with open(filename, 'wb') as file:
            file.write(image_data)

        print("图片已成功保存到:", filename)
    except Exception as e:
        print("保存图片失败:", str(e))


def url_encode(p1):
    encoded_params = []
    for key, value in p1.items():
        if isinstance(value, str):
            encoded_params.append(f"{key}={value}")
        elif isinstance(value, (list, tuple)):
            for v in value:
                encoded_params.append(f"{key}={v}")
        else:
            encoded_params.append(f"{key}={str(value)}")
    return '&'.join(encoded_params)


def generate_cover(u_, p_, img_name):
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        url_ = f"{u_}?{url_encode(p_)}"
        page.goto(url_)
        page.wait_for_selector('#resultImg')

        preview_url = page.query_selector('#resultImg').text_content()
        if preview_url:
            # 下载预览图
            save_base64_image(preview_url, f'{out_dir_list}/{img_name}.{img_format}')

        browser.close()


if __name__ == '__main__':
    print("正在生成封面...")
    json_url = "dist/sitemap.json"
    url = "https://oc.mr90.top/auto"
    out_dir_list = 'public/og'
    img_format = "png"
    # 判断文件夹是否存在
    if not os.path.exists(out_dir_list):
        os.makedirs(out_dir_list)

    no_exit_img_list = check_local_image()
    if len(no_exit_img_list) != 0:
        print(f"共{len(no_exit_img_list)}个图片不存在，开始生成...")
        for u in no_exit_img_list:
            params = {
                "aspect_ratio": "2:1",
                "coverMarkColor": "rgba(0, 0, 0, 0.3)",
                "font": "ADLaM Display",
                "coverTitle": u[1],
                "coverAuthor": "@Ryanco",
                "iconPosition": 3,
                "iconName": "material-symbols:adaptive-audio-mic",
                "previewImg": "https://images.unsplash.com/photo-1622547748225-3fc4abd2cca0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1OTE5MjN8MHwxfHNlYXJjaHw4fHxzaW1wbGV8ZW58MHx8fHwxNzE3MTY2MDQ2fDA&ixlib=rb-4.0.3&q=80&w=1080"
            }
            generate_cover(url, params, u[0])
            print(f"{u[0]} 生成成功")

    else:
        print("所有图片均已存在")
