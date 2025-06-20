The Test2Doc is a project that generates documentation based on tests, helping you keep your technical documentation automatically in sync with your code.

# Test2Doc Playwright Reporter
The `@test2doc/playwright` package is a [Playwright](https://playwright.dev/) reporter that generates documentation in markdown. It is intended to work with [Docusaurus](https://docusaurus.io/).

## Installation & Setup

### Install the Reporter
If you don't have Playwright currently installed, you can follow [Playwright's installation guide](https://playwright.dev/docs/intro#installing-playwright). (Don't forget to run `npx playwright install` to install browsers after Playwright itself!)

After installing Playwright you can add the `@test2doc/playwright` with your package manager of choice:

```sh
# npm
npm install @test2doc/playwright -D
# yarn
yarn add @test2doc/playwright --dev
# pnpm
pnpm install @test2doc/playwright -D
```

#### Configure Playwright
Add the reporter to your `playwright.config.ts`

```ts
// playwright.config.ts or playwright.config.js
import { defineConfig, ... } from "@playwright/test"

...

export default defineConfig({
  ...
  reporter: [
    ...
    ["@test2doc/playwright", { outputDir: "./path/to/docs" }],
  ],
  ...
})
```

Replace `"./path/to/docs"` with a path to the `doc` directory of your Docusaurus app.

#### Setup Docusaurus
This reporter generates markdown files for Docusaurus. If you don't have a Docusaurus app set up yet there is an install guide [here](https://docusaurus.io/docs/installation). If you have a monorepo I recommend using these [instructions](https://docusaurus.io/docs/installation#monorepos)

Else you can install the Docusaurus app within your current repo with:

```sh
npx create-docusaurus@latest doc classic --typescript
```

This will make a `doc` directory with your Docusaurus app.

Then set the `outputDir` in the `playwright.config.ts` to `"./doc/docs"`

```ts
// playwright.config.ts
export default defineConfig({
  ...
  reporter: [
    ...
    ["@test2doc/playwright", { outputDir: "./doc/docs" }],
  ],
  ...
})
```

## How it works

After this setup, every time you run your Playwright tests, the `@test2doc/playwright` reporter will automatically generate a new markdown file in your specified Docusaurus docs directory for each top-level describe block found in your Playwright test files.