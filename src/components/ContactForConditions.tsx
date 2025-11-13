import React, { useState } from 'react';
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Instagram, 
  MessageCircle, 
  Clock, 
  Users, 
  Award, 
  Zap, 
  Send, 
  ArrowUpRight, 
  Sparkles,
  Globe,
  Shield,
  CheckCircle
} from "lucide-react";
import style from "./ContactForConditions.module.css";

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
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const scaleOnHover = {
  hover: { 
    scale: 1.02,
    transition: { type: "spring", stiffness: 400, damping: 10 }
  },
  tap: { scale: 0.98 }
};

// Stats Section Component
const StatsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [hoveredStat, setHoveredStat] = useState<number | null>(null);

  const stats = [
    { 
      icon: Users, 
      value: "5k+", 
      label: "Clients Satisfaits", 
      color: "from-blue-500 to-indigo-600",
      description: "Clients fidèles dans le monde"
    },
    { 
      icon: Award, 
      value: "100%", 
      label: "Taux de Réussite", 
      color: "from-emerald-500 to-teal-600",
      description: "Livraisons réussies"
    },
    { 
      icon: Zap, 
      value: "24/7", 
      label: "Support Disponible", 
      color: "from-purple-500 to-violet-600",
      description: "Assistance en continu"
    },
    { 
      icon: Clock, 
      value: "3-6j", 
      label: "Délai de Livraison", 
      color: "from-orange-500 to-red-600",
      description: "Rapidité garantie"
    }
  ];

  return (
    <motion.div 
      ref={ref}
      className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16"
      variants={staggerContainer}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {stats.map((stat, index) => (
        <motion.div 
          key={index}
          variants={fadeInUp}
          className="relative group"
          onMouseEnter={() => setHoveredStat(index)}
          onMouseLeave={() => setHoveredStat(null)}
          whileHover="hover"
        >
          <motion.div 
            className="relative bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 text-center overflow-hidden"
            variants={scaleOnHover}
          >
            {/* Background gradient effect */}
            <motion.div
              className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
            />
            
            <motion.div
              className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 bg-gradient-to-r ${stat.color} shadow-lg`}
              animate={hoveredStat === index ? { 
                rotate: [0, 5, -5, 0],
                scale: 1.1
              } : {}}
              transition={{ duration: 0.5 }}
            >
              <stat.icon className="w-8 h-8 text-white" />
            </motion.div>
            
            <motion.div 
              className="text-3xl font-black text-white mb-2"
              animate={hoveredStat === index ? { scale: 1.05 } : {}}
              transition={{ duration: 0.2 }}
            >
              {stat.value}
            </motion.div>
            
            <div className="text-sm font-medium text-gray-300 mb-1">
              {stat.label}
            </div>
            
            <motion.div
              className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              {stat.description}
            </motion.div>

            {/* Floating particles */}
            {hoveredStat === index && (
              <>
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white/50 rounded-full"
                    style={{
                      left: `${30 + i * 20}%`,
                      top: `${20 + i * 10}%`,
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
              </>
            )}
          </motion.div>
        </motion.div>
      ))}
    </motion.div>
  );
};

// Contact Info Component
const ContactInfoCard = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const contactInfo = [
    {
      icon: MapPin,
      title: "Adresse",
      value: "8298 Northwest 68th Street Miami FL, 33195",
      color: "from-blue-500 to-indigo-600",
      emoji: "📍"
    },
    {
      icon: Mail,
      title: "Email",
      value: "pniceshipping@gmail.com",
      color: "from-emerald-500 to-teal-600",
      emoji: "📧"
    },
    {
      icon: Phone,
      title: "Téléphone",
      value: "+509 31 97 0548",
      color: "from-purple-500 to-violet-600",
      emoji: "📱"
    }
  ];

  return (
    <motion.div 
      ref={ref}
      className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 shadow-2xl"
      variants={fadeInUp}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-3 mb-8">
        <motion.div
          className="p-3 bg-gradient-to-r from-violet-500 to-purple-500 rounded-2xl"
          whileHover={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 0.5 }}
        >
          <MessageCircle className="w-6 h-6 text-white" />
        </motion.div>
        <h3 className="text-2xl font-bold text-white">
          Informations de Contact
        </h3>
      </div>
      
      <div className="space-y-4">
        {contactInfo.map((info, index) => (
          <motion.div 
            key={index}
            className="group relative overflow-hidden bg-gray-700/30 backdrop-blur-sm border border-gray-600/50 p-5 rounded-2xl hover:border-violet-500/50 transition-all duration-300"
            variants={fadeInUp}
            whileHover={{ x: 4, backgroundColor: "rgba(139, 92, 246, 0.05)" }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center space-x-4">
              <motion.div
                className={`relative flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-r ${info.color} shadow-lg`}
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                <info.icon className="w-6 h-6 text-white" />
                
                {/* Emoji overlay */}
                <motion.div
                  className="absolute -top-1 -right-1 text-lg"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  {info.emoji}
                </motion.div>
              </motion.div>
              
              <div className="flex-1">
                <p className="font-semibold text-white mb-1 flex items-center gap-2">
                  {info.title}
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                  >
                    <Sparkles className="w-4 h-4 text-violet-400" />
                  </motion.div>
                </p>
                <p className="text-gray-300 group-hover:text-white transition-colors duration-300">
                  {info.value}
                </p>
              </div>

              <motion.div
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                whileHover={{ scale: 1.1 }}
              >
                <ArrowUpRight className="w-5 h-5 text-violet-400" />
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// Newsletter Card Component
const NewsletterCard = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [ripples, setRipples] = useState<Array<{x: number, y: number, id: number}>>([]);

  const handleSubscribe = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (email) {
      // Ripple effect
      const button = e.currentTarget;
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = Date.now();
      
      setRipples(prev => [...prev, { x, y, id }]);
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== id));
      }, 700);

      setIsSubscribed(true);
      setTimeout(() => setIsSubscribed(false), 3000);
      setEmail('');
    }
  };

  return (
    <motion.div 
      ref={ref}
      className="relative bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 rounded-3xl p-8 shadow-2xl overflow-hidden"
      variants={fadeInUp}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3 }}
    >
      {/* Animated background */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/5"
        animate={{
          background: [
            "linear-gradient(45deg, rgba(255,255,255,0.1), transparent, rgba(255,255,255,0.05))",
            "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.1), transparent)",
            "linear-gradient(225deg, transparent, rgba(255,255,255,0.05), rgba(255,255,255,0.1))",
            "linear-gradient(315deg, rgba(255,255,255,0.1), transparent, rgba(255,255,255,0.05))"
          ]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      />
      
      <div className="relative z-10">
        <div className="flex items-center space-x-3 mb-4">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-6 h-6 text-yellow-300" />
          </motion.div>
          <h3 className="text-2xl font-bold text-white">
            Newsletter Premium
          </h3>
          <motion.span
            className="text-2xl"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            📧
          </motion.span>
        </div>
        
        <p className="text-white/90 mb-6 leading-relaxed">
          Restez informé des dernières actualités et offres exclusives avec Pnice Shipping.
        </p>
        
        <div className="relative">
          <div className="flex gap-3">
            <div className="flex-1 relative group">
              <motion.div
                className="absolute left-4 top-1/2 transform -translate-y-1/2"
                animate={{ x: [0, 2, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Mail className="text-gray-400 w-5 h-5 group-focus-within:text-violet-600 transition-colors" />
              </motion.div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Votre adresse email"
                className="w-full pl-12 pr-4 py-4 bg-white/95 backdrop-blur-sm rounded-2xl focus:outline-none focus:ring-4 focus:ring-white/30 transition-all duration-300 placeholder:text-gray-400 text-gray-900"
              />
            </div>
            
            <motion.button 
              onClick={handleSubscribe}
              className="relative px-6 py-4 bg-white text-violet-600 rounded-2xl font-semibold shadow-lg overflow-hidden group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10 flex items-center space-x-2">
                <motion.div
                  animate={{ x: [0, 4, 0], y: [0, -2, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <Send className="w-5 h-5" />
                </motion.div>
              </span>

              {/* Ripple effects */}
              {ripples.map(ripple => (
                <motion.span
                  key={ripple.id}
                  className="absolute bg-violet-500/30 rounded-full pointer-events-none"
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
            </motion.button>
          </div>
          
          {isSubscribed && (
            <motion.div
              className="absolute -bottom-8 left-0 text-emerald-300 text-sm flex items-center gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <CheckCircle className="w-4 h-4" />
              <span>Inscription réussie !</span>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Social Links Component
const SocialLinksSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [hoveredSocial, setHoveredSocial] = useState<number | null>(null);

  const socialLinks = [
    {
      name: "WhatsApp",
      url: "https://wa.me/50931970548",
      icon: MessageCircle,
      color: "from-emerald-500 via-green-500 to-teal-500",
      description: "Support instantané 24/7",
      badge: "Réponse rapide",
      emoji: "💬"
    },
    {
      name: "Instagram",
      url: "https://www.instagram.com/invites/contact/?utm_source=ig_contact_invite&utm_medium=user_system_sheet",
      icon: Instagram,
      color: "from-pink-500 via-purple-500 to-indigo-500",
      description: "Suivez nos actualités",
      badge: "Stories quotidiennes",
      emoji: "📸"
    },
  ];

  return (
    <motion.div
      ref={ref}
      className="space-y-6"
      variants={staggerContainer}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      <motion.div variants={fadeInUp} className="text-center lg:text-left mb-8">
        <h3 className="text-3xl font-bold text-white mb-3 flex items-center justify-center lg:justify-start gap-3">
          <Globe className="w-8 h-8 text-violet-400" />
          Rejoignez Notre Communauté
          <motion.span
            className="text-3xl"
            animate={{ rotate: [0, 20, -20, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
          >
            🌟
          </motion.span>
        </h3>
      </motion.div>

      <div className="space-y-4">
        {socialLinks.map((link, index) => (
          <motion.a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block group"
            variants={fadeInUp}
            onMouseEnter={() => setHoveredSocial(index)}
            onMouseLeave={() => setHoveredSocial(null)}
            whileHover="hover"
          >
            <motion.div 
              className={`relative overflow-hidden bg-gradient-to-r ${link.color} p-6 rounded-3xl shadow-xl transform transition-all duration-500`}
              variants={scaleOnHover}
            >
              {/* Shimmer effect */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" 
              />
              
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <motion.div
                    className="flex items-center justify-center w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl relative"
                    animate={hoveredSocial === index ? { 
                      rotate: 12, 
                      scale: 1.1 
                    } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    <link.icon className="w-6 h-6 text-white" />
                    <motion.div
                      className="absolute -top-1 -right-1 text-lg"
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                    >
                      {link.emoji}
                    </motion.div>
                  </motion.div>
                  
                  <div className="text-white">
                    <h4 className="font-bold text-xl mb-1 flex items-center gap-2">
                      {link.name}
                    </h4>
                    <p className="text-white/90 text-sm">{link.description}</p>
                  </div>
                </div>
                
                <div className="flex flex-col items-end space-y-2">
                  <span className="bg-white/25 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full font-medium border border-white/20">
                    {link.badge}
                  </span>
                  <motion.div
                    className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20"
                    animate={hoveredSocial === index ? { 
                      rotate: 45, 
                      scale: 1.1 
                    } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    <ArrowUpRight className="w-5 h-5 text-white" />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.a>
        ))}
      </div>
    </motion.div>
  );
};

// CTA Card Component
const CTACard = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div 
      ref={ref}
      className="relative bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-3xl p-8 shadow-2xl overflow-hidden group border border-gray-700/50"
      variants={fadeInUp}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      {/* Animated background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-tr from-violet-600/10 via-purple-600/10 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      />
      
      <div className="relative z-10 text-center">
        <motion.div
          className="text-6xl mb-4"
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity, 
            ease: "easeInOut"
          }}
        >
          🚀
        </motion.div>
        
        <h4 className="text-3xl font-black text-white mb-3 bg-gradient-to-r from-white via-violet-200 to-white bg-clip-text text-transparent">
          Prêt à Expédier ?
        </h4>
        
        <p className="text-gray-300 mb-6 leading-relaxed">
          Obtenez votre devis personnalisé en quelques clics et découvrez nos services premium
        </p>
        
        <div className="space-y-3">
          <motion.a
            href="#calculator"
            className="block w-full bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 text-white px-6 py-4 rounded-2xl font-semibold shadow-lg"
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 25px 50px -12px rgba(139, 92, 246, 0.4)"
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-center gap-3">
              <Sparkles className="w-5 h-5" />
              <span>Obtenir un Devis</span>
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </motion.a>
          
          <motion.a
            href="#services"
            className="block w-full bg-gray-700/50 backdrop-blur border border-gray-600/50 text-white px-6 py-4 rounded-2xl font-semibold hover:bg-gray-600/50 transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-center gap-3">
              <Shield className="w-5 h-5" />
              <span>Nos Services</span>
            </div>
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
};

const ContactSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className={`${style.container} relative bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 py-20 px-4 sm:px-6 overflow-hidden`}>
      {/* Enhanced animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute top-20 right-20 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.3, 1],
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
          className="absolute bottom-20 left-20 w-[500px] h-[500px] bg-purple-500/8 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            x: [0, -40, 0],
            y: [0, 30, 0]
          }}
          transition={{ 
            duration: 12, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 2
          }}
        />
        
        <motion.div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-3xl"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <motion.div 
          ref={ref}
          className="text-center mb-16"
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.div 
            className="inline-flex items-center justify-center mb-6 relative"
            variants={fadeInUp}
          >
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl blur-xl opacity-50"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <div className="relative bg-gradient-to-r from-violet-600 to-purple-600 p-5 rounded-2xl shadow-2xl">
              <MessageCircle className="w-10 h-10 text-white" />
            </div>
          </motion.div>
          
          <motion.h2 
            className="text-4xl md:text-6xl font-black mb-6 text-white"
            variants={fadeInUp}
          >
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Connectons-nous
            </span>
            <motion.span
              className="inline-block ml-3 text-4xl"
              animate={{ rotate: [0, 20, -20, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              🤝
            </motion.span>
          </motion.h2>
          
          <motion.p 
            className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
            variants={fadeInUp}
          >
            Découvrez notre engagement envers l'excellence dans le transport et la logistique. 
            Notre équipe est disponible pour répondre à tous vos besoins.
          </motion.p>
        </motion.div>

        {/* Stats Section */}
        <StatsSection />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Side - Contact Info & Newsletter */}
          <div className="space-y-8">
            <ContactInfoCard />
            <NewsletterCard />
          </div>

          {/* Right Side - Social Links & CTA */}
          <div className="space-y-8">
            <SocialLinksSection />
            <CTACard />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;