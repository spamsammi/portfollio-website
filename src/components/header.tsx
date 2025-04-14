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
        <header className="bg-[#FFDAB9]">
            <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <h1>
                        <Link to="/" className="block text-[#DC143C] text-xl font-bold">
                            {siteTitle}
                        </Link>
                    </h1>
                    <div className="md:flex md:items-center md:gap-12">
                        <nav aria-label="Global" className="hidden md:block">
                            <ul className="flex items-center gap-6 text-sm">
                                {menuLinks.map(link => (
                                    <li key={link.name}>
                                        <Link 
                                            to={link.link}
                                            className="text-[#DC143C] transition hover:text-[#DC143C]/75"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>

                        <div className="block md:hidden">
                            <button
                                className="rounded-sm bg-[#FFB6A3] p-2 text-[#DC143C] transition hover:text-[#DC143C]/75"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}
  
Header.defaultProps = {
    siteTitle: ``,
}
  
export default Header