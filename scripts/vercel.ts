export { generateVercelConfig };

import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootPath = path.resolve(__dirname, "../"); // 获取根目录的绝对路径
const distPath = path.join(rootPath, "dist"); // 'dist'目录的路径
let rewrites: { source: string; destination: string }[] = [
  { source: "/(.*)", destination: "/index.html" },
]; // 存储重写规则的数组

// 递归遍历'dist'目录
function readHtmlFiles(dir) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // 如果是目录，则递归遍历
      readHtmlFiles(filePath);
    } else if (path.extname(file) === ".html") {
      // 如果文件是HTML文件，则生成重写规则
      const relativePath = path
        .relative(distPath, filePath)
        .replace(/\\/g, "/");
      const source = `/${relativePath.replace(/\.html$/, "")}`;
      rewrites.push({ source: source, destination: `/${relativePath}` });
    }
  });
}

// 生成vercel.json文件
function generateVercelConfig() {
  readHtmlFiles(distPath); // 首先读取所有HTML文件

  const config = {
    rewrites,
  };

  fs.writeFileSync(
    path.join(rootPath, "./vercel.json"),
    JSON.stringify(config, null, 2)
  );
  console.log("vercel.json has been generated successfully.");
}

generateVercelConfig();
