import { defineApp, ErrorResponse } from "rwsdk/worker"
import { route, render, prefix } from "rwsdk/router"
import { Document } from "@/app/Document"
import { Home } from "@/app/pages/Home"
import { setCommonHeaders } from "@/app/headers"
import { userRoutes } from "@/app/pages/user/routes"
import { sessions, setupSessionStore } from "./session/store"
import type { Session } from "./session/durableObject"
import { db } from "./db"
import type { User } from "@prisma/client"
import { env } from "cloudflare:workers"
export { SessionDurableObject } from "./session/durableObject"
import { rssData1, rssData2 } from "./app/pages/Home/__mocks__/rssData"

export type AppContext = {
  session: Session | null
  user: User | null
}

export default defineApp([
  setCommonHeaders(),
  async ({ ctx, request, headers }) => {
    setupSessionStore(env)

    try {
      ctx.session = await sessions.load(request)
    } catch (error) {
      if (error instanceof ErrorResponse && error.code === 401) {
        await sessions.remove(request, headers)
        headers.set("Location", "/user/login")

        return new Response(null, {
          status: 302,
          headers,
        })
      }

      throw error
    }

    if (ctx.session?.userId) {
      ctx.user = await db.user.findUnique({
        where: {
          id: ctx.session.userId,
        },
      })
    }
  },
  render(Document, [
    route("/", () => <Home />),
    route("/ping", () => <h1>Pong!</h1>),
    route("/proxy/:url", async ({ params }) => {
      try {
        const url = decodeURIComponent(params.url)

        return fetch(url)
      } catch (error) {
        return new Response("Failed to fetch RSS feed", {
          status: 500,
          headers: { "Content-Type": "text/plain" },
        })
      }
    }),
    route("/TEST/:rssKey", async ({ params }) => {
      try {
        const rssKey = decodeURIComponent(params.rssKey)

        return new Response(rssKey === "rssData1" ? rssData1 : rssData2, {
          headers: {
            "Content-Type": "application/rss+xml",
          },
        })
      } catch (error) {
        return new Response("Failed to parse RSS data", {
          status: 500,
          headers: { "Content-Type": "text/plain" },
        })
      }
    }),
    route("/protected", [
      ({ ctx }) => {
        if (!ctx.user) {
          return new Response(null, {
            status: 302,
            headers: { Location: "/user/login" },
          })
        }
      },
      Home,
    ]),
    prefix("/user", userRoutes),
  ]),
])
