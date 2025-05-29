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
    expect(
      screen.getByRole("article", {
        name: "From Agile to Apathy: Why Google Didn’t Work for Me.",
      }),
    ).toBeInTheDocument()
  })
})
