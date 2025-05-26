"use client"

export const Home = () => {
  return (
    <div>
      <h1>Home</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          const formData = new FormData(e.currentTarget)
          const rssFeedUrl = formData.get("rssFeedUrl")
          // Handle the RSS feed URL here
          console.log("RSS Feed URL:", rssFeedUrl)
          // Clear the input after submission
          e.currentTarget.reset()
        }}
      >
        <label htmlFor="rssFeedUrl">RSS Feed URL to Follow</label>
        <input
          id="rssFeedUrl"
          type="text"
          name="rssFeedUrl"
          placeholder="Input RSS Feed URL"
        />
        <button type="submit">Add to Feed</button>
      </form>
    </div>
  )
}
