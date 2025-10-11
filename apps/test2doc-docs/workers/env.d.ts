declare global {
  interface Env {
    MAILGUN_API_KEY?: string
    MAILING_LIST_ADDRESS?: string
    MAILGUN_BASE_URL?: string
    // add other bindings (KV, R2, etc.) here as needed
  }
}

export {}
