// src/components/HeroSection.tsx
import { SignUpButton, useUser } from "@clerk/clerk-react";
import {
  SignInButton,
  SignedIn,
  SignedOut,
} from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { memo, useMemo, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { 
  ArrowRight, 
  Sparkles, 
  Shield, 
  Zap, 
  Package,
  Star,
  Globe,
  Truck
} from "lucide-react";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.25, 0, 1] }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
};

const scaleOnHover = {
  hover: { 
    scale: 1.05,
    transition: { type: "spring", stiffness: 400, damping: 10 }
  },
  tap: { scale: 0.95 }
};

// Enhanced AuthButton with more animations
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
  const [isHovered, setIsHovered] = useState(false);
  
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    
    setRipples(prev => [...prev, { x, y, id }]);
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== id));
    }, 700);
    
    onClick?.();
  };
  
  const isPrimary = variant === "primary";
  
  return (
    <motion.button 
      onClick={handleClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`
        relative overflow-hidden group
        ${fullWidth ? 'w-full' : ''} 
        ${className}
      `}
      whileHover="hover"
      whileTap="tap"
      variants={scaleOnHover}
    >
      <div className={`
        relative px-8 py-4 rounded-2xl font-semibold text-sm
        transition-all duration-300 flex items-center justify-center
        ${isPrimary 
          ? 'bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25' 
          : 'bg-gray-800/50 backdrop-blur-xl text-gray-200 border border-gray-700/50'
        }
        ${isPrimary && isHovered ? 'shadow-xl shadow-purple-500/40 brightness-110' : ''}
        ${!isPrimary && isHovered ? 'bg-gray-700/60 border-gray-600/70' : ''}
      `}>
        <span className="relative z-10 flex items-center gap-2">
          {children}
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: isHovered ? 4 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ArrowRight size={16} />
          </motion.div>
        </span>
        
        {/* Enhanced ripple effect */}
        {ripples.map(ripple => (
          <motion.span
            key={ripple.id}
            className="absolute bg-white/30 rounded-full pointer-events-none"
            initial={{ scale: 0, opacity: 0.6 }}
            animate={{ scale: 4, opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            style={{
              left: ripple.x - 20,
              top: ripple.y - 20,
              width: 40,
              height: 40,
            }}
          />
        ))}
        
        {/* Animated gradient overlay */}
        {isPrimary && (
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            initial={{ x: '-100%', skewX: -15 }}
            animate={isHovered ? { x: '100%' } : { x: '-100%' }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
        )}
      </div>
    </motion.button>
  );
});

AuthButton.displayName = "AuthButton";

// Enhanced WelcomeMessage
const WelcomeMessage = memo(({ userName }: { userName: string | null | undefined }) => {
  if (!userName) return null;
  
  return (
    <motion.div 
      className="absolute top-20 left-6 md:top-28 md:left-12 z-20"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
    >
      <div className="flex items-center gap-3 bg-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl px-6 py-3 shadow-xl">
        <motion.span 
          className="text-2xl"
          animate={{ rotate: [0, 20, -10, 20, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        >
          👋
        </motion.span>
        <div>
          <p className="text-xs text-gray-400 font-medium">Bienvenue</p>
          <p className="font-bold text-lg bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
            {userName}
          </p>
        </div>
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
        >
          <Sparkles size={20} className="text-violet-400" />
        </motion.div>
      </div>
    </motion.div>
  );
});

WelcomeMessage.displayName = "WelcomeMessage";

// Enhanced HeroTitle
const HeroTitle = memo(({ className = "" }: { className?: string }) => {
  return (
    <motion.div
      className={`font-black ${className} relative`}
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <motion.h1 
        variants={fadeInUp}
        className="relative z-10"
      >
        <motion.span 
          className="block bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent mb-2"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          PARTENAIRE D'EXPÉDITION ✨
        </motion.span>
        <motion.span 
          className="block bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          DE CONFIANCE 🚀
        </motion.span>
      </motion.h1>
      
      {/* Enhanced background effects */}
      <motion.div 
        className="absolute -inset-x-20 -inset-y-10 bg-gradient-to-r from-violet-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-3xl -z-10"
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.div>
  );
});

HeroTitle.displayName = "HeroTitle";

// Enhanced HeroDescription
const HeroDescription = memo(({ className = "" }: { className?: string }) => {
  return (
    <motion.p 
      className={`text-gray-300 leading-relaxed ${className} relative`}
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      transition={{ delay: 0.4 }}
    >
      <span className="inline-flex items-center gap-2">
        <Globe size={20} className="text-violet-400" />
        Découvrez une fiabilité inégalée avec nos services de livraison.
      </span>
      <br />
      En tant que partenaire de confiance, nous privilégions des solutions d'expédition
      ponctuelles, sécurisées et fluides, vous offrant une tranquillité d'esprit totale.
    </motion.p>
  );
});

HeroDescription.displayName = "HeroDescription";

// Enhanced AuthButtons
const AuthButtons = memo(({ 
  isMobile = false,
  className = "" 
}: { 
  isMobile?: boolean;
  className?: string;
}) => {
  return (
    <SignedOut>
      <motion.div 
        className={`flex ${isMobile ? 'flex-col sm:flex-row gap-4' : 'flex-row gap-5'} ${className}`}
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.6 }}
      >
        <motion.div variants={fadeInUp}>
          <SignInButton>
            <AuthButton fullWidth={isMobile}>
              Se connecter
            </AuthButton>
          </SignInButton>
        </motion.div>
        
        <motion.div variants={fadeInUp}>
          <SignUpButton>
            <AuthButton variant="secondary" fullWidth={isMobile}>
              Créer un compte
            </AuthButton>
          </SignUpButton>
        </motion.div>
      </motion.div>
    </SignedOut>
  );
});

AuthButtons.displayName = "AuthButtons";

// Enhanced DashboardButton
const DashboardButton = memo(({ 
  isMobile = false,
  className = "" 
}: { 
  isMobile?: boolean;
  className?: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <SignedIn>
      <motion.div
        className={className}
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.8 }}
      >
        <Link to="/dashboard">
          <motion.button 
            className={`
              relative overflow-hidden group
              bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 
              text-white px-8 py-4 rounded-2xl 
              shadow-xl shadow-purple-500/25
              font-bold text-sm tracking-wide
              ${isMobile ? 'w-full flex items-center justify-center' : 'inline-flex items-center'}
            `}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 25px 50px -12px rgba(168, 85, 247, 0.4)"
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <span className="relative z-10 flex items-center gap-3">
              <motion.div
                animate={isHovered ? { rotate: [0, -10, 10, 0] } : {}}
                transition={{ duration: 0.5 }}
              >
                <Package size={20} />
              </motion.div>
              
              Mes Colis
              
              <motion.div
                initial={{ x: 0 }}
                animate={{ x: isHovered ? 6 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ArrowRight size={18} />
              </motion.div>
            </span>
            
            {/* Shimmer effect */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent"
              initial={{ x: '-100%', skewX: -15 }}
              animate={isHovered ? { x: '100%' } : { x: '-100%' }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
          </motion.button>
        </Link>
      </motion.div>
    </SignedIn>
  );
});

DashboardButton.displayName = "DashboardButton";

// Stats badges component
const StatsSection = memo(() => {
  const stats = [
    { icon: Shield, label: "100% Sécurisé", color: "from-emerald-500 to-teal-500" },
    { icon: Zap, label: "Livraison rapide", color: "from-violet-500 to-purple-500" },
    { icon: Star, label: "5/5 étoiles", color: "from-yellow-500 to-orange-500" }
  ];

  return (
    <motion.div
      className="flex flex-wrap gap-4 justify-center md:justify-start mt-8"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      transition={{ delay: 1 }}
    >
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          variants={fadeInUp}
          whileHover={{ y: -2 }}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-full
            bg-gray-800/50 backdrop-blur-xl border border-gray-700/50
            text-sm font-medium text-gray-200
          `}
        >
          <div className={`p-1 rounded-full bg-gradient-to-r ${stat.color}`}>
            <stat.icon size={14} className="text-white" />
          </div>
          {stat.label}
        </motion.div>
      ))}
    </motion.div>
  );
});

StatsSection.displayName = "StatsSection";

const HeroSection = () => {
  const { user } = useUser();
  const { scrollY } = useScroll();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Memoize user's first name to prevent unnecessary re-renders
  const userName = useMemo(() => user?.firstName, [user?.firstName]);
  
  // Parallax transforms
  const backgroundY = useTransform(scrollY, [0, 500], [0, 150]);
  const contentY = useTransform(scrollY, [0, 500], [0, -50]);
  
  // Enhanced parallax effect on mouse move
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth - 0.5) * 30;
      const y = (clientY / window.innerHeight - 0.5) * 30;
      setMousePosition({ x, y });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 pt-5 overflow-hidden">
      {/* Enhanced animated background */}
      <motion.div 
        className="absolute inset-0 overflow-hidden"
        style={{ y: backgroundY }}
      >
        {/* Floating orbs with better animations */}
        <motion.div 
          className="absolute top-20 left-20 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, -30, 0]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
        
        <motion.div 
          className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-purple-500/8 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            x: [0, -40, 0],
            y: [0, 30, 0]
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 2
          }}
        />
        
        <motion.div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-3xl"
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 6, repeat: Infinity, ease: "easeInOut" }
          }}
        />
        
        {/* Enhanced grid pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2280%22%20height%3D%2280%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cdefs%3E%3Cpattern%20id%3D%22grid%22%20width%3D%2280%22%20height%3D%2280%22%20patternUnits%3D%22userSpaceOnUse%22%3E%3Cpath%20d%3D%22M%2080%200%20L%200%200%200%2080%22%20fill%3D%22none%22%20stroke%3D%22rgb(139%2C%2092%2C%20246)%22%20stroke-width%3D%220.5%22%20opacity%3D%220.1%22/%3E%3C/pattern%3E%3C/defs%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22url(%23grid)%22/%3E%3C/svg%3E')] opacity-40" />
      </motion.div>
      
      {/* Welcome Message */}
      <WelcomeMessage userName={userName} />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Desktop Version */}
        <div className="hidden md:flex items-center justify-between py-16 lg:py-20">
          {/* Content Column */}
          <motion.div 
            className="w-1/2 pr-8 lg:pr-12"
            style={{ y: contentY }}
          >
            <HeroTitle className="text-5xl lg:text-6xl xl:text-7xl mb-8 leading-tight" />
            <HeroDescription className="text-lg lg:text-xl mb-8" />
            
            <div className="space-y-6">
              <AuthButtons />
              <DashboardButton />
            </div>
            
            <StatsSection />
          </motion.div>
          
          {/* Image Column */}
          <motion.div 
            className="w-1/2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div 
              className="relative"
              style={{
                transform: `perspective(1000px) rotateY(${mousePosition.x * 0.02}deg) rotateX(${-mousePosition.y * 0.02}deg)`
              }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              {/* Enhanced glow effects */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 rounded-3xl blur-3xl opacity-20"
                animate={{ 
                  scale: [1, 1.05, 1],
                  opacity: [0.2, 0.3, 0.2]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              />
              
              <div className="relative bg-gray-800/20 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/30">
                <img
                  src="./hero.png"
                  alt="Personnel de livraison souriant tenant un colis"
                  className="rounded-2xl shadow-2xl w-full h-auto object-cover"
                  loading="eager"
                  width="600"
                  height="400"
                />
                
                {/* Floating badges with enhanced animations */}
                <motion.div 
                  className="absolute -top-4 -right-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-2xl text-sm font-bold shadow-xl flex items-center gap-2"
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 2, -2, 0]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                >
                  <Truck size={16} />
                  Livraison rapide
                </motion.div>
                
                <motion.div 
                  className="absolute -bottom-4 -left-4 bg-gradient-to-r from-violet-500 to-purple-500 text-white px-4 py-2 rounded-2xl text-sm font-bold shadow-xl flex items-center gap-2"
                  animate={{ 
                    y: [0, 10, 0],
                    rotate: [0, -2, 2, 0]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    ease: "easeInOut",
                    delay: 1.5 
                  }}
                >
                  <Shield size={16} />
                  100% Sécurisé
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Mobile Version */}
        <div className="md:hidden py-8 space-y-12">
          {/* Content Section */}
          <motion.div 
            className="text-center space-y-8"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <HeroTitle className="text-4xl sm:text-5xl mb-6 leading-tight" />
            <HeroDescription className="text-base sm:text-lg mb-8 px-2" />
            
            {/* Auth Actions */}
            <div className="space-y-5 px-4">
              <AuthButtons isMobile={true} />
              <DashboardButton isMobile={true} />
            </div>
            
            <StatsSection />
          </motion.div>
          
          {/* Image Section */}
          <motion.div 
            className="relative px-4"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="relative bg-gray-800/20 backdrop-blur-xl rounded-3xl p-6 border border-gray-700/30">
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 rounded-3xl blur-2xl opacity-15"
                animate={{ 
                  scale: [1, 1.02, 1],
                  opacity: [0.15, 0.25, 0.15]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              />
              
              <img
                src="./hero-1.png"
                alt="Personnel de livraison avec presse-papiers"
                className="relative rounded-2xl shadow-2xl w-full h-auto object-cover"
                loading="eager"
              />
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Enhanced scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden md:block"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.5 }}
      >
        <motion.div 
          className="flex flex-col items-center space-y-3"
          animate={{ y: [0, 10, 0] }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        >
          <span className="text-xs text-gray-400 uppercase tracking-widest font-medium">
            Découvrir
          </span>
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          >
            <ArrowRight 
              size={20} 
              className="text-violet-400 rotate-90" 
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;