import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { 
  CalculatorIcon,
  ArrowRightIcon,
  SparklesIcon,
  LightningBoltIcon,
  CurrencyDollarIcon,
  ClockIcon
} from "@heroicons/react/outline";

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
    transition: { type: "spring", stiffness: 400, damping: 10 }
  },
  tap: { scale: 0.95 }
};

const GetAQuote = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
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

  const features = [
    {
      icon: LightningBoltIcon,
      text: "Estimation instantanée",
      color: "from-yellow-400 to-orange-500"
    },
    {
      icon: CurrencyDollarIcon,
      text: "Prix transparent",
      color: "from-emerald-400 to-teal-500"
    },
    {
      icon: ClockIcon,
      text: "Calcul en temps réel",
      color: "from-blue-400 to-indigo-500"
    }
  ];

  return (
    <motion.div 
      ref={ref}
      className="relative w-full mb-16"
      variants={staggerContainer}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {/* Background with animated gradients */}
      <motion.div
        className="relative overflow-hidden rounded-3xl p-1"
        variants={fadeInUp}
        whileHover="hover"
      >
        {/* Animated gradient border */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 rounded-3xl"
          animate={{
            background: [
              "linear-gradient(45deg, #8B5CF6, #A855F7, #6366F1)",
              "linear-gradient(135deg, #6366F1, #8B5CF6, #A855F7)",
              "linear-gradient(225deg, #A855F7, #6366F1, #8B5CF6)",
              "linear-gradient(315deg, #8B5CF6, #A855F7, #6366F1)"
            ]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {/* Main content container */}
        <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-8 md:p-12">
          {/* Floating particles */}
          <div className="absolute inset-0 overflow-hidden rounded-3xl">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white/40 rounded-full"
                style={{
                  left: `${15 + i * 12}%`,
                  top: `${20 + (i % 3) * 30}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0.4, 0.8, 0.4],
                  scale: [1, 1.5, 1]
                }}
                transition={{
                  duration: 3 + i * 0.3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.2
                }}
              />
            ))}
          </div>

          {/* Header section */}
          <motion.div
            className="text-center mb-8"
            variants={fadeInUp}
          >
            <div className="flex items-center justify-center mb-6">
              <motion.div
                className="p-4 bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl shadow-lg mr-4"
                whileHover={{ 
                  rotate: [0, 5, -5, 0],
                  scale: 1.05
                }}
                transition={{ duration: 0.5 }}
              >
                <CalculatorIcon className="w-8 h-8 text-white" />
              </motion.div>
              
              <motion.div
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
                <span className="text-4xl">📊</span>
              </motion.div>
            </div>

            <motion.h2 
              className="text-3xl md:text-4xl font-black text-white mb-4"
              variants={fadeInUp}
            >
              <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                Calculez Votre Tarif ⚡
              </span>
            </motion.h2>

            <motion.p 
              className="text-lg text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed"
              variants={fadeInUp}
            >
              Utilisez notre calculateur intelligent pour obtenir une estimation précise de vos frais d'expédition en quelques secondes 🚀
            </motion.p>
          </motion.div>

          {/* Features grid */}
          <motion.div
            className="grid md:grid-cols-3 gap-4 mb-8"
            variants={staggerContainer}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-4 text-center"
                whileHover={{ 
                  y: -4,
                  borderColor: "rgba(139, 92, 246, 0.5)"
                }}
                transition={{ duration: 0.2 }}
              >
                <div className={`inline-flex p-2 bg-gradient-to-r ${feature.color} rounded-xl mb-3`}>
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-sm text-gray-300 font-medium">
                  {feature.text}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Button */}
          <motion.div
            className="text-center"
            variants={fadeInUp}
          >
            <motion.button
              className="relative group inline-flex items-center gap-3 overflow-hidden"
              variants={scaleOnHover}
              whileHover="hover"
              whileTap="tap"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={handleButtonClick}
            >
              <a 
                href="#calculator"
                className="relative z-10 bg-gradient-to-r from-white to-gray-100 text-gray-900 font-bold py-4 px-8 rounded-2xl shadow-xl flex items-center gap-3 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-white/25"
              >
                <motion.div
                  animate={isHovered ? { rotate: [0, 360] } : {}}
                  transition={{ duration: 0.6 }}
                >
                  <SparklesIcon className="w-5 h-5" />
                </motion.div>
                
                <span className="text-lg">
                  Obtenir un Devis
                </span>
                
                <motion.div
                  initial={{ x: 0 }}
                  animate={{ x: isHovered ? 6 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ArrowRightIcon className="w-5 h-5" />
                </motion.div>

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

                {/* Shimmer effect */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
                  initial={{ x: '-100%' }}
                  animate={isHovered ? { x: '100%' } : { x: '-100%' }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                />
              </a>
            </motion.button>

            {/* Floating action hints */}
            <motion.div
              className="flex items-center justify-center gap-6 mt-6 text-sm text-gray-400"
              variants={fadeInUp}
            >
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 bg-emerald-400 rounded-full"
                />
                <span>Gratuit</span>
              </div>
              
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  className="w-2 h-2 bg-blue-400 rounded-full"
                />
                <span>Sans engagement</span>
              </div>
              
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                  className="w-2 h-2 bg-violet-400 rounded-full"
                />
                <span>Résultat instantané</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Background glow effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-violet-600/20 via-purple-600/20 to-indigo-600/20 rounded-3xl blur-3xl -z-10"
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>
    </motion.div>
  );
};

export default GetAQuote;