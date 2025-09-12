import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { 
  Package, 
  Smartphone, 
  Laptop, 
  Tv, 
  Shirt, 
  ShoppingBag, 
  Pill, 
  Gift, 
  Watch,
  Zap,
  Shield,
  CheckCircle,
  Sparkles,
  ArrowRight,
  Scale,
  Ruler
} from "lucide-react";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.25, 0, 1] }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const scaleOnHover = {
  hover: { 
    scale: 1.05,
    y: -4,
    transition: { type: "spring", stiffness: 300, damping: 20 }
  },
  tap: { scale: 0.98 }
};

// Item Card Component
const ItemCard = ({ item, index }: { item: any, index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = item.icon;

  // Dynamic colors based on category
  const getGradient = (itemName: string) => {
    const gradients: { [key: string]: string } = {
      "Téléphone": "from-blue-500 to-indigo-600",
      "Ordinateur Portable": "from-purple-500 to-violet-600",
      "Télévision": "from-emerald-500 to-teal-600",
      "Colis Standard": "from-orange-500 to-red-600",
      "Vêtements": "from-pink-500 to-rose-600",
      "Gadgets": "from-yellow-500 to-orange-600",
      "Suppléments": "from-cyan-500 to-blue-600",
      "Médicaments": "from-red-500 to-pink-600",
      "Cosmétiques": "from-violet-500 to-purple-600",
      "Accessoires de Mode": "from-indigo-500 to-blue-600"
    };
    return gradients[itemName] || "from-gray-500 to-gray-600";
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
        className="relative bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-xl overflow-hidden h-full"
        variants={scaleOnHover}
      >
        {/* Background gradient effect */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${getGradient(item.name)}/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
        />

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl">
          {isHovered && [...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/40 rounded-full"
              style={{
                left: `${30 + i * 20}%`,
                top: `${20 + i * 15}%`,
              }}
              animate={{
                y: [0, -15, 0],
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3
              }}
            />
          ))}
        </div>

        {/* Icon section */}
        <div className="relative z-10 flex flex-col items-center text-center mb-4">
          <motion.div
            className={`relative p-4 bg-gradient-to-r ${getGradient(item.name)} rounded-2xl shadow-lg mb-3`}
            animate={isHovered ? { 
              rotate: [0, 5, -5, 0],
              scale: 1.1
            } : {}}
            transition={{ duration: 0.5 }}
          >
            <Icon className="w-8 h-8 text-white" />
            
            {/* Glow effect */}
            <motion.div
              className="absolute inset-0 rounded-2xl blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300"
              style={{ 
                background: `linear-gradient(to right, ${getGradient(item.name).split(' ').slice(1).join(' ')})` 
              }}
            />
          </motion.div>

          <motion.h3 
            className="text-lg font-bold text-white mb-2 group-hover:text-violet-200 transition-colors duration-300"
            animate={isHovered ? { scale: 1.02 } : {}}
            transition={{ duration: 0.2 }}
          >
            {item.name}
          </motion.h3>
        </div>

        {/* Specs section */}
        <div className="relative z-10 space-y-3">
          <motion.div
            className="flex items-center gap-3 text-sm text-gray-300"
            animate={isHovered ? { x: 2 } : {}}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-center w-8 h-8 bg-gray-700/50 rounded-lg">
              <Scale className="w-4 h-4 text-violet-400" />
            </div>
            <div>
              <p className="font-medium">Poids</p>
              <p className="text-xs text-gray-400">{item.weight}</p>
            </div>
          </motion.div>

          <motion.div
            className="flex items-center gap-3 text-sm text-gray-300"
            animate={isHovered ? { x: 2 } : {}}
            transition={{ duration: 0.2, delay: 0.05 }}
          >
            <div className="flex items-center justify-center w-8 h-8 bg-gray-700/50 rounded-lg">
              <Ruler className="w-4 h-4 text-violet-400" />
            </div>
            <div>
              <p className="font-medium">Taille</p>
              <p className="text-xs text-gray-400">{item.size}</p>
            </div>
          </motion.div>
        </div>

        {/* Status indicator */}
        <motion.div
          className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <div className="bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            <span>Accepté</span>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default function ShippingGuide() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const items = [
    { name: "Téléphone", icon: Smartphone, weight: "0.5 - 1 kg", size: "10 x 5 x 2 cm" },
    { name: "Ordinateur Portable", icon: Laptop, weight: "1 - 3 kg", size: "30 x 20 x 3 cm" },
    { name: "Télévision", icon: Tv, weight: "5 - 15 kg", size: "80 x 50 x 10 cm" },
    { name: "Colis Standard", icon: Package, weight: "1 - 10 kg", size: "Variable" },
    { name: "Vêtements", icon: Shirt, weight: "Variable", size: "Dépend du colis" },
    { name: "Gadgets", icon: ShoppingBag, weight: "Variable", size: "Dépend du type" },
    { name: "Suppléments", icon: Pill, weight: "Variable", size: "Petits flacons/boîtes" },
    { name: "Médicaments", icon: Pill, weight: "Variable", size: "Dépend de l'emballage" },
    { name: "Cosmétiques", icon: Gift, weight: "Variable", size: "Petits pots ou tubes" },
    { name: "Accessoires de Mode", icon: Watch, weight: "Variable", size: "Montres, lunettes, bijoux" },
  ];

  return (
    <div className="relative bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 py-16 px-6 overflow-hidden" id="guide">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute top-20 left-10 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 20, 0],
            y: [0, -15, 0]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
        
        <motion.div 
          className="absolute bottom-20 right-10 w-80 h-80 bg-purple-500/8 rounded-full blur-3xl"
          animate={{ 
            scale: [1.1, 1, 1.1],
            x: [0, -30, 0],
            y: [0, 20, 0]
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div 
          ref={ref}
          className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 shadow-2xl"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          whileHover={{ y: -2 }}
        >
          {/* Header */}
          <motion.div
            className="text-center mb-12"
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
                <Package className="w-8 h-8 text-white" />
              </motion.div>
              
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatDelay: 2
                }}
              >
                <span className="text-4xl">📦</span>
              </motion.div>
            </motion.div>

            <motion.h2 
              className="text-3xl md:text-5xl font-black mb-6 text-white"
              variants={fadeInUp}
            >
              <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                Envoyez n'importe quel colis !
              </span>
            </motion.h2>

            <motion.p 
              className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed"
              variants={fadeInUp}
            >
              Vous pouvez envoyer une large variété d'articles sans restriction de poids. 
              Découvrez nos catégories les plus populaires avec des exemples concrets.
            </motion.p>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-12 items-start">
            {/* Image section */}
            <motion.div 
              className="w-full lg:w-1/3 flex flex-col items-center"
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative group">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-purple-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                />
                
                <div className="relative bg-gray-700/30 backdrop-blur-sm border border-gray-600/50 rounded-3xl p-6 shadow-xl">
                  <img 
                    src="/warehouse.png" 
                    alt="Expédition de colis" 
                    className="w-full h-auto rounded-2xl shadow-lg object-cover group-hover:scale-[1.02] transition-transform duration-300"
                  />
                  
                  {/* Floating badges */}
                  <motion.div 
                    className="absolute -bottom-4 -right-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-2xl text-sm font-bold shadow-xl flex items-center gap-2"
                    animate={{ 
                      y: [0, -8, 0],
                      rotate: [0, 2, -2, 0]
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity, 
                      ease: "easeInOut" 
                    }}
                  >
                    <Zap className="w-4 h-4" />
                    Livraison rapide
                  </motion.div>
                  
                  <motion.div 
                    className="absolute -top-4 -left-4 bg-gradient-to-r from-violet-500 to-purple-500 text-white px-4 py-2 rounded-2xl text-sm font-bold shadow-xl flex items-center gap-2"
                    animate={{ 
                      y: [0, 6, 0],
                      rotate: [0, -2, 2, 0]
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity, 
                      ease: "easeInOut",
                      delay: 1.5 
                    }}
                  >
                    <Shield className="w-4 h-4" />
                    Sécurisé
                  </motion.div>
                </div>
              </div>

              {/* Stats */}
              <motion.div
                className="mt-8 grid grid-cols-2 gap-4 w-full max-w-sm"
                variants={staggerContainer}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
              >
                <motion.div 
                  variants={fadeInUp}
                  className="text-center bg-gray-700/30 backdrop-blur-sm border border-gray-600/50 rounded-2xl p-4"
                >
                  <div className="text-2xl font-bold text-violet-400">10+</div>
                  <div className="text-sm text-gray-400">Catégories</div>
                </motion.div>
                
                <motion.div 
                  variants={fadeInUp}
                  className="text-center bg-gray-700/30 backdrop-blur-sm border border-gray-600/50 rounded-2xl p-4"
                >
                  <div className="text-2xl font-bold text-emerald-400">100%</div>
                  <div className="text-sm text-gray-400">Acceptation</div>
                </motion.div>
              </motion.div>
            </motion.div>
            
            {/* Items grid */}
            <motion.div 
              className="w-full lg:w-2/3"
              variants={staggerContainer}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item, index) => (
                  <ItemCard key={item.name} item={item} index={index} />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Bottom CTA */}
          <motion.div
            className="text-center mt-12 pt-8 border-t border-gray-700/50"
            variants={fadeInUp}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            transition={{ delay: 0.6 }}
          >
            <div className="bg-gradient-to-r from-gray-700/30 to-gray-600/30 backdrop-blur-sm border border-gray-600/50 rounded-2xl p-6 max-w-2xl mx-auto">
              <motion.div
                className="text-3xl mb-3"
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  repeatDelay: 4
                }}
              >
                🎯
              </motion.div>
              
              <h3 className="text-xl font-bold text-white mb-3">
                Prêt à expédier votre colis ?
              </h3>
              
              <p className="text-gray-300 mb-6">
                Utilisez notre calculateur pour obtenir un devis instantané et commencez votre expédition dès maintenant.
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
                <span>Calculer mon prix</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}