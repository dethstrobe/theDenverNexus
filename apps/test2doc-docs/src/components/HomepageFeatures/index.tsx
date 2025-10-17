import type { ReactNode } from "react"
import clsx from "clsx"
import Heading from "@theme/Heading"
import styles from "./styles.module.css"

type FeatureItem = {
  title: string
  Svg: React.ComponentType<React.ComponentProps<"svg">>
  description: ReactNode
}

const FeatureList: FeatureItem[] = [
  {
    title: "Playwright to Docusaurus",
    Svg: require("@site/static/img/playwright-to-docusaurus.svg").default,
    description: (
      <>Make your Playwright tests into living documentation for Docusaurus.</>
    ),
  },
  {
    title: "Compliance You Can Rest Easy On",
    Svg: require("@site/static/img/sunset.svg").default,
    description: (
      <>
        Keep compliance documentation automatically in sync with your code. No
        more scrambling before audits.
      </>
    ),
  },
  {
    title: "Your Single Source of Truth",
    Svg: require("@site/static/img/cool-cucumber.svg").default,
    description: (
      <>Tests become shared source of truth for what the app actually does.</>
    ),
  },
]

function Feature({ title, Svg, description }: FeatureItem) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center feature-item">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md padding-bottom--lg feature-item">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  )
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  )
}
