import { getLatestBlogPost } from "./latestBlogPost.js"
import { sentNewsletter } from "./sentEmail.js"
import { emailTemplate } from "./template.js"

export async function newsletterWorkflow() {
  const template = await getLatestBlogPost()

  const emailData = await emailTemplate(template)

  await sentNewsletter(emailData)
}
