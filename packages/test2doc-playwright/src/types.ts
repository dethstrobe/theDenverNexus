import type { AnnotationOptions } from "./screenshots.js"

export interface Test2DocConfig {
  annotationDefaults?: Partial<AnnotationOptions>
}

declare module "@playwright/test" {
  interface PlaywrightTestOptions {
    test2doc?: Test2DocConfig
  }
}
