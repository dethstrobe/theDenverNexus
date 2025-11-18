import { createServer, type ServerResponse, type IncomingMessage } from "http"
import {
  generateRegistrationOptions,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from "@simplewebauthn/server"
import { clientScript } from "./client.js"
import { TESTPASSKEY } from "./test-passkey.js"

interface StoredCredential {
  id: string
  publicKey: Uint8Array
  counter: number
  userId: string
}

interface StoredChallenge {
  challenge: string
  userId?: string
}

// In-memory storage for demo
const credentials = new Map<string, StoredCredential>()
const challenges = new Map<string, StoredChallenge>()

const rpID = "localhost"
const rpName = "Test App"
const port = 5173
const origin = `http://localhost:${port}`

async function parseBody(req: IncomingMessage): Promise<UnknownJson> {
  return new Promise((resolve, reject) => {
    let body = ""
    req.on("data", (chunk: string) => {
      body += chunk
    })
    req.on("end", () => {
      try {
        resolve(JSON.parse(body))
      } catch {
        resolve({})
      }
    })
    req.on("error", reject)
  })
}

function sendJson(
  res: ServerResponse<IncomingMessage>,
  data: unknown,
  status = 200,
) {
  res.writeHead(status, { "Content-Type": "application/json" })
  res.end(JSON.stringify(data))
}

const server = createServer(async (req, res) => {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type")

  if (req.method === "OPTIONS") {
    res.writeHead(200)
    res.end()
    return
  }

  const body = await parseBody(req)

  // Serve HTML client
  if (req.url === "/" && req.method === "GET") {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Passkey Test Client</title>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      max-width: 600px;
      margin: 50px auto;
      padding: 20px;
    }
    button {
      padding: 10px 20px;
      font-size: 16px;
      cursor: pointer;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
    }
    button:hover {
      background: #0056b3;
    }
    .status {
      margin-top: 20px;
      padding: 10px;
      border-radius: 4px;
    }
    .success {
      background: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }
    .error {
      background: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }
    .loading {
      background: #e2e3e5;
      color: #383d41;
      border: 1px solid #d6d8db;
    }
  </style>
</head>
<body>
  <h1>Passkey Authentication Test</h1>
  
  <button onclick="testAuthentication()">Test Login with Passkey</button>
  
  <div role="status" id="status"></div>

  <script>
${clientScript}
  </script>
</body>
</html>`

    res.writeHead(200, { "Content-Type": "text/html" })
    res.end(html)
    return
  }

  // Register start
  if (
    req.url === "/register/start" &&
    req.method === "POST" &&
    isRegisterStartBody(body)
  ) {
    const { username, userId } = body

    const options = await generateRegistrationOptions({
      rpName,
      rpID,
      userName: username,
      userID: new TextEncoder().encode(userId),
    })

    challenges.set(userId, { challenge: options.challenge })

    return sendJson(res, options)
  }

  // Register finish
  if (
    req.url === "/register/finish" &&
    req.method === "POST" &&
    isRegisterFinishBody(body)
  ) {
    const { userId, credentialId, publicKey, counter } = body

    const storedChallenge = challenges.get(userId)
    if (!storedChallenge) {
      return sendJson(res, { error: "No challenge found" }, 400)
    }

    credentials.set(credentialId, {
      id: credentialId,
      publicKey: new Uint8Array(publicKey),
      counter,
      userId,
    })

    challenges.delete(userId)

    return sendJson(res, { success: true })
  }

  // Authenticate start
  if (req.url === "/authenticate/start" && req.method === "POST") {
    const options = await generateAuthenticationOptions({
      rpID,
    })

    challenges.set("auth", { challenge: options.challenge })

    return sendJson(res, options)
  }

  // Authenticate finish
  if (
    req.url === "/authenticate/finish" &&
    req.method === "POST" &&
    isAuthenticateFinishBody(body)
  ) {
    const { credentialId, clientDataJSON, authenticatorData, signature } = body

    // const storedCredential = credentials.get(credentialId)
    // if (!storedCredential) {
    //   return sendJson(res, { error: "Credential not found" }, 400)
    // }

    const storedChallenge = challenges.get("auth")
    if (!storedChallenge) {
      return sendJson(res, { error: "No challenge found" }, 400)
    }

    try {
      const verification = await verifyAuthenticationResponse({
        response: {
          id: credentialId,
          rawId: credentialId,
          response: {
            clientDataJSON,
            authenticatorData,
            signature,
          },
          type: "public-key",
          clientExtensionResults: {},
        },
        expectedChallenge: storedChallenge.challenge,
        expectedOrigin: origin,
        expectedRPID: rpID,
        credential: {
          id: TESTPASSKEY.credentialId,
          publicKey: Uint8Array.from(TESTPASSKEY.publicKey),
          counter: 0,
        },
      })

      if (!verification.verified) {
        return sendJson(res, { error: "Authentication failed" }, 400)
      }

      challenges.delete("auth")

      return sendJson(res, {
        success: true,
        userId: TESTPASSKEY.userId,
      })
    } catch (err) {
      return sendJson(res, { error: String(err) }, 400)
    }
  }

  sendJson(res, { error: "Not found" }, 404)
})

server.listen(port, () => {
  console.log(`Server running on ${origin}`)
})

// Type guards
type UnknownJson = Record<string, unknown>
function isRegisterStartBody(
  body: UnknownJson,
): body is { username: string; userId: string } {
  return (
    typeof body === "object" &&
    body !== null &&
    typeof body["username"] === "string" &&
    typeof body["userId"] === "string"
  )
}

function isRegisterFinishBody(body: UnknownJson): body is {
  userId: string
  credentialId: string
  publicKey: number[]
  counter: number
} {
  return (
    typeof body === "object" &&
    body !== null &&
    typeof body["userId"] === "string" &&
    typeof body["credentialId"] === "string" &&
    Array.isArray(body["publicKey"]) &&
    typeof body["counter"] === "number"
  )
}

function isAuthenticateFinishBody(body: UnknownJson): body is {
  credentialId: string
  clientDataJSON: string
  authenticatorData: string
  signature: string
  signCount: number
} {
  return (
    typeof body === "object" &&
    body !== null &&
    typeof body["credentialId"] === "string" &&
    typeof body["clientDataJSON"] === "string" &&
    typeof body["authenticatorData"] === "string" &&
    typeof body["signature"] === "string"
  )
}
