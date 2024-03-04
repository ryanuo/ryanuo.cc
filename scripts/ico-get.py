import pyperclip
import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse, urljoin


def get_website_info(url):
    try:
        # 解析URL并获取root URL
        parsed_url = urlparse(url)
        root_url = f"{parsed_url.scheme}://{parsed_url.netloc}"

        # 发送GET请求
        response = requests.get(root_url)
        response.raise_for_status()  # 如果请求失败，将抛出异常

        # 使用BeautifulSoup解析HTML
        soup = BeautifulSoup(response.text, "html.parser")

        # 提取网站标题
        title = soup.find("title").string if soup.find("title") else None

        # 查找<link>元素获取favicon
        favicon = soup.find("link", rel="icon")
        if favicon and favicon.get("href"):
            favicon_absolute_url = urljoin(root_url, favicon["href"])
        else:
            # 使用Google的favicon服务
            favicon_absolute_url = f"https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url={root_url}&size=64"

        # 提取<meta>标签中的描述信息
        description = None
        meta_description = soup.find("meta", attrs={"name": "description"})
        if meta_description:
            description = meta_description.get("content")
        else:
            description = f"生成（{root_url}）描述信息简短概括不超过20个字，并且写出中文和英文翻译"

        return {
            "name": title,
            "link": url,
            "image": favicon_absolute_url,
            "desc": description,
        }
    except requests.exceptions.RequestException as e:
        print(f"Error fetching the website info: {e}")
        return None


if __name__ == "__main__":
    while True:
        website_url = input("Enter the website URL (type 'exit' to quit): ")
        if website_url.lower() in ["exit", "quit"]:
            break
        info = get_website_info(website_url)
        if info:
            output = (
                f"    - name: '{info['name']}'\n"
                f"      link: '{info['link']}'\n"
                f"      image: '{info['image']}'\n"
                f"      desc: '{info['desc']}'"
            )
            print(output)
            pyperclip.copy(output)
            print("The information has been copied to your clipboard.\n")
        else:
            print("Could not retrieve the website information.\n")


# 生成（）描述信息简短概括不超过20个字，并且写出中文和英文翻译
