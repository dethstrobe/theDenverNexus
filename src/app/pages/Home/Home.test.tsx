import { render, screen } from "@testing-library/react"
import { Home } from "./"
import userEvent from "@testing-library/user-event"
import "../../../test/msw"
import "fake-indexeddb/auto"
import { indexedDB } from "fake-indexeddb"

describe("Home", () => {
  const user = userEvent.setup()

  beforeEach(() => {
    // Clear the indexedDB before each test to ensure a clean state
    // biome-ignore lint/suspicious/noExplicitAny: this is hacky bullshit anyway
    ;(indexedDB as any)._databases.clear()
  })

  test("home page should allow you to follow an rss feed", async () => {
    render(<Home />)
    expect(screen.getByText("Home")).toBeInTheDocument()
    expect(screen.queryByRole("article")).not.toBeInTheDocument()

    const rssFeedUrlInput = screen.getByRole("textbox", {
      name: "RSS Feed URL to Follow",
    })
    expect(rssFeedUrlInput).toBeInTheDocument()
    await user.type(rssFeedUrlInput, "https://example.com/rss")
    const submitButton = screen.getByRole("button", { name: "Add to Feed" })
    await user.click(submitButton)
    expect(rssFeedUrlInput).toHaveValue("")

    // Verify the RSS feed post is displayed
    const articles = await screen.findAllByRole("article")
    expect(articles).toHaveLength(4)
    expect(articles[0]).toHaveTextContent("Article 4 Title.")
    expect(
      screen.getByRole("link", { name: "Article 4 Title." }),
    ).toHaveAttribute("href", "https://example.com/blog/article-4/")
    expect(articles[1]).toHaveTextContent("Article 3 Title.")
    expect(
      screen.getByRole("link", { name: "Article 3 Title." }),
    ).toHaveAttribute("href", "https://example.com/blog/article-3/")
    expect(articles[2]).toHaveTextContent("Article 2 Title.")
    expect(
      screen.getByRole("link", { name: "Article 2 Title." }),
    ).toHaveAttribute("href", "https://example.com/blog/article-2/")
    expect(articles[3]).toHaveTextContent("First Post Title.")
    expect(
      screen.getByRole("link", { name: "First Post Title." }),
    ).toHaveAttribute("href", "https://example.com/blog/firstpost/")
  })

  test("should persist the rss feed", async () => {
    // First render and fetch
    const { unmount } = render(<Home />)

    //initial page load
    let articles = screen.queryAllByRole("article")
    expect(articles).toHaveLength(0)

    await user.type(
      screen.getByRole("textbox", {
        name: "RSS Feed URL to Follow",
      }),
      "https://example.com/rss",
    )
    await user.click(screen.getByRole("button", { name: "Add to Feed" }))

    articles = await screen.findAllByRole("article")
    expect(articles).toHaveLength(4)
    expect(articles[0]).toHaveTextContent("Article 4 Title.")
    expect(articles[1]).toHaveTextContent("Article 3 Title.")
    expect(articles[2]).toHaveTextContent("Article 2 Title.")
    expect(articles[3]).toHaveTextContent("First Post Title.")

    // Unmount the component to simulate a page reload
    unmount()

    // Render a fresh instance
    render(<Home />)

    // Content should be loaded from localStorage
    articles = await screen.findAllByRole("article")
    expect(articles).toHaveLength(4)
    expect(articles[0]).toHaveTextContent("Article 4 Title.")
    expect(articles[1]).toHaveTextContent("Article 3 Title.")
    expect(articles[2]).toHaveTextContent("Article 2 Title.")
    expect(articles[3]).toHaveTextContent("First Post Title.")
  })

  test("should aggregate multiple rss feeds", async () => {
    render(<Home />)

    const rssFeedUrlInput = screen.getByRole("textbox", {
      name: "RSS Feed URL to Follow",
    })
    const addToFeedButton = screen.getByRole("button", { name: "Add to Feed" })

    await user.type(rssFeedUrlInput, "https://example.com/rss")
    await user.click(addToFeedButton)
    expect(rssFeedUrlInput).toHaveValue("")

    await user.clear(rssFeedUrlInput)
    await user.type(rssFeedUrlInput, "https://website.net/feed.xml")
    await user.click(addToFeedButton)
    await screen.findByText("10 websites. You won't believe #4.")

    const articles = await screen.findAllByRole("article")
    expect(articles).toHaveLength(6)
    expect(articles[0]).toHaveTextContent("10 websites. You won't believe #4.")
    expect(articles[1]).toHaveTextContent("Article 4 Title.")
    expect(articles[2]).toHaveTextContent(
      "10 click bait headlines. Doctors don't want you to know.",
    )
    expect(articles[3]).toHaveTextContent("Article 3 Title.")
    expect(articles[4]).toHaveTextContent("Article 2 Title.")
    expect(articles[5]).toHaveTextContent("First Post Title.")
  })
})
