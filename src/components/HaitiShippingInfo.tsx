import { HandIcon, PaperAirplaneIcon } from "@heroicons/react/solid";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { 
  ClockIcon,
  BellIcon,
  ShieldCheckIcon,
  TruckIcon,
  CheckCircleIcon,
  QuestionMarkCircleIcon,
  ChevronDownIcon,
  SparklesIcon
} from "@heroicons/react/outline";
import { MapPinIcon } from "lucide-react";

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

// const scaleOnHover = {
//   hover: { 
//     scale: 1.02,
//     transition: { type: "spring", stiffness: 400, damping: 10 }
//   },
//   tap: { scale: 0.98 }
// };

// Header Section Component
const HeaderSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div 
      ref={ref}
      className="w-full max-w-6xl relative overflow-hidden rounded-3xl mb-8 md:mb-12"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8 }}
    >
      {/* Background with parallax effect */}
      <div className="relative h-80 md:h-96 overflow-hidden">
        {/* Mobile background */}
        <div 
          className="md:hidden absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/mobile-tracking-image.png')" }}
        />
        
        {/* Desktop background */}
        <div 
          className="hidden md:block absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/tracking-image.png')" }}
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/90 via-purple-900/80 to-pink-900/90" />
        
        {/* Animated particles */}
        <div className="absolute inset-0">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/30 rounded-full"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 2) * 40}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3
              }}
            />
          ))}
        </div>
        
        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="flex items-center justify-center mb-4">
              <motion.div
                className="p-3 bg-white/20 backdrop-blur-md rounded-2xl mr-4"
                whileHover={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 0.5 }}
              >
                <MapPinIcon className="w-8 h-8 text-white" />
              </motion.div>
              <motion.span
                className="text-4xl"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                🇭🇹
              </motion.span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-black text-white mb-4">
              <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                Expédition vers Haïti ✈️
              </span>
            </h1>
            
            <motion.p 
              className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto font-medium"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              Livraison ultra-rapide avec suivi en temps réel 🚀
            </motion.p>
          </motion.div>
        </div>
        
        {/* Bottom wave effect */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1200 120" className="w-full h-12 fill-gray-900">
            <motion.path
              d="M0,60 C300,120 600,0 900,60 C1050,90 1200,30 1200,30 L1200,120 L0,120 Z"
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
              transition={{ delay: 0.8, duration: 1.2 }}
            />
          </svg>
        </div>
      </div>
    </motion.div>
  );
};

