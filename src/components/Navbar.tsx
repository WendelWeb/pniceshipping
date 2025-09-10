// src/components/Navbar.tsx
import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import "./navbar.css";
import {
  SignedOut,
  SignedIn,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import AdminButton from "@/admin/components/AdminButton";
import pniceLogo from "../assets/pnicelogo.png";

// Define navigation items to avoid repetition
const navItems = [
  { label: "Accueil", href: "/home", isLink: true },
  { label: "Nos services", href: "#services", isLink: false },
  { label: "Nos prix", href: "#pricings", isLink: false },
  { label: "A propos", href: "/about", isLink: true },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activateAnimation, setActivateAnimation] = useState<"active" | "closed" | "">("");

  // Use useCallback to prevent recreation on every render
  const toggleHandler = useCallback(() => {
    if (!isOpen) {
      setIsOpen(true);
    } else {
      setActivateAnimation("closed");
      setTimeout(() => {
        setIsOpen(false);
      }, 400);
    }
  }, [isOpen]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isOpen && !target.closest('.side-nav') && !target.closest('.hamberger')) {
        toggleHandler();
      }
    };

    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen, toggleHandler]);

  // Handle animation state
  useEffect(() => {
    if (isOpen) {
      // Use requestAnimationFrame for smoother animation
      const animationFrame = requestAnimationFrame(() => {
        setActivateAnimation("active");
      });
      return () => cancelAnimationFrame(animationFrame);
    } else {
      setActivateAnimation("");
    }
  }, [isOpen]);

  // Close mobile menu on route change or hash change
  useEffect(() => {
    const handleRouteChange = () => {
      if (isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('hashchange', handleRouteChange);
    return () => window.removeEventListener('hashchange', handleRouteChange);
  }, [isOpen]);

  // Render navigation item based on type
  const renderNavItem = (item: typeof navItems[0], onClick?: () => void) => {
    const className = "text-gray-700 hover:text-blue-600 transition-colors duration-200";
    
    if (item.isLink) {
      return (
        <Link 
          key={item.href}
          to={item.href} 
          className={className}
          onClick={onClick}
        >
          {item.label}
        </Link>
      );
    }
    
    return (
      <a 
        key={item.href}
        href={item.href} 
        className={className}
        onClick={onClick}
      >
        {item.label}
      </a>
    );
  };

  // Sign in button component for reuse
  const SignInButtonComponent = () => (
    <SignedOut>
      <SignInButton>
        <button className="bg-blue-600 text-white px-6 cursor-pointer py-2 border border-blue-600 rounded-md hover:bg-white hover:text-blue-600 transition-all duration-300 font-medium">
          Se connecter
        </button>
      </SignInButton>
    </SignedOut>
  );

  return (
    <>
      <nav className="md:bg-white bg-amber-100 md:shadow-sm fixed w-full top-0 z-50">
        <div className="max-w-8xl mx-auto lg:mx-10 px-4 sm:px-6 lg:px-5">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center group">
                <div className="h-8 w-45 rounded-md flex items-center justify-center">
                  <img 
                    src={pniceLogo} 
                    alt="PNICE Logo" 
                    className="transition-transform duration-200 group-hover:scale-105"
                    loading="eager"
                  />
                </div>
              </Link>
            </div>

            <AdminButton />

            {/* Navigation Links - Desktop */}
            <div className="hidden md:flex text-xl items-center space-x-8">
              {navItems.map(item => renderNavItem(item))}
            </div>

            {/* Auth Section - Desktop */}
            <div className="hidden md:flex items-center space-x-4">
              <SignInButtonComponent />
              <SignedIn>
                <UserButton 
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10"
                    }
                  }}
                />
              </SignedIn>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden hamberger">
              <button
                onClick={toggleHandler}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors duration-200"
                aria-label={isOpen ? "Close menu" : "Open menu"}
                aria-expanded={isOpen}
              >
                <svg
                  className="block h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  {!isOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div 
            className={`md:hidden side-nav ${activateAnimation}`}
            role="navigation"
            aria-label="Mobile navigation"
          >
            <div className="px-4 pt-4 pb-6 space-y-3 bg-white shadow-lg">
              {/* Auth Section - Mobile */}
              <div className="pb-3 border-b border-gray-200">
                <SignInButtonComponent />
                <SignedIn>
                  <div className="mt-3">
                    <UserButton 
                      afterSignOutUrl="/"
                      appearance={{
                        elements: {
                          avatarBox: "w-10 h-10"
                        }
                      }}
                    />
                  </div>
                </SignedIn>
              </div>

              {/* Navigation Links - Mobile */}
              <nav className="space-y-1">
                {navItems.map(item => (
                  <div key={item.href}>
                    {item.isLink ? (
                      <Link
                        to={item.href}
                        className="text-gray-700 block px-3 py-3 rounded-md hover:text-blue-600 hover:bg-gray-50 transition-colors duration-200"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <a
                        href={item.href}
                        className="text-gray-700 block px-3 py-3 rounded-md hover:text-blue-600 hover:bg-gray-50 transition-colors duration-200"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.label}
                      </a>
                    )}
                  </div>
                ))}
              </nav>
            </div>
          </div>
        )}
      </nav>

      {/* Overlay for mobile menu */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-25 z-40 md:hidden"
          onClick={toggleHandler}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default Navbar;