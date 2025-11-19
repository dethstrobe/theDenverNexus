// client.ts
function base64urlToBuffer(base64url: string): ArrayBuffer {
  // Convert base64url to base64
  const base64 = base64url.replace(/-/g, "+").replace(/_/g, "/")
  const padded = base64.padEnd(
    base64.length + ((4 - (base64.length % 4)) % 4),
    "=",
  )

  // Decode base64 to binary string
  const binary = atob(padded)

  // Convert to ArrayBuffer
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes.buffer
}

function arrayBufferToBase64url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let binary = ""
  for (const c of bytes) {
    binary += String.fromCharCode(c)
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "")
}

function updateStatus(
  statusDiv: HTMLElement,
  message: string,
  type: "loading" | "success" | "error",
): void {
  console.log(message)
  statusDiv.textContent = message
  statusDiv.className = `status ${type}`
}

async function testAuthentication(): Promise<void> {
  const statusDiv = document.getElementById("status")
  if (!statusDiv) {
    throw new Error("Status div not found")
  }

  try {
    updateStatus(statusDiv, "Starting authentication...", "loading")

    const optionsResponse = await fetch("/authenticate/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })

    if (!optionsResponse.ok) {
      throw new Error("Failed to get authentication options")
    }

    const options = await optionsResponse.json()
    updateStatus(statusDiv, "Got authentication options", "loading")

    const assertion = await navigator.credentials.get({
      publicKey: {
        challenge: base64urlToBuffer(options.challenge),
        rpId: options.rpId,
        userVerification: "preferred",
        allowCredentials: options.allowCredentials,
      },
    })

    if (!assertion) {
      throw new Error("User cancelled authentication")
    }

    function isPublicKeyCredential(
      credential: Credential | null,
    ): credential is PublicKeyCredential {
      return credential !== null && credential.type === "public-key"
    }
    function isAuthenticatorAssertionResponse(
      response: AuthenticatorResponse,
    ): response is AuthenticatorAssertionResponse {
      return "signature" in response && "authenticatorData" in response
    }

    if (!isPublicKeyCredential(assertion)) {
      throw new Error("No valid PublicKeyCredential returned")
    }
    if (!isAuthenticatorAssertionResponse(assertion.response)) {
      throw new Error("Response is not an assertion response")
    }

    updateStatus(statusDiv, "Got credential from authenticator", "loading")

    const response = await fetch("/authenticate/finish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        credentialId: assertion.id,
        clientDataJSON: arrayBufferToBase64url(
          assertion.response.clientDataJSON,
        ),
        authenticatorData: arrayBufferToBase64url(
          assertion.response.authenticatorData,
        ),
        signature: arrayBufferToBase64url(assertion.response.signature),
        // signCount: assertion.response.signCount,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Authentication failed")
    }

    const result = await response.json()
    updateStatus(
      statusDiv,
      `✓ Authentication successful! User ID: ${result.userId}`,
      "success",
    )
  } catch (error) {
    updateStatus(
      statusDiv,
      `✗ Error: ${error instanceof Error ? error.message : String(error)}`,
      "error",
    )
    console.error(error)
  }
}

export const clientScript: string = `
  ${base64urlToBuffer.toString()}
  ${arrayBufferToBase64url.toString()}
  ${updateStatus.toString()}
  ${testAuthentication.toString()}
`
