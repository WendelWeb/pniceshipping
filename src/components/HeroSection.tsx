// src/components/HeroSection.tsx
import { SignUpButton, useUser } from "@clerk/clerk-react";
import {
  SignInButton,
  SignedIn,
  SignedOut,
} from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { memo, useMemo, useEffect, useState } from "react";

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
  const [ripples, setRipples] = useState<Array<{x: number, y: number, id: number}>>([]);
  
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    
    setRipples(prev => [...prev, { x, y, id }]);
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== id));
    }, 600);
    
    onClick?.();
  };
  
  const baseClasses = "relative overflow-hidden px-8 py-3.5 rounded-xl transition-all duration-500 font-semibold tracking-wide cursor-pointer transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-2xl";
  const variantClasses = variant === "primary" 
    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 shadow-blue-500/25 hover:shadow-blue-500/40" 
    : "bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 hover:border-white/30";
  const widthClass = fullWidth ? "w-full" : "";
  
  return (
    <button 
      onClick={handleClick}
      className={`${baseClasses} ${variantClasses} ${widthClass} ${className} group`}
    >
      <span className="relative z-10 flex items-center justify-center">
        {children}
        <svg
          className="w-4 h-4 ml-2 transform transition-transform duration-300 group-hover:translate-x-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 7l5 5m0 0l-5 5m5-5H6"
          />
        </svg>
      </span>
      
      {/* Ripple effect */}
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="absolute bg-white/30 rounded-full animate-ripple"
          style={{
            left: ripple.x - 20,
            top: ripple.y - 20,
            width: 40,
            height: 40,
          }}
        />
      ))}
      
      {/* Glow effect */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </button>
  );
});

AuthButton.displayName = "AuthButton";

// Welcome message component
const WelcomeMessage = memo(({ userName }: { userName: string | null | undefined }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    if (userName) {
      setIsVisible(true);
    }
  }, [userName]);
  
  if (!userName) return null;
  
  return (
    <div className={`absolute top-24 left-5 md:top-28 md:left-10 transition-all duration-1000 transform ${
      isVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
    }`}>
      <h2 className="font-bold text-xl md:text-2xl flex items-center space-x-2">
        <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent animate-pulse">
          Bienvenue
        </span>
        <span className="text-white/90">{userName}</span>
        <span className="text-2xl animate-wave inline-block">👋</span>
      </h2>
    </div>
  );
});

WelcomeMessage.displayName = "WelcomeMessage";

// Hero title component for reuse
const HeroTitle = memo(({ className = "" }: { className?: string }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);
  
  return (
    <h1 className={`font-black ${className} relative`}>
      <span 
        className={`block bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent transition-all duration-1000 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}
        style={{ transitionDelay: '100ms' }}
      >
        PARTENAIRE D'EXPÉDITION
      </span>
      <span 
        className={`block bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent transition-all duration-1000 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}
        style={{ transitionDelay: '300ms' }}
      >
        DE CONFIANCE
      </span>
      
      {/* Animated background blur */}
      <div className="absolute -inset-x-20 -inset-y-10 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-3xl animate-pulse-slow -z-10" />
    </h1>
  );
});

HeroTitle.displayName = "HeroTitle";

// Hero description component
const HeroDescription = memo(({ className = "" }: { className?: string }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setTimeout(() => setIsVisible(true), 400);
  }, []);
  
  return (
    <p className={`text-gray-300 leading-relaxed ${className} transition-all duration-1000 transform ${
      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
    }`}>
      Découvrez une fiabilité inégalée avec nos services de livraison. En tant que
      partenaire de confiance, nous privilégions des solutions d'expédition
      ponctuelles, sécurisées et fluides, vous offrant une tranquillité d'esprit.
    </p>
  );
});

HeroDescription.displayName = "HeroDescription";

