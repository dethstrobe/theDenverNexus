import matter from "gray-matter"
import juice from "juice"
import { marked } from "marked"

export const emailTemplate = async (markdown: string) => {
  const { content, data } = matter(markdown)

  const css = `
    h1 { color: #1a73e8; text-align: center; }
    p { font-size: 16px; line-height: 1.5; }
  `
  const header = `
  <style>
    ${css}
  </style>
  <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
  <h1>Test2Doc Newsletter</h1>
  <p style="text-align: center;">Bringing you the latest updates and insights from Test2Doc.</p>
  <p>You can read this issue online at <a href="https://test2doc.com/blog/${data.slug}">https://test2doc.com/blog/${data.slug}</a></p>
  <hr />
  `

  const footer = `
  <hr />
  <p style="text-align: center;">&copy; ${new Date().getFullYear()} Null Sweat. All rights reserved.</p>
  <p style="text-align: center;">If you want us to stop or like whatever, <a href="%mailing_list_unsubscribe_url%">unsubscribe</a></p>
  </div>
  `

  return { html: juice(header + (await marked.parse(content)) + footer), data }
}
