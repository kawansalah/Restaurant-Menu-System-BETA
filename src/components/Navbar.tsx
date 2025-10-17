import React, { useState, useEffect } from "react";
import { Menu, X, Home, Star, Award, Phone } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "@/contexts/ThemeContext";
// import MyMenuLight from "@/assets/logo/My Menu Light.svg";
import MyMenuDark from "@/assets/logo/My Menu Dark.svg";

interface NavbarProps {
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ className = "" }) => {
  const { theme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle active section detection
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["hero", "features", "benefits", "contact"];
      const scrollPosition = window.scrollY + 100;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    {
      id: "hero",
      label: "سەرەکی",
      icon: <Home className="w-4 h-4 mx-2" />,
    },
    {
      id: "features",
      label: "تایبەتمەندیەکان",
      icon: <Star className="w-4 h-4 mx-2" />,
    },
    {
      id: "benefits",
      label: "سوودەکان",
      icon: <Award className="w-4 h-4 mx-2" />,
    },
    {
      id: "contact",
      label: "پەیوەندی",
      icon: <Phone className="w-4 h-4 mx-2" />,
    },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${className}`}
        style={{
          backgroundColor: isScrolled ? "var(--bg-topbar)" : "transparent",
          backdropFilter: isScrolled ? "blur(12px)" : "none",
          borderBottom: isScrolled
            ? "1px solid var(--bg-topbar-border)"
            : "1px solid transparent",
          boxShadow: isScrolled ? "var(--topbar-shadow)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <button
                onClick={() => scrollToSection("hero")}
                className="flex items-center group transition-all duration-300 hover:scale-105"
              >
                <img
                  src={theme === "dark" ? MyMenuDark : MyMenuDark}
                  alt="My Menu Logo"
                  className="h-8 sm:h-10 w-auto transition-all duration-300"
                />
              </button>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8 rtl:space-x-reverse">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 rounded-full font-medium transition-all duration-300 hover:scale-105 ${
                    activeSection === item.id ? "shadow-lg" : "hover:shadow-md"
                  }`}
                  style={{
                    backgroundColor:
                      activeSection === item.id
                        ? "var(--bg-main)"
                        : "transparent",
                    color:
                      activeSection === item.id
                        ? "var(--button-text-primary)"
                        : "var(--text-secondary)",
                    boxShadow:
                      activeSection === item.id
                        ? "0 4px 15px rgba(182, 147, 75, 0.3)"
                        : "none",
                  }}
                  onMouseEnter={(e) => {
                    if (activeSection !== item.id) {
                      e.currentTarget.style.backgroundColor =
                        "var(--bg-search-bar)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeSection !== item.id) {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            {/* Theme Toggle & Mobile Menu Button */}
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <ThemeToggle />

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 mx-2ww rounded-full transition-all duration-300 hover:scale-105"
                style={{
                  backgroundColor: "var(--bg-card)",
                  color: "var(--text-secondary)",
                  border: "1px solid var(--category-stroke)",
                }}
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden transition-all duration-300 overflow-hidden ${
            isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
          style={{
            backgroundColor: "var(--bg-topbar)",
            borderTop: "1px solid var(--bg-topbar-border)",
          }}
        >
          <div className="px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`w-full flex items-center space-x-3 rtl:space-x-reverse px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeSection === item.id ? "shadow-md" : "hover:shadow-sm"
                }`}
                style={{
                  backgroundColor:
                    activeSection === item.id
                      ? "var(--bg-main)"
                      : "var(--bg-card)",
                  color:
                    activeSection === item.id
                      ? "var(--button-text-primary)"
                      : "var(--text-secondary)",
                  border: `1px solid ${
                    activeSection === item.id
                      ? "var(--bg-main)"
                      : "var(--category-stroke)"
                  }`,
                }}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Spacer to prevent content overlap */}
      <div className="h-16 lg:h-20" />
    </>
  );
};

export default Navbar;
