import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"
import Layout from "../components/layout"

const IndexPage: React.FC<PageProps> = () => {
  return (
    <Layout>
      <main>
        <h1>About Me</h1>
        <p>Hi there! I'm the proud creator of this site, which I built with Gatsby.</p>
      </main>
    </Layout>
  )
}

export default IndexPage

export const Head: HeadFC = () => <title>Home Page</title>
