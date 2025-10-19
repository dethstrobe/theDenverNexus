import { getLatestBlogPost } from "./latestBlogPost.mjs"
import { sentNewsletter } from "./sentEmail.mjs"
import { emailTemplate } from "./template.mjs"

export async function newsletterWorkflow() {
  const template = await getLatestBlogPost()

  const emailData = await emailTemplate(template)

  await sentNewsletter(emailData)
}
