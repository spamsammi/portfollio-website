import React from "react";
import { Link } from "gatsby";
import { useStaticQuery, graphql } from "gatsby";
import SafeGatsbyImage from "./safeGatsbyImage";

interface HeaderProps {
    siteTitle: string;
    menuLinks: Array<{
        name: string;
        link: string;
        submenu?: Array<{
            name: string;
            link: string;
        }>;
    }>;
}

const Header: React.FC<HeaderProps> = ({ siteTitle, menuLinks }) => {
    // Add state to track mobile menu
    const [openMenus, setOpenMenus] = React.useState<string[]>([]);
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

    function isActive({ isCurrent }: { isCurrent: boolean }) {
        return isCurrent ? { className: "text-[#008080] transition hover:text-[#DC143C]/50" } : {}
    }

    // Toggle submenu function for mobile
    const toggleSubmenu = (menuName: string) => {
        setOpenMenus(prevOpenMenus => 
            prevOpenMenus.includes(menuName)
                ? prevOpenMenus.filter(name => name !== menuName)
                : [...prevOpenMenus, menuName]
        );
    };

    const data = useStaticQuery(graphql`
        query {
          logo: file(relativePath: { eq: "logo/icon.png" }) {
            childImageSharp {
              gatsbyImageData(width: 40, placeholder: BLURRED, formats: [AUTO, WEBP])
            }
          }
        }
      `);
    const logo = data?.logo?.childImageSharp?.gatsbyImageData;

    return (
        <header className="bg-[#FFDAB9]">
            <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center">
                        {/* Logo/Image container */}
                        <div className="mr-4">
                            <Link to="/">
                                <SafeGatsbyImage 
                                    imageData={logo} 
                                    alt="Logo" 
                                    className="h-10 w-auto"
                                />
                            </Link>
                        </div>
                        
                        {/* Logo/Text container */}
                        <h1>
                            <Link to="/" className="block text-[#DC143C] text-2xl font-bold">
                                {siteTitle}
                            </Link>
                        </h1>
                    </div>
                    <div className="md:flex md:items-center md:gap-12">
                        {/* Menu container */}
                        <nav aria-label="Global" className="hidden md:block">
                            <ul className="flex items-center gap-6 text-base">
                                {menuLinks.map(link => (
                                    <li key={link.name} className="relative group">
                                        <Link 
                                            to={link.link}
                                            getProps={isActive}
                                            className="text-[#DC143C] transition hover:text-[#DC143C]/50 flex items-center gap-1"
                                        >
                                            {link.name}
                                            {link.submenu && (
                                                <svg 
                                                    xmlns="http://www.w3.org/2000/svg" 
                                                    className="h-4 w-4" 
                                                    fill="none" 
                                                    viewBox="0 0 24 24" 
                                                    stroke="currentColor"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            )}
                                        </Link>
                                        
                                        {link.submenu && (
                                            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-auto min-w-[120px] bg-[#FFDAB9] shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transform group-hover:translate-y-0 -translate-y-1 transition-all duration-300 ease-in-out z-10">
                                                <div className="py-1">
                                                    {link.submenu.map(subItem => (
                                                        <Link
                                                            key={subItem.name}
                                                            to={subItem.link}
                                                            getProps={isActive}
                                                            className="block px-4 py-2 text-base text-[#DC143C] hover:bg-[#FFB6A3] text-center whitespace-nowrap"
                                                        >
                                                            {subItem.name}
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </nav>

                        {/* Mobile menu button */}
                        <div className="block md:hidden">
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="rounded-sm bg-[#FFB6A3] hover:bg-[#FFB6A3]/50 p-2 text-[#DC143C] transition hover:text-[#DC143C]/50"
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

                {/* Mobile Menu with transition */}
                <div 
                    className="md:hidden overflow-hidden transition-all duration-300 ease-in-out"
                    style={{ 
                        maxHeight: mobileMenuOpen ? '1000px' : '0',
                        opacity: mobileMenuOpen ? 1 : 0,
                        visibility: mobileMenuOpen ? 'visible' : 'hidden'
                    }}
                >
                    <div className="bg-[#FFDAB9] py-4">
                        <nav>
                            <ul className="space-y-2 flex flex-col items-end pr-4">
                                {menuLinks.map(link => (
                                    <li key={link.name} className="text-right w-full flex flex-col items-end">
                                        {link.submenu ? (
                                            <>
                                                <div className="flex items-center justify-end gap-1">
                                                    {openMenus.includes(link.name) ? (
                                                        <Link 
                                                            to={link.link}
                                                            getProps={isActive}
                                                            className="py-2 text-[#DC143C] hover:text-[#DC143C]/50 transition-colors duration-300"
                                                        >
                                                            {link.name}
                                                        </Link>
                                                    ) : (
                                                        <button 
                                                            onClick={() => toggleSubmenu(link.name)}
                                                            className="py-2 text-[#DC143C] hover:text-[#DC143C]/50 transition-colors duration-300"
                                                        >
                                                            {link.name}
                                                        </button>
                                                    )}
                                                    <button 
                                                        onClick={() => toggleSubmenu(link.name)}
                                                        className="p-1 text-[#DC143C] hover:text-[#DC143C]/50 flex items-center transition-colors duration-300"
                                                        aria-label={`Toggle ${link.name} submenu`}
                                                    >
                                                        <svg 
                                                            xmlns="http://www.w3.org/2000/svg" 
                                                            className={`h-4 w-4 transition-transform duration-300 ${openMenus.includes(link.name) ? 'rotate-180' : ''}`}
                                                            fill="none" 
                                                            viewBox="0 0 24 24" 
                                                            stroke="currentColor"
                                                        >
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                        </svg>
                                                    </button>
                                                </div>
                                                
                                                <div className="w-full overflow-hidden transition-all duration-300 ease-in-out"
                                                     style={{ 
                                                         maxHeight: openMenus.includes(link.name) ? '200px' : '0',
                                                         opacity: openMenus.includes(link.name) ? 1 : 0
                                                     }}>
                                                    <ul className="w-full flex flex-col items-end mt-1 pl-4 space-y-1">
                                                        {link.submenu.map(subItem => (
                                                            <li key={subItem.name} className="text-right">
                                                                <Link 
                                                                    to={subItem.link}
                                                                    getProps={isActive}
                                                                    className="block py-1 text-[#DC143C] hover:text-[#DC143C]/50 whitespace-nowrap transition-colors duration-300"
                                                                >
                                                                    {subItem.name}
                                                                </Link>
                                                            </li>
                                                        ))}
                                                        <li className="text-right">
                                                            <button 
                                                                onClick={() => toggleSubmenu(link.name)}
                                                                className="block py-1 text-[#DC143C] hover:text-[#DC143C]/50 opacity-70 hover:opacity-100 flex items-center transition-all duration-300"
                                                            >
                                                                <svg 
                                                                    xmlns="http://www.w3.org/2000/svg" 
                                                                    className="h-4 w-4 mr-1 rotate-90" 
                                                                    fill="none" 
                                                                    viewBox="0 0 24 24" 
                                                                    stroke="currentColor"
                                                                >
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                                                </svg>
                                                                Back
                                                            </button>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </>
                                        ) : (
                                            <Link 
                                                to={link.link}
                                                getProps={isActive}
                                                className="block py-2 text-[#DC143C] hover:text-[#DC143C]/50 transition-colors duration-300"
                                            >
                                                {link.name}
                                            </Link>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </header>
    )
}
  
export default Header