// Auth buttons group component
const AuthButtons = memo(({ 
  isMobile = false,
  className = "" 
}: { 
  isMobile?: boolean;
  className?: string;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setTimeout(() => setIsVisible(true), 600);
  }, []);
  
  return (
    <SignedOut>
      <div className={`flex ${isMobile ? 'flex-col sm:flex-row gap-4' : 'flex-row gap-5'} ${className} transition-all duration-1000 transform ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}>
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
  );
});

AuthButtons.displayName = "AuthButtons";

// Dashboard button component
const DashboardButton = memo(({ 
  isMobile = false,
  className = "" 
}: { 
  isMobile?: boolean;
  className?: string;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  useEffect(() => {
    setTimeout(() => setIsVisible(true), 800);
  }, []);
  
  return (
    <SignedIn>
      <Link 
        to="/dashboard" 
        className={`${className} transition-all duration-1000 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <button className={`
          relative overflow-hidden
          bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 
          text-white px-8 py-4 rounded-xl 
          hover:shadow-2xl hover:shadow-purple-500/50
          transform hover:scale-[1.02] active:scale-[0.98]
          transition-all duration-500 font-bold tracking-wide
          ${isMobile ? 'w-full flex items-center justify-center' : 'inline-flex items-center'}
          group
        `}>
          <span className="relative z-10 flex items-center">
            <span className="mr-2">📦</span>
            Mes Colis
            <svg
              className={`w-5 h-5 ml-3 transition-all duration-300 ${
                isHovered ? 'translate-x-2' : 'translate-x-0'
              }`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </span>
          
          {/* Animated gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </button>
      </Link>
    </SignedIn>
  );
});

DashboardButton.displayName = "DashboardButton";

const HeroSection = () => {
  const { user } = useUser();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Memoize user's first name to prevent unnecessary re-renders
  const userName = useMemo(() => user?.firstName, [user?.firstName]);
  
  // Parallax effect on mouse move
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth - 0.5) * 20;
      const y = (clientY / window.innerHeight - 0.5) * 20;
      setMousePosition({ x, y });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-[90vh] bg-gradient-to-br from-gray-900 via-indigo-900/20 to-gray-900 pt-5 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl animate-pulse-slow" />
        
        {/* Grid pattern */}
<div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cdefs%3E%3Cpattern%20id%3D%22grid%22%20width%3D%2260%22%20height%3D%2260%22%20patternUnits%3D%22userSpaceOnUse%22%3E%3Cpath%20d%3D%22M%2060%200%20L%200%200%200%2060%22%20fill%3D%22none%22%20stroke%3D%22white%22%20stroke-width%3D%220.5%22%20opacity%3D%220.05%22/%3E%3C/pattern%3E%3C/defs%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22url(%23grid)%22/%3E%3C/svg%3E')] opacity-50" />      </div>
      
      {/* Welcome Message */}
      <WelcomeMessage userName={userName} />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Desktop Version */}
        <div className="hidden md:flex items-center justify-between py-16 lg:py-20">
          {/* Content Column */}
          <div className="w-1/2 pr-8 lg:pr-12">
            <HeroTitle className="text-5xl lg:text-6xl xl:text-7xl mb-8 leading-tight" />
            <HeroDescription className="text-lg lg:text-xl mb-10" />
            
            <div className="space-y-5">
              <AuthButtons />
              <DashboardButton />
            </div>
          </div>
          
          {/* Image Column */}
          <div className="w-1/2">
            <div 
              className="relative transform transition-transform duration-700 hover:scale-[1.02]"
              style={{
                transform: `perspective(1000px) rotateY(${mousePosition.x * 0.05}deg) rotateX(${-mousePosition.y * 0.05}deg)`
              }}
            >
              {/* Animated glow behind image */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur-3xl opacity-30 animate-pulse-slow"></div>
              
              <img
                src="./hero.png"
                alt="Personnel de livraison souriant tenant un colis"
                className="relative rounded-2xl shadow-2xl w-full h-auto object-cover border border-white/10 backdrop-blur-sm"
                loading="eager"
                width="600"
                height="400"
              />
              
              {/* Floating badges */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-bounce-slow">
                ✓ Livraison rapide
              </div>
              <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-bounce-slow-delayed">
                🔒 100% Sécurisé
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Version */}
        <div className="md:hidden py-8 space-y-10">
          {/* Content Section */}
          <div className="text-center space-y-8">
            <HeroTitle className="text-4xl sm:text-5xl mb-6 leading-tight" />
            <HeroDescription className="text-base sm:text-lg mb-8 px-2" />
            
            {/* Auth Actions */}
            <div className="space-y-5 px-4">
              <AuthButtons isMobile={true} />
              <DashboardButton isMobile={true} />
            </div>
          </div>
          
          {/* Image Section */}
          <div className="relative px-4">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur-2xl opacity-20 animate-pulse-slow"></div>
            <img
              src="./hero-1.png"
              alt="Personnel de livraison avec presse-papiers"
              className="relative rounded-2xl shadow-2xl w-full h-auto object-cover border border-white/10"
              loading="eager"
            />
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden md:block">
        <div className="flex flex-col items-center space-y-2 animate-bounce">
          <span className="text-xs text-gray-400 uppercase tracking-widest">Défiler</span>
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
      </div>
      
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(-10deg); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.1); }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes bounce-slow-delayed {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        
        @keyframes wave {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(20deg); }
          75% { transform: rotate(-20deg); }
        }
        
        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
        
        :global(.animate-float) {
          animation: float 6s ease-in-out infinite;
        }
        
        :global(.animate-float-delayed) {
          animation: float-delayed 8s ease-in-out infinite;
        }
        
        :global(.animate-pulse-slow) {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        
        :global(.animate-bounce-slow) {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        
        :global(.animate-bounce-slow-delayed) {
          animation: bounce-slow-delayed 3s ease-in-out infinite 0.5s;
        }
        
        :global(.animate-wave) {
          animation: wave 1s ease-in-out infinite;
        }
        
        :global(.animate-ripple) {
          animation: ripple 0.6s ease-out;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;