// Info Card Component
const InfoCard = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  const steps = [
    {
      icon: TruckIcon,
      title: "Réception",
      description: "Votre colis arrive à notre entrepôt",
      color: "from-emerald-500 to-teal-500"
    },
    {
      icon: PaperAirplaneIcon,
      title: "Envoi aéroport",
      description: "Départ le soir même ou le lendemain",
      color: "from-blue-500 to-indigo-500"
    },
    {
      icon: MapPinIcon,
      title: "Arrivée Haïti",
      description: "Disponible en 3 à 5 jours",
      color: "from-purple-500 to-pink-500"
    }
  ];

  return (
    <motion.div 
      ref={ref}
      className="w-full max-w-6xl mb-8 md:mb-12"
      variants={staggerContainer}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      <motion.div 
        className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-6 md:p-8 shadow-2xl"
        variants={fadeInUp}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-center mb-6">
          <div className="p-3 bg-gradient-to-r from-violet-500 to-purple-500 rounded-2xl mr-4">
            <ClockIcon className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Processus d'expédition ⚡
          </h2>
        </div>
        
        {/* Timeline */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8 mb-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="relative"
            >
              <div className="flex flex-col items-center text-center">
                <motion.div
                  className={`p-4 bg-gradient-to-r ${step.color} rounded-2xl mb-4 shadow-lg`}
                  whileHover={{ 
                    scale: 1.1,
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <step.icon className="w-8 h-8 text-white" />
                </motion.div>
                
                <h3 className="text-lg font-bold text-white mb-2">
                  {step.title}
                </h3>
                
                <p className="text-sm text-gray-300">
                  {step.description}
                </p>
              </div>
              
              {/* Connecting line */}
              {index < steps.length - 1 && (
                <motion.div
                  className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-violet-500 to-purple-500 transform -translate-y-1/2"
                  initial={{ scaleX: 0 }}
                  animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                  transition={{ delay: 0.5 + index * 0.2, duration: 0.8 }}
                />
              )}
            </motion.div>
          ))}
        </div>
        
        {/* Info text with enhanced styling */}
        <motion.div
          variants={fadeInUp}
          className="bg-gradient-to-r from-gray-800/80 via-gray-700/60 to-gray-800/80 backdrop-blur-sm border border-gray-600/50 rounded-2xl p-6"
        >
          <div className="flex items-start gap-4">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <SparklesIcon className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
            </motion.div>
            
            <div>
              <p className="text-gray-200 leading-relaxed">
                <span className="font-semibold text-violet-400">📦 Service premium :</span> Une fois votre colis reçu dans notre entrepôt, 
                il est envoyé à l'aéroport le soir même ou le lendemain soir. Ensuite, il sera disponible en Haïti 
                dans un délai de 3 à 5 jours. Vous recevrez des e-mails à chaque étape du processus pour suivre l'avancement de votre colis.
              </p>
              
              <div className="flex items-center mt-4 text-sm text-emerald-400">
                <CheckCircleIcon className="w-5 h-5 mr-2" />
                <span className="font-medium">Notifications en temps réel incluses 📧</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

// FAQ Section Component
const FAQSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [openItems, setOpenItems] = useState<number[]>([0]);
  
  const faqs = [
    {
      icon: ClockIcon,
      question: "Quand mon colis arrivera-t-il en Haïti ? 🇭🇹",
      answer: "Une fois reçu dans notre entrepôt, votre colis est envoyé à l'aéroport le soir même ou le lendemain soir. Il arrivera en Haïti dans les 3 à 5 jours suivants.",
      color: "from-blue-500 to-indigo-500"
    },
    {
      icon: BellIcon,
      question: "Recevrai-je des notifications sur l'avancement de mon colis ? 📧",
      answer: "Oui, vous recevrez des e-mails à chaque étape du processus : réception à l'entrepôt, départ pour l'aéroport, et arrivée en Haïti.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: TruckIcon,
      question: "Que faire si mon colis est retardé ? ⏰",
      answer: "Si votre colis est retardé, contactez notre service client pour plus d'informations. Nous vous tiendrons informé en temps réel.",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: ShieldCheckIcon,
      question: "Les colis sont-ils assurés ? 🔒",
      answer: "Tous nos envois incluent une assurance de base. Une assurance premium est disponible pour une couverture supplémentaire.",
      color: "from-emerald-500 to-teal-500"
    }
  ];

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <motion.div 
      ref={ref}
      className="w-full max-w-6xl mb-8 md:mb-12"
      variants={staggerContainer}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {/* Images with enhanced styling */}
      <div className="mb-8 relative">
        <div className="hidden md:block relative group">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-purple-500/20 rounded-3xl blur-xl"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          <img 
            src="/tracking-image.png" 
            alt="Support client" 
            className="relative w-full h-48 object-cover rounded-3xl shadow-2xl border border-gray-700/50 group-hover:scale-[1.02] transition-transform duration-300" 
          />
        </div>
        
        <div className="md:hidden relative group">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-purple-500/20 rounded-3xl blur-xl"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          <img 
            src="/mobile-tracking-image.png" 
            alt="Support client" 
            className="relative w-full h-48 object-cover rounded-3xl shadow-2xl border border-gray-700/50 group-hover:scale-[1.02] transition-transform duration-300" 
          />
        </div>
      </div>

      <motion.div 
        className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-3xl overflow-hidden shadow-2xl"
        variants={fadeInUp}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-800/80 to-gray-700/60 p-6 border-b border-gray-600/50">
          <div className="flex items-center justify-center">
            <motion.div
              className="p-3 bg-gradient-to-r from-violet-500 to-purple-500 rounded-2xl mr-4"
              whileHover={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
            >
              <QuestionMarkCircleIcon className="w-8 h-8 text-white" />
            </motion.div>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Questions fréquentes 💬
            </h2>
          </div>
        </div>
        
        {/* FAQ Items */}
        <div className="p-6">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className={`
                  border border-gray-600/50 rounded-2xl overflow-hidden
                  ${openItems.includes(index) ? 'bg-gray-700/30' : 'bg-gray-800/30'}
                  transition-all duration-300
                `}
              >
                <motion.button
                  onClick={() => toggleItem(index)}
                  className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-700/20 transition-colors duration-200"
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center">
                    <div className={`p-2 bg-gradient-to-r ${faq.color} rounded-xl mr-4 flex-shrink-0`}>
                      <faq.icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-white text-sm md:text-base">
                      {faq.question}
                    </h3>
                  </div>
                  
                  <motion.div
                    animate={{ rotate: openItems.includes(index) ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                  </motion.div>
                </motion.button>
                
                <motion.div
                  initial={false}
                  animate={{
                    height: openItems.includes(index) ? "auto" : 0,
                    opacity: openItems.includes(index) ? 1 : 0
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="p-4 pt-0 pl-16 pr-4">
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Support Button Component
const SupportButton = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPulsing, setIsPulsing] = useState(true);

  return (
    <motion.div 
      className="fixed bottom-6 right-6 z-50"
      initial={{ scale: 0, rotate: 180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 260, 
        damping: 20,
        delay: 1
      }}
    >
      <motion.button
        className="relative group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setIsPulsing(!isPulsing)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Pulsing ring */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full"
          animate={isPulsing ? {
            scale: [1, 1.4, 1],
            opacity: [0.7, 0, 0.7]
          } : {}}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Main button */}
        <div className="relative bg-gradient-to-r from-violet-600 to-purple-600 text-white p-4 rounded-full shadow-2xl border-2 border-white/20">
          <motion.div
            animate={isHovered ? { rotate: [0, 15, -15, 0] } : {}}
            transition={{ duration: 0.5 }}
          >
            <HandIcon className="h-6 w-6" />
          </motion.div>
          
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300 -z-10" />
        </div>
        
        {/* Tooltip */}
        <motion.div
          className="absolute bottom-full right-0 mb-3 px-3 py-2 bg-gray-900/90 backdrop-blur-sm text-white text-sm rounded-xl border border-gray-700/50 whitespace-nowrap"
          initial={{ opacity: 0, y: 10, scale: 0.8 }}
          animate={isHovered ? 
            { opacity: 1, y: 0, scale: 1 } : 
            { opacity: 0, y: 10, scale: 0.8 }
          }
          transition={{ duration: 0.2 }}
        >
          Besoin d'aide ? 💬
          <div className="absolute top-full right-4 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900/90" />
        </motion.div>
      </motion.button>
    </motion.div>
  );
};

const HaitiShippingInfo = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 py-8">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-20 left-20 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.3, 1],
            x: [0, 100, 0],
            y: [0, -50, 0]
          }}
          transition={{ 
            duration: 12, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
        
        <motion.div 
          className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-purple-500/8 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            x: [0, -80, 0],
            y: [0, 50, 0]
          }}
          transition={{ 
            duration: 15, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 3
          }}
        />
      </div>

      <div className="flex flex-col items-center p-4 w-full relative z-10">
        <HeaderSection />
        <InfoCard />
        <FAQSection />
        <SupportButton />
      </div>
    </div>
  );
};

export default HaitiShippingInfo;