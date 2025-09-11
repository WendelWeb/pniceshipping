// src/components/HeroSection.tsx
import { SignUpButton, useUser } from "@clerk/clerk-react";
import {
  SignInButton,
  SignedIn,
  SignedOut,
} from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { memo, useMemo } from "react";

// Memoized button components for better performance
const AuthButton = memo(({ 
  variant = "primary",
  children,
  onClick,
  className = "",
  fullWidth = false
}: {
  variant?: "primary" | "secondary";
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  fullWidth?: boolean;
}) => {
  const baseClasses = "px-6 py-2 rounded-md transition-all duration-300 font-medium cursor-pointer";
  const variantClasses = variant === "primary" 
    ? "bg-blue-600 text-white border border-blue-600 hover:bg-white hover:text-blue-600" 
    : "bg-white text-blue-600 border border-blue-600 hover:bg-blue-600 hover:text-white";
  const widthClass = fullWidth ? "w-full" : "";
  
  return (
    <button 
      onClick={onClick}
      className={`${baseClasses} ${variantClasses} ${widthClass} ${className}`}
    >
      {children}
    </button>
  );
});

AuthButton.displayName = "AuthButton";

// Welcome message component
const WelcomeMessage = memo(({ userName }: { userName: string | null | undefined }) => {
  if (!userName) return null;
  
  return (
    <div className="absolute top-24 left-5 md:top-28 md:left-10 animate-fadeIn">
      <h2 className="font-bold text-xl md:text-2xl">
        <span className="text-blue-600">Bienvenue</span>{" "}
        <span className="text-gray-800">{userName}</span>
      </h2>
    </div>
  );
});

WelcomeMessage.displayName = "WelcomeMessage";

// Hero title component for reuse
const HeroTitle = memo(({ className = "" }: { className?: string }) => (
  <h1 className={`font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-yellow-500 ${className}`}>
    <span className="block">PARTENAIRE D'EXPÉDITION</span>
    <span className="block">DE CONFIANCE</span>
  </h1>
));

HeroTitle.displayName = "HeroTitle";

// Hero description component
const HeroDescription = memo(({ className = "" }: { className?: string }) => (
  <p className={`text-gray-700 ${className}`}>
    Découvrez une fiabilité inégalée avec nos services de livraison. En tant que
    partenaire de confiance, nous privilégions des solutions d'expédition
    ponctuelles, sécurisées et fluides, vous offrant une tranquillité d'esprit.
  </p>
));

HeroDescription.displayName = "HeroDescription";

// Auth buttons group component
const AuthButtons = memo(({ 
  isMobile = false,
  className = "" 
}: { 
  isMobile?: boolean;
  className?: string;
}) => (
  <SignedOut>
    <div className={`flex ${isMobile ? 'flex-col sm:flex-row gap-3' : 'flex-row gap-4'} ${className}`}>
      <SignInButton>
        <AuthButton fullWidth={isMobile}>
          Se connecter
        </AuthButton>
      </SignInButton>
      <SignUpButton>
        <AuthButton variant="secondary" fullWidth={isMobile}>
          Créer un compte
        </AuthButton>
      </SignUpButton>
    </div>
  </SignedOut>
));

AuthButtons.displayName = "AuthButtons";

// Dashboard button component
const DashboardButton = memo(({ 
  isMobile = false,
  className = "" 
}: { 
  isMobile?: boolean;
  className?: string;
}) => (
  <SignedIn>
    <Link to="/dashboard" className={className}>
      <button className={`
        bg-blue-600 text-white px-6 py-3 rounded-md 
        hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5
        transition-all duration-300 font-medium
        ${isMobile ? 'w-full flex items-center justify-center' : 'inline-flex items-center'}
      `}>
        Mes Colis
        <svg
          className="w-5 h-5 ml-2"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17 8l4 4m0 0l-4 4m4-4H3"
          />
        </svg>
      </button>
    </Link>
  </SignedIn>
));

DashboardButton.displayName = "DashboardButton";

const HeroSection = () => {
  const { user } = useUser();
  
  // Memoize user's first name to prevent unnecessary re-renders
  const userName = useMemo(() => user?.firstName, [user?.firstName]);

  return (
    <section className="relative min-h-[80vh] bg-gradient-to-b from-white to-gray-50 pt-5">
      {/* Welcome Message */}
      <WelcomeMessage userName={userName} />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop Version */}
        <div className="hidden md:flex items-center justify-between py-16 lg:py-20">
          {/* Content Column */}
          <div className="w-1/2 pr-8 lg:pr-12">
            <HeroTitle className="text-4xl lg:text-5xl xl:text-6xl mb-6 leading-tight" />
            <HeroDescription className="text-lg lg:text-xl mb-8 leading-relaxed" />
            
            <div className="space-y-4">
              <AuthButtons />
              <DashboardButton />
            </div>
          </div>
          
          {/* Image Column */}
          <div className="w-1/2">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-yellow-400 rounded-lg blur-2xl opacity-20"></div>
              <img
                src="./hero.png"
                alt="Personnel de livraison souriant tenant un colis"
                className="relative rounded-lg shadow-2xl w-full h-auto object-cover"
                loading="eager"
                width="600"
                height="400"
              />
            </div>
          </div>
        </div>

        {/* Mobile Version */}
        <div className="md:hidden py-8 space-y-8">
          {/* Content Section */}
          <div className="text-center space-y-6">
            <HeroTitle className="text-3xl sm:text-4xl mb-4 leading-tight" />
            <HeroDescription className="text-base sm:text-lg mb-6 px-2" />
            
            {/* Auth Actions */}
            <div className="space-y-4 px-4">
              <AuthButtons isMobile={true} />
              <DashboardButton isMobile={true} />
            </div>
          </div>
          
          {/* Image Section */}
          <div className="relative px-4">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-yellow-400 rounded-lg blur-xl opacity-15"></div>
            <img
              src="./hero-1.png"
              alt="Personnel de livraison avec presse-papiers"
              className="relative rounded-lg shadow-xl w-full h-auto object-cover"
              loading="eager"
            />
          </div>
        </div>
      </div>
      
      {/* Optional: Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce hidden md:block">
        <svg 
          className="w-6 h-6 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;

