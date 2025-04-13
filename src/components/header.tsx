import React from "react";
import { Link } from "gatsby";

interface HeaderProps {
    siteTitle: string;
    menuLinks: Array<{
        name: string;
        link: string;
    }>;
}

const Header: React.FC<HeaderProps> = ({ siteTitle, menuLinks }) => {
    return (
        <header>
            <h1>
                <Link to="/">
                    {siteTitle}
                </Link>
            </h1>
            <div>
                <nav>
                    <ul>
                    {menuLinks.map(link => (
                        <li key={link.name}>
                            <Link to={link.link}>
                                {link.name}
                            </Link>
                        </li>
                    ))}
                    </ul>
                </nav>
            </div>
        </header>
    )
}
  
Header.defaultProps = {
    siteTitle: ``,
}
  
export default Header