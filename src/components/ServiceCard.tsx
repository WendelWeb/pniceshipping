import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { 
  ArrowRight,
  Truck,
  Shield,
  Zap,
  Globe,
  Package,
  Clock,
  Star,
  CheckCircle,
  Sparkles
} from "lucide-react";
import ContactSection from "./ContactForConditions";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
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
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const scaleOnHover = {
  hover: { 
    scale: 1.05,
    y: -8,
    transition: { type: "spring", stiffness: 300, damping: 20 }
  },
  tap: { scale: 0.98 }
};

// Service Card Component
const ServiceCard = ({ service, index }: { service: any, index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [ripples, setRipples] = useState<Array<{x: number, y: number, id: number}>>([]);

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    
    setRipples(prev => [...prev, { x, y, id }]);
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== id));
    }, 700);
  };

  return (
    <motion.div
      className="relative group"
      variants={fadeInUp}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover="hover"
    >
      <motion.div
        className="relative bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 shadow-2xl overflow-hidden h-full flex flex-col"
        variants={scaleOnHover}
      >
        {/* Background gradient effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-violet-600/10 via-purple-600/5 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        />

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl">
          {isHovered && [...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-violet-400/60 rounded-full"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 2) * 30}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2
              }}
            />
          ))}
        </div>

        {/* Icon container */}
        <motion.div
          className="relative mb-6"
          animate={isHovered ? { 
            rotate: [0, 5, -5, 0],
            scale: 1.1
          } : {}}
          transition={{ duration: 0.5 }}
        >
          <div className="text-5xl mb-2 relative">
            {service.icon}
            
            {/* Glow effect */}
            <motion.div
              className="absolute inset-0 text-5xl blur-sm opacity-0 group-hover:opacity-30 transition-opacity duration-300"
              style={{ color: service.glowColor || '#8B5CF6' }}
            >
              {service.icon}
            </motion.div>
          </div>

          {/* Status badge */}
          <motion.div
            className="absolute -top-2 -right-2"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
          >
            <div className="bg-emerald-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
              <CheckCircle className="w-3 h-3" />
              <span>Premium</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Content */}
        <div className="flex-1 relative z-10">
          <motion.h3 
            className="text-2xl font-bold text-white mb-3 group-hover:text-violet-200 transition-colors duration-300"
            animate={isHovered ? { x: 4 } : {}}
            transition={{ duration: 0.2 }}
          >
            {service.title}
          </motion.h3>
          
          <p className="text-gray-300 leading-relaxed mb-6 group-hover:text-gray-200 transition-colors duration-300">
            {service.description}
          </p>

          {/* Features list if available */}
          {service.features && (
            <motion.div
              className="mb-6 space-y-2"
              initial={{ opacity: 0, height: 0 }}
              animate={isHovered ? { opacity: 1, height: "auto" } : { opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {service.features.map((feature: string, i: number) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-400">
                  <div className="w-1.5 h-1.5 bg-violet-400 rounded-full" />
                  <span>{feature}</span>
                </div>
              ))}
            </motion.div>
          )}
        </div>

        {/* CTA Button */}
        <motion.button
          className="relative w-full bg-gradient-to-r from-gray-700 to-gray-600 hover:from-violet-600 hover:to-purple-600 text-white px-6 py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 group/btn overflow-hidden"
          onClick={handleButtonClick}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="relative z-10 flex items-center gap-2">
            En savoir plus
            <motion.div
              animate={isHovered ? { x: 4 } : {}}
              transition={{ duration: 0.2 }}
            >
              <ArrowRight className="w-4 h-4" />
            </motion.div>
          </span>

          {/* Ripple effects */}
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

          {/* Shimmer effect */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
            initial={{ x: '-100%' }}
            animate={isHovered ? { x: '100%' } : { x: '-100%' }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

const ServicesSection = ({ services }: { services: any[] }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Default services if none provided
  const defaultServices = [
    {
      icon: "🚚",
      title: "Livraison Express",
      description: "Service de livraison rapide et sécurisé vers Haïti avec suivi en temps réel et garantie de délai.",
      features: ["Suivi GPS", "Assurance incluse", "Support 24/7"],
      glowColor: "#3B82F6"
    },
    {
      icon: "📦",
      title: "Emballage Sécurisé",
      description: "Protection optimale de vos colis avec des matériaux de qualité professionnelle et étiquetage spécialisé.",
      features: ["Matériaux premium", "Étanche", "Anti-choc"],
      glowColor: "#10B981"
    },
    {
      icon: "🛡️",
      title: "Assurance Complete",
      description: "Couverture totale de vos envois avec remboursement intégral en cas de dommage ou de perte.",
      features: ["Couverture 100%", "Remboursement rapide", "Sans franchise"],
      glowColor: "#8B5CF6"
    }
  ];

  const serviceData = services || defaultServices;

  return (
    <section className="relative py-20 px-4 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 overflow-hidden" id="services">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute top-40 left-20 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
            y: [0, -20, 0]
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
        
        <motion.div 
          className="absolute bottom-40 right-20 w-96 h-96 bg-purple-500/8 rounded-full blur-3xl"
          animate={{ 
            scale: [1.1, 1, 1.1],
            x: [0, -40, 0],
            y: [0, 20, 0]
          }}
          transition={{ 
            duration: 12, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div 
          ref={ref}
          className="text-center mb-16"
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.div
            className="flex items-center justify-center mb-6"
            variants={fadeInUp}
          >
            <motion.div
              className="p-4 bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl shadow-xl mr-4"
              whileHover={{ 
                rotate: [0, 5, -5, 0],
                scale: 1.05
              }}
              transition={{ duration: 0.5 }}
            >
              <Star className="w-8 h-8 text-white" />
            </motion.div>
            
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatDelay: 2
              }}
            >
              <span className="text-4xl">⭐</span>
            </motion.div>
          </motion.div>

          <motion.h2 
            className="text-4xl md:text-6xl font-black mb-6 text-white"
            variants={fadeInUp}
          >
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Nos Services Premium
            </span>
          </motion.h2>

          <motion.p 
            className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
            variants={fadeInUp}
          >
            Découvrez pourquoi nous sommes reconnus comme le leader en matière de services d'expédition vers Haïti.
          </motion.p>

          {/* Trust indicators */}
          <motion.div
            className="flex items-center justify-center gap-8 mt-8 flex-wrap"
            variants={staggerContainer}
          >
            {[
              { icon: Shield, label: "Sécurisé", color: "from-emerald-500 to-teal-500" },
              { icon: Zap, label: "Rapide", color: "from-yellow-500 to-orange-500" },
              { icon: Globe, label: "Fiable", color: "from-blue-500 to-indigo-500" }
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className={`flex items-center gap-2 px-4 py-2 bg-gray-800/50 backdrop-blur border border-gray-700/50 rounded-full text-sm font-medium text-gray-200`}
                whileHover={{ scale: 1.05, y: -2 }}
              >
                <div className={`p-1 rounded-full bg-gradient-to-r ${item.color}`}>
                  <item.icon className="w-4 h-4 text-white" />
                </div>
                {item.label}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {serviceData.map((service, index) => (
            <ServiceCard key={index} service={service} index={index} />
          ))}
        </motion.div>

        {/* Bottom CTA Section */}
        <motion.div
          className="text-center mt-16"
          variants={fadeInUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          transition={{ delay: 0.8 }}
        >
          <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-xl border border-gray-600/50 rounded-3xl p-8 max-w-2xl mx-auto">
            <motion.div
              className="text-4xl mb-4"
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                repeatDelay: 3
              }}
            >
              🎯
            </motion.div>
            
            <h3 className="text-2xl font-bold text-white mb-4">
              Prêt à découvrir nos services ?
            </h3>
            
            <p className="text-gray-300 mb-6">
              Contactez notre équipe pour une consultation personnalisée et un devis adapté à vos besoins.
            </p>
            
            <motion.button
              className="bg-gradient-to-r from-violet-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold shadow-xl flex items-center gap-3 mx-auto"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 25px 50px -12px rgba(139, 92, 246, 0.4)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Sparkles className="w-5 h-5" />
              <span>Commencer maintenant</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>
      </div>
      <ContactSection />
    </section>
  );
};

export default ServicesSection;