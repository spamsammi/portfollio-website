import React from "react";
import { StaticQuery, graphql } from "gatsby";
import { Helmet } from "react-helmet-async";
import Header from "./header";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <StaticQuery
    query={graphql`
      query SiteTitleQuery {
        site {
          siteMetadata {
            title
            menuLinks {
              name
              link
              submenu {
                name
                link
              }
            }
          }
        }
      }
    `}
    render={data => (
      <React.Fragment>
        <Helmet
          title={data.site.siteMetadata.title}
          meta={[
            { name: 'description', content: 'Sample' },
            { name: 'keywords', content: 'sample, something' },
          ]}
        >
        </Helmet>
        <Header menuLinks={data.site.siteMetadata.menuLinks} siteTitle={data.site.siteMetadata.title} />
        <div>
          {children}
        </div>
      </React.Fragment>
    )}
  />
)

export default Layout;