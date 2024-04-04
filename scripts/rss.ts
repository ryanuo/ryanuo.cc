import fg from "fast-glob";
import type { FeedOptions, Item } from "feed";
import { Feed } from "feed";
import fs from "fs-extra";
import matter from "gray-matter";
import MarkdownIt from "markdown-it";
import { dirname } from "node:path";

const DOMAIN = "https://mr90.top";
const AUTHOR = {
  name: "Ryan Co",
  email: "iui9@qq.com",
  link: DOMAIN,
};
const markdown = MarkdownIt({
  html: true,
  breaks: true,
  linkify: true,
});

async function run() {
  await buildBlogRSS();
}

async function buildBlogRSS() {
  const files = await fg([
    "pages/posts/*.md",
    "pages/zh/posts/*.md",
    "pages/navs/*.md",
    "pages/zh/navs/*.md",
  ]);

  const options = {
    title: "Ryan Co",
    description: "Ryan Co' Blog",
    id: DOMAIN,
    link: DOMAIN,
    copyright: "CC BY-NC-SA 4.0 2021 © Ryan Co",
    feedLinks: {
      json: `${DOMAIN}/sitemap.json`,
      atom: `${DOMAIN}/sitemap.atom`,
      rss: `${DOMAIN}/sitemap.xml`,
    },
  };

  const posts: any[] = (
    await Promise.all(
      files
        .filter((i) => !i.includes("posts/index"))
        .map(async (i) => {
          const raw = await fs.readFile(i, "utf-8");
          const { data, content } = matter(raw);
          let html = markdown.render(content);
          if (i.includes("/navs") && data?.projects) {
            html = "";
            Object.entries(data.projects).forEach(
              ([key, values]: [string, any]) => {
                html += `<h4>${key}</h4>`;
                values.forEach((project) => {
                  html += `<div class="project-item"><div class="project-item-title">${project.name}</div><div class="project-item-desc">${project.desc}</div><div class="project-item-link"><a href="${project.link}" target="_blank">${project.link}</a></div></div>`;
                });
              }
            );
          }

          return {
            ...data,
            date: data?.date ? new Date(data?.date) : new Date(),
            content: html,
            extensions: [
              { name: "text", objects: content.replace(/\r\n/g, "") },
            ],
            author: [AUTHOR],
            link:
              DOMAIN +
              i.replace(/^pages(.+)\.md$/, "$1")?.replace("/index", ""),
          };
        })
    )
  ).filter(Boolean);

  posts.sort((a, b) => +new Date(b.date) - +new Date(a.date));

  await writeFeed("sitemap", options, posts);
}

async function writeFeed(name: string, options: FeedOptions, items: Item[]) {
  options.author = AUTHOR;
  options.image = `${DOMAIN}/avatar.png`;
  options.favicon = `${DOMAIN}/logo.png`;

  const feed = new Feed(options);

  items.forEach((item) => feed.addItem(item));

  console.log(items);

  await fs.ensureDir(dirname(`./dist/${name}`));
  await fs.writeFile(`./dist/${name}.xml`, feed.rss2(), "utf-8");
  await fs.writeFile(`./dist/${name}.atom`, feed.atom1(), "utf-8");
  await fs.writeFile(`./dist/${name}.json`, feed.json1(), "utf-8");
}

run();
