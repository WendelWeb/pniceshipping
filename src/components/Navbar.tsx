// src/components/Navbar.tsx
import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import "./navbar.css";
import {
  SignedOut,
  SignedIn,
  SignUpButton,
  UserButton,
} from "@clerk/clerk-react";
import AdminButton from "@/admin/components/AdminButton";
import pniceLogo from "../assets/pnicelogo.png";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, 
  Settings, 
  CreditCard, 
  Info, 
  Menu, 
  X, 
  Sparkles,
  Zap
} from "lucide-react";

// Define navigation items to avoid repetition
const navItems = [
  { label: "Accueil", href: "/home", isLink: true, icon: Home, emoji: "🏠" },
  { label: "Nos services", href: "#services", isLink: false, icon: Settings, emoji: "⚡" },
  { label: "Nos prix", href: "#pricings", isLink: false, icon: CreditCard, emoji: "💎" },
  { label: "A propos", href: "/about", isLink: true, icon: Info, emoji: "🚀" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activateAnimation, setActivateAnimation] = useState<"active" | "closed" | "">("");
  const [scrolled, setScrolled] = useState(false);
  console.log(activateAnimation);
  

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  // Animation variants
  const navbarVariants = {
    initial: { y: -100, opacity: 0 },
    animate: { y: 0, opacity: 1 },
  };

  const logoVariants = {
    initial: { scale: 0, rotate: -180 },
    animate: { 
      scale: 1, 
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
        delay: 0.2
      }
    },
    hover: { 
      scale: 1.05,
      rotate: 5,
      transition: { duration: 0.2 }
    }
  };

  const linkVariants = {
    initial: { y: -20, opacity: 0 },
    animate: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: 0.1 + i * 0.1,
        type: "spring",
        stiffness: 100
      }
    }),
    hover: {
      scale: 1.05,
      color: "#60a5fa",
      transition: { duration: 0.2 }
    }
  };

  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      x: "100%",
      transition: {
        type: "tween",
        duration: 0.3
      }
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        type: "tween",
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const childVariants = {
    initial: { x: 50, opacity: 0 },
    animate: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  // Render navigation item based on type
  const renderNavItem = (item: typeof navItems[0], index: number, onClick?: () => void, isMobile = false) => {
    const Icon = item.icon;
    const baseClassName = `
      relative group flex items-center space-x-2 px-4 py-2 rounded-xl font-medium
      text-slate-300 hover:text-blue-400 transition-all duration-300
      hover:bg-slate-800/50 backdrop-blur-sm
      ${isMobile ? 'w-full justify-start text-lg py-4' : ''}
    `;
    
    const content = (
      <>
        <Icon className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
        <span className="relative">
          {item.emoji} {item.label}
          <motion.span 
            className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 group-hover:w-full transition-all duration-300"
            initial={{ width: 0 }}
            whileHover={{ width: "100%" }}
          />
        </span>
        {!isMobile && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100"
            initial={{ scale: 0.8, opacity: 0 }}
            whileHover={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </>
    );
    
    if (item.isLink) {
      return (
        <motion.div
          key={item.href}
          variants={isMobile ? childVariants : linkVariants}
          custom={index}
          whileHover="hover"
          whileTap={{ scale: 0.98 }}
        >
          <Link 
            to={item.href} 
            className={baseClassName}
            onClick={onClick}
          >
            {content}
          </Link>
        </motion.div>
      );
    }
    
    return (
      <motion.div
        key={item.href}
        variants={isMobile ? childVariants : linkVariants}
        custom={index}
        whileHover="hover"
        whileTap={{ scale: 0.98 }}
      >
        <a 
          href={item.href} 
          className={baseClassName}
          onClick={onClick}
        >
          {content}
        </a>
      </motion.div>
    );
  };

  // Sign in button component for reuse
  const SignInButtonComponent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <SignedOut>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <SignUpButton>
          <button className={`
            relative overflow-hidden group
            bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold
            px-6 py-3 rounded-xl transition-all duration-300
            hover:from-blue-500 hover:to-purple-500
            shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40
            border border-blue-500/20 hover:border-blue-400/40
            ${isMobile ? 'w-full text-center justify-center' : ''}
            flex items-center space-x-2
          `}>
            <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
            <span>✨ Créer un compte</span>
            <motion.div
              className="absolute inset-0 bg-white/20"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.6 }}
            />
          </button>
        </SignUpButton>
      </motion.div>
    </SignedOut>
  );

  return (
    <>
      <motion.nav 
        variants={navbarVariants}
        initial="initial"
        animate="animate"
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`
          fixed w-full top-0 z-50 transition-all duration-500
          ${scrolled 
            ? 'bg-slate-900/95 backdrop-blur-md shadow-2xl shadow-black/20 border-b border-slate-800/50' 
            : 'bg-slate-900/80 backdrop-blur-sm md:bg-slate-900/90'
          }
        `}
      >
        <div className="max-w-8xl mx-auto lg:mx-10 px-4 sm:px-6 lg:px-5">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <motion.div 
              className="flex-shrink-0 flex items-center"
              variants={logoVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
            >
              <Link to="/" className="flex items-center group">
                <motion.div className="relative h-12 w-auto rounded-xl flex items-center justify-center overflow-hidden">
                  <img 
                    src={pniceLogo} 
                    alt="PNICE Logo" 
                    className="h-full w-auto object-contain filter brightness-110 group-hover:brightness-125 transition-all duration-300"
                    loading="eager"
                  />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-xl opacity-0 group-hover:opacity-100"
                    initial={{ scale: 0 }}
                    whileHover={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              <AdminButton />
            </motion.div>

            {/* Navigation Links - Desktop */}
            <motion.div 
              className="hidden md:flex items-center space-x-2"
              variants={staggerChildren}
              initial="initial"
              animate="animate"
            >
              {navItems.map((item, index) => renderNavItem(item, index))}
            </motion.div>

            {/* Auth Section - Desktop */}
            <motion.div 
              className="hidden md:flex items-center space-x-4"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <SignInButtonComponent />
              <SignedIn>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative"
                >
                  <UserButton 
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        avatarBox: "w-12 h-12 rounded-xl border-2 border-slate-700 hover:border-blue-500 transition-colors shadow-lg shadow-black/20"
                      }
                    }}
                  />
                  <motion.div
                    className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl opacity-0 group-hover:opacity-20 blur-sm"
                    initial={{ scale: 0 }}
                    whileHover={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              </SignedIn>
            </motion.div>

            {/* Mobile menu button */}
            <motion.div 
              className="md:hidden hamberger"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.3 }}
            >
              <motion.button
                onClick={toggleHandler}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="
                  relative inline-flex items-center justify-center p-3 rounded-xl
                  text-slate-300 hover:text-blue-400 hover:bg-slate-800/50
                  transition-all duration-300 backdrop-blur-sm
                  border border-slate-700/50 hover:border-blue-500/50
                "
                aria-label={isOpen ? "Close menu" : "Open menu"}
                aria-expanded={isOpen}
              >
                <AnimatePresence mode="wait">
                  {!isOpen ? (
                    <motion.div
                      key="menu"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="h-6 w-6" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="h-6 w-6" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              className="md:hidden side-nav fixed top-20 right-0 w-80 h-screen z-50"
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              role="navigation"
              aria-label="Mobile navigation"
            >
              <motion.div className="
                h-full px-6 py-8 space-y-6
                bg-slate-900/98 backdrop-blur-xl
                border-l border-slate-800/50
                shadow-2xl shadow-black/50
              ">
                {/* Auth Section - Mobile */}
                <motion.div 
                  className="pb-6 border-b border-slate-800/50"
                  variants={staggerChildren}
                  initial="initial"
                  animate="animate"
                >
                  <motion.div variants={childVariants}>
                    <SignInButtonComponent isMobile />
                  </motion.div>
                  <SignedIn>
                    <motion.div className="mt-4 flex items-center space-x-3" variants={childVariants}>
                      <UserButton 
                        afterSignOutUrl="/"
                        appearance={{
                          elements: {
                            avatarBox: "w-12 h-12 rounded-xl border-2 border-slate-700"
                          }
                        }}
                      />
                      <motion.div 
                        className="flex items-center space-x-2"
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Zap className="w-4 h-4 text-blue-400" />
                        <span className="text-slate-300 font-medium">⚡ Connecté</span>
                      </motion.div>
                    </motion.div>
                  </SignedIn>
                </motion.div>

                {/* Navigation Links - Mobile */}
                <motion.nav 
                  className="space-y-2"
                  variants={staggerChildren}
                  initial="initial"
                  animate="animate"
                >
                  {navItems.map((item, index) => renderNavItem(item, index, () => setIsOpen(false), true))}
                </motion.nav>

                {/* Decorative element */}
                <motion.div
                  className="absolute bottom-8 left-6 right-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <div className="h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
                  <p className="text-center text-slate-500 text-sm mt-4">🚀 Navigation Premium</p>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Overlay for mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={toggleHandler}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;