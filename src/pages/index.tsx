import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"
import Layout from "../components/layout"
import SafeGatsbyImage from "../components/safeGatsbyImage"
import { useStaticQuery, graphql, Link } from "gatsby";

const IndexPage: React.FC<PageProps> = () => {

  const data = useStaticQuery(graphql`
    query {
      splash: file(relativePath: { eq: "splash.jpg" }) {
        childImageSharp {
          gatsbyImageData(width: 1920, placeholder: BLURRED, formats: [AUTO, WEBP])
        }
      }
    }
  `);
  const splash = data?.splash?.childImageSharp?.gatsbyImageData;

  return (
    <Layout>
      <div className="w-full max-w-screen overflow-hidden">
        <SafeGatsbyImage
          imageData={splash}
          alt="Splash"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="bg-[#FFDAB9] text-[#DC143C] px-8 py-8 rounded-lg m-4">
        <h2 className="text-2xl font-bold mb-4">My short intro</h2>
        <p className="mb-4">Some of my services include</p>
        <ul className="list-disc list-inside mb-4">
          <li>
            <Link to="/works/digital-art" className="hover:text-[#DC143C]/50 transition">Digital Art</Link>
          </li>
          <li>
            <Link to="/works/traditional-art" className="hover:text-[#DC143C]/50 transition">Traditional Art</Link>
          </li>
          <li>
            <Link to="/works/sewing" className="hover:text-[#DC143C]/50 transition">Sewing</Link>
          </li>
        </ul>
        <p className="font-semibold">
          <Link to="/about" className="hover:text-[#DC143C]/50 transition">Contact me</Link>
        </p>
      </div>
    </Layout>
  )
}

export default IndexPage

export const Head: HeadFC = () => <title>Home Page</title>
