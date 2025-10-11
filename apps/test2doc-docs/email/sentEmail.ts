import Mailgun from "mailgun.js"

const mailgun = new Mailgun(FormData)

export const sentNewsletter = async ({
  html,
  data,
}: {
  html: string
  data: { [key: string]: any }
}) => {
  const key = process.env.MAILGUN_API_KEY
  if (!key) throw new Error("MAILGUN_API_KEY is not set in environment")

  const domain = process.env.MAILGUN_DOMAIN
  if (!domain) throw new Error("MAILGUN_DOMAIN is not set in environment")

  console.log("Sending email via Mailgun...", mailgun, key, domain)

  const mg = mailgun.client({ username: "api", key })
  // Send the email
  try {
    const msg = await mg.messages.create(domain, {
      from: `Test2Doc Newsletter <newsletter@${domain}>`,
      to: [`newsletter@${domain}`],
      subject: data.title ? `Test2Doc: ${data.title}` : "Test2Doc Newsletter",
      html,
    })

    console.log("Email sent:", msg)
  } catch (error) {
    console.error("Error sending email:", error)
  }
}
