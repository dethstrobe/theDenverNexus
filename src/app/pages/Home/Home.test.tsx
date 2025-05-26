import { render, screen } from "@testing-library/react"
import { Home } from "./"
import userEvent from "@testing-library/user-event"

describe("Home", () => {
  const user = userEvent.setup()
  test("renders home page", async () => {
    render(<Home />)
    expect(screen.getByText("Home")).toBeInTheDocument()
    const rssFeedUrlInput = screen.getByRole("textbox", {
      name: "RSS Feed URL to Follow",
    })
    expect(rssFeedUrlInput).toBeInTheDocument()
    await user.type(rssFeedUrlInput, "https://example.com/rss")
    const submitButton = screen.getByRole("button", { name: "Add to Feed" })
    await user.click(submitButton)
    expect(rssFeedUrlInput).toHaveValue("")
  })
})
