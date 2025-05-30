import { render, screen } from "@testing-library/react"
import { Home } from "./"
import userEvent from "@testing-library/user-event"
import "../../../test/msw"

describe("Home", () => {
  const user = userEvent.setup()
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
    const articles = screen.getAllByRole("article")
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
})
