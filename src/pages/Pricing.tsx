import { motion } from 'framer-motion';
import { Monitor, Laptop, Smartphone, Tv, Check, Calculator, MessageCircle, Sparkles, Zap, Shield } from 'lucide-react';
import PricingCalculator from "../components/PricingCalculator";
import { useSettings } from "@/contexts/SettingsContext";

const Pricing = () => {
  // Get dynamic settings
  const { shippingRates, specialItems } = useSettings();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const cardVariants = {
    hidden: { y: 50, opacity: 0, scale: 0.9 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const pricingFeatures = [
    { icon: <Check size={16} />, text: "Traitement de commande" },
    { icon: <Check size={16} />, text: "Suivi en ligne" },
    { icon: <Check size={16} />, text: "Service client" }
  ];

  const weightFeatures = [
    { icon: <Check size={16} />, text: "Pesée précise" },
    { icon: <Check size={16} />, text: "Tarification transparente" },
    { icon: <Check size={16} />, text: "Sans frais cachés" }
  ];

  // Find dynamic prices for laptops and phones from specialItems
  const laptopItem = specialItems.items.find(item => item.category === 'computer');
  const phoneItem = specialItems.items.find(item => item.category === 'phone');

  const electronicDevices = [
    {
      icon: <Monitor className="w-8 h-8" />,
      title: "Ordinateurs 🖥️",
      price: "Contactez Nous",
      description: "Protection spéciale et emballage sécurisé",
      link: "https://wa.me/50931970548",
      gradient: "from-blue-500/20 to-cyan-500/20",
      borderGradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Laptop className="w-8 h-8" />,
      title: "Ordinateurs Portables 💻",
      price: laptopItem ? `+${laptopItem.price}$` : "+90$",
      description: "Emballage sécurisé avec protection contre les chocs",
      gradient: "from-purple-500/20 to-pink-500/20",
      borderGradient: "from-purple-500 to-pink-500"
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Téléphones 📱",
      price: phoneItem ? `+${phoneItem.price}$` : "+60$",
      description: "Protection spécialisée pour appareils mobiles",
      gradient: "from-green-500/20 to-emerald-500/20",
      borderGradient: "from-green-500 to-emerald-500"
    },
    {
      icon: <Tv className="w-8 h-8" />,
      title: "Télévisions 📺",
      price: "Contactez Nous",
      description: "Emballage renforcé et manipulation spéciale",
      link: "https://wa.me/50931970548",
      gradient: "from-orange-500/20 to-red-500/20",
      borderGradient: "from-orange-500 to-red-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white" id="pricings">
      <div className="absolute inset-0 opacity-40">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 py-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center mb-20"
        >
          <motion.div variants={itemVariants} className="flex justify-center items-center gap-2 mb-6">
            <Sparkles className="w-8 h-8 text-blue-400" />
            <span className="text-blue-400 font-medium text-lg">Nos Tarifs</span>
            <Sparkles className="w-8 h-8 text-blue-400" />
          </motion.div>
          
          <motion.h1 
            variants={itemVariants}
            className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent mb-6"
          >
            Tarification 🚀
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed"
          >
            Des solutions d'expédition transparentes et abordables pour tous vos besoins ✨
          </motion.p>
        </motion.div>

        {/* Hero Image Section */}
        <motion.div 
          variants={itemVariants}
          className="relative mb-20 group"
        >
          <div className="relative overflow-hidden rounded-3xl shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 z-10"></div>
            <img 
              src="/tarif.jpg" 
              alt="Pnice Shipping Services" 
              className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent z-20 flex items-end">
              <motion.div 
                className="p-8 text-white"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <h2 className="text-3xl font-bold mb-3 flex items-center gap-2">
                  <Shield className="w-8 h-8 text-blue-400" />
                  Expédition Fiable et Abordable
                </h2>
                <p className="text-lg text-slate-200">Des solutions d'expédition adaptées à tous vos besoins</p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Banner */}
        <motion.div 
          variants={cardVariants}
          className="relative bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-sm rounded-3xl p-8 text-center mb-20 border border-slate-700/50 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10"></div>
          <div className="relative z-10">
            <motion.div 
              className="flex justify-center mb-4"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Zap className="w-12 h-12 text-blue-400" />
            </motion.div>
            <h2 className="text-3xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text mb-4">
              Tarification Simple et Transparente ⚡
            </h2>
            <p className="text-lg text-slate-300">
              Chez Pnice Shipping, nous croyons en une tarification claire sans frais cachés. 💯
            </p>
          </div>
        </motion.div>

        {/* Main Pricing Cards */}
        <motion.div 
          variants={containerVariants}
          className="grid md:grid-cols-2 gap-8 mb-24"
        >
          {/* Service Fee Card */}
          <motion.div 
            variants={cardVariants}
            whileHover={{ y: -8, scale: 1.02 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-3xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative bg-slate-800/80 backdrop-blur-sm rounded-3xl p-8 border border-slate-700/50 h-full">
              <div className="text-center mb-6">
                <motion.div 
                  className="text-7xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text mb-4"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {shippingRates.serviceFee}$
                </motion.div>
                <h3 className="text-2xl font-bold mb-3 flex items-center justify-center gap-2">
                  <Calculator className="w-6 h-6 text-blue-400" />
                  Frais de Service 💰
                </h3>
                <p className="text-slate-300">
                  Frais de traitement standard appliqués à chaque expédition
                </p>
              </div>
              
              <div className="h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent my-6"></div>
              
              <ul className="space-y-3">
                {pricingFeatures.map((feature, index) => (
                  <motion.li 
                    key={index}
                    className="flex items-center gap-3 text-slate-200"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.5 }}
                  >
                    <span className="text-blue-400">{feature.icon}</span>
                    {feature.text}
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Per Pound Card */}
          <motion.div 
            variants={cardVariants}
            whileHover={{ y: -8, scale: 1.02 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative bg-slate-800/80 backdrop-blur-sm rounded-3xl p-8 border border-slate-700/50 h-full">
              <div className="text-center mb-6">
                <motion.div
                  className="text-7xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text mb-4"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {shippingRates.rateCapHaitien}$ - {shippingRates.ratePortAuPrince}$
                </motion.div>
                <h3 className="text-2xl font-bold mb-3 flex items-center justify-center gap-2">
                  <Sparkles className="w-6 h-6 text-purple-400" />
                  Par Livre (lbs) ⚖️
                </h3>
                <p className="text-slate-300">
                  Cap-Haïtien: ${shippingRates.rateCapHaitien}/lbs | Port-au-Prince: ${shippingRates.ratePortAuPrince}/lbs
                </p>
              </div>
              
              <div className="h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent my-6"></div>
              
              <ul className="space-y-3">
                {weightFeatures.map((feature, index) => (
                  <motion.li 
                    key={index}
                    className="flex items-center gap-3 text-slate-200"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.7 }}
                  >
                    <span className="text-purple-400">{feature.icon}</span>
                    {feature.text}
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </motion.div>

        {/* Special Fees Section */}
        <motion.div 
          variants={containerVariants}
          className="mb-20"
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-4xl font-bold text-transparent bg-gradient-to-r from-white to-slate-300 bg-clip-text mb-4">
              Frais Spéciaux pour Appareils Électroniques 🔌
            </h2>
            <p className="text-slate-400 text-lg">Protection premium pour vos appareils high-tech</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {electronicDevices.map((device, index) => (
              <motion.div 
                key={index}
                variants={cardVariants}
                whileHover={{ y: -8, scale: 1.05 }}
                className="relative group cursor-pointer"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${device.gradient} rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-500`}></div>
                <div className="relative bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 h-full text-center">
                  <motion.div 
                    className={`w-16 h-16 bg-gradient-to-r ${device.borderGradient} rounded-2xl flex items-center justify-center mx-auto mb-4 text-white`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    {device.icon}
                  </motion.div>
                  
                  <h3 className="text-lg font-bold mb-3 text-white">{device.title}</h3>
                  
                  <div className="text-xl font-bold mb-3">
                    {device.link ? (
                      <motion.a
                        href={device.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-transparent bg-gradient-to-r ${device.borderGradient} bg-clip-text hover:underline inline-flex items-center gap-2`}
                        whileHover={{ scale: 1.05 }}
                      >
                        <MessageCircle size={16} />
                        {device.price}
                      </motion.a>
                    ) : (
                      <span className={`text-transparent bg-gradient-to-r ${device.borderGradient} bg-clip-text`}>
                        {device.price}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {device.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Pricing Calculator */}
        <motion.div 
          variants={itemVariants}
          className="mb-20"
        >
          <PricingCalculator />
        </motion.div>

        {/* Contact Section */}
        <motion.div 
          variants={itemVariants}
          className="text-center"
        >
          <div className="relative bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-sm rounded-3xl p-12 border border-slate-700/50 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5"></div>
            <div className="relative z-10">
              <motion.div 
                className="flex justify-center mb-6"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <MessageCircle className="w-12 h-12 text-blue-400" />
              </motion.div>
              
              <h3 className="text-3xl font-bold mb-4 text-white">
                Des Questions sur nos Tarifs? 🤔
              </h3>
              
              <p className="text-lg text-slate-300 mb-8 max-w-md mx-auto">
                Notre équipe est disponible pour répondre à toutes vos questions 24/7
              </p>
              
              <motion.a
                target="_blank"
                href="https://wa.me/50948812652?text=Bonjour,%20je%20souhaite%20obtenir%20plus%20d%27informations%20sur%20vos%20services%20de%20livraison.%20Pouvez-vous%20m%27aider%20%3F"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <MessageCircle className="w-5 h-5" />
                Contactez-nous 💬
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Pricing;