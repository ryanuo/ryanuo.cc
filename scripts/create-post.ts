#!/usr/bin/env ts-node
import fs from 'node:fs'
import path from 'node:path'
import inquirer from 'inquirer'

const outputDir = path.resolve(process.cwd(), 'pages', 'zh', 'posts')
const outputDirEn = path.resolve(process.cwd(), 'pages', 'en', 'posts')
function formatDate(date: Date) {
  const yyyy = date.getFullYear()
  const MM = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  const hh = String(date.getHours()).padStart(2, '0')
  const mm = String(date.getMinutes()).padStart(2, '0')
  return `${yyyy}-${MM}-${dd} ${hh}:${mm}`
}

async function main() {
  console.log('📝 创建新文章...')
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: '请输入标题:',
      validate: input => input.trim() !== '' || '标题不能为空',
    },
    {
      type: 'input',
      name: 'fileName',
      message: '请输入文件名:',
      default: answers => answers.title.toLowerCase().replace(/\s+/g, '-'),
      validate: (input) => {
        const filePath = path.resolve(outputDir, `${input}.md`)
        if (fs.existsSync(filePath)) {
          return '文件已存在，请选择其他文件名'
        }
        return input.trim() !== '' || '文件名不能为空'
      },
    },
    {
      type: 'input',
      name: 'categories',
      message: '请输入分类:',
    },
    {
      type: 'input',
      name: 'description',
      message: '请输入描述:',
    },
    {
      type: 'confirm',
      name: 'plum',
      message: '是否启用 plum?',
      default: true,
    },
  ])

  const date = formatDate(new Date())
  const filename = `${answers.fileName}.md`
  const filepath = path.resolve(outputDir, filename)

  const content = `---
title: ${answers.title}
date: '${date}'
categories: ${answers.categories || ''}
description: ${answers.description || ''}
plum: ${answers.plum}
---
`

  fs.writeFileSync(filepath, content)
  fs.writeFileSync(path.resolve(outputDirEn, filename), content)
  console.log(`✅ 文件已创建: ${filename}`)
}

main().catch(console.error)
