import { render, screen } from "@testing-library/react"
import { Home } from "./"

describe("Home", () => {
  test("renders home page", () => {
    render(<Home />)
    expect(screen.getByText("Home")).toBeInTheDocument()
  })
})
