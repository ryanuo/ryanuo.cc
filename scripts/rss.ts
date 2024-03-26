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
  const files = await fg(["pages/posts/*.md", "pages/zh/posts/*.md"]);

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
        .filter((i) => !i.includes("index"))
        .map(async (i) => {
          const raw = await fs.readFile(i, "utf-8");
          const { data, content } = matter(raw);

          const html = markdown.render(content);
          return {
            ...data,
            date: new Date(data.date),
            content: html,
            author: [AUTHOR],
            link: DOMAIN + i.replace(/^pages(.+)\.md$/, "$1"),
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

  await fs.ensureDir(dirname(`./dist/${name}`));
  await fs.writeFile(`./dist/${name}.xml`, feed.rss2(), "utf-8");
  await fs.writeFile(`./dist/${name}.atom`, feed.atom1(), "utf-8");
  await fs.writeFile(`./dist/${name}.json`, feed.json1(), "utf-8");
}

run();
