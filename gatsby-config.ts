import type { GatsbyConfig } from "gatsby";
import { loadSiteConfig } from './src/utils/config-loader';

const siteConfig = loadSiteConfig();

const config: GatsbyConfig = {
  siteMetadata: {
    title: siteConfig.title,
    siteUrl: siteConfig.siteUrl,
    menuLinks: [
      {
        name: "Home",
        link: "/",
      },
      {
        name: "Works",
        link: "/works",
        submenu: [
          {
            name: "Digital Art",
            link: "/works/digital-art",
          },
          {
            name: "Traditional Art",
            link: "/works/traditional-art",
          },
          {
            name: "Sewing",
            link: "/works/sewing",
          },  
        ],
      },
      {
        name: "About",
        link: "/about",
      },
      {
        name: "Contact",
        link: "/contact",
      },
    ],
  },
  // More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
  // If you use VSCode you can also use the GraphQL plugin
  // Learn more at: https://gatsby.dev/graphql-typegen
  graphqlTypegen: true,
  plugins: ["gatsby-plugin-image", "gatsby-plugin-sitemap", "gatsby-plugin-mdx", "gatsby-plugin-sharp", "gatsby-transformer-sharp", "gatsby-plugin-postcss", {
    resolve: 'gatsby-source-filesystem',
    options: {
      "name": "images",
      "path": process.env.IMAGES_PATH || "./src/images/"
    },
    __key: "images"
  }, {
    resolve: 'gatsby-source-filesystem',
    options: {
      "name": "pages",
      "path": "./src/pages/"
    },
    __key: "pages"
  }]
};

export default config;
