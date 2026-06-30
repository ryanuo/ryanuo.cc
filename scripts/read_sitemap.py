import requests
from bs4 import BeautifulSoup
import json

sitemap_url = "https://ryanuo.cc/sitemap.xml"
response = requests.get(sitemap_url)

if response.status_code == 200:
    soup = BeautifulSoup(response.content, "xml")

    urls = []
    for loc in soup.find_all("guid"):
        url = loc.text
        item_map = {"url": url, "tags": ["zh-CN"]}
        if "/en/" in url:
            item_map["tags"] = ["en-US"]" 
        if "/navs" in url:
            item_map["selectors_key"] = "navs"
        urls.append(item_map)

    data = {
        "index_name": "ryan",
        "start_urls": urls,
        "only_content_level": True,
        "selectors": {
            "default": {
                "lvl0": "#app .prose h1 span[data-title]",
                "lvl1": "h1",
                "lvl2": "#app article .prose h3",
                "lvl3": "#app article .prose h4",
                "lvl4": "#app article .prose h5",
                "lvl5": "#app article .prose h6",
                "text": "#app article .prose",
            },
            "navs": {
                "lvl0": "article h4",
                "lvl2": "article a div[data-name]",
                "lvl3": "article li a .line-clamp-1",
                "content": "article li .text-e",
            },
        },
    }

    print(data)

    with open("config.json", "w") as file:
        json.dump(data, file, indent=2)

    print("Data saved to data.json")
else:
    print("Failed to fetch sitemap.xml")