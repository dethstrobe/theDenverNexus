export const Screenshot = () => {
  return (
    <main className="h-[200vh] flex flex-col items-center justify-center">
      <h1 className="w-full text-4xl font-bold text-gray-900 mb-4 text-left flex-1">Screenshot Page</h1>
      <p className="w-1/2 self-center flex-1">This page is intended for testing screenshots.</p>
      <fieldset className="w-1/2 self-end flex-0">
        <legend className="text-lg font-semibold mb-2">Screenshot Functionality</legend>
        <label className="block mb-2">
          <input type="radio" name="screenshot-option" value="header" disabled />
          header
        </label>
        <label className="block mb-2">
          <input type="radio" name="screenshot-option" value="fieldset" disabled />
          fieldset
        </label>
      </fieldset>
      <p className="w-1/2 self-end flex-0">Currently, the screenshot functionality is not implemented.</p>
    </main>
  )
}