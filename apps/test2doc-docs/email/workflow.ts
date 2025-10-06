import { getLatestBlogPost } from "./latestBlogPost"
import { sentNewsletter } from "./sentEmail"
import { emailTemplate } from "./template"

export async function newsletterWorkflow() {
  const template = await getLatestBlogPost()

  const emailData = await emailTemplate(template)

  await sentNewsletter(emailData)
}
