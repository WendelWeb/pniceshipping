import { useState, useEffect } from "react";
import { Search, RefreshCw, Truck, Info, Package, CheckCircle, AlertCircle, Clock, MessageCircle, Sparkles, Zap, Shield, Map } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { findByTrackingNumber } from "@/utils/shipmentQueries";

interface ShipmentData {
  id: number;
  ownerId: string;
  fullName: string;
  userName: string;
  category: string;
  emailAdress: string;
  trackingNumber: string;
  weight: string;
  status: string;
  destination: string;
  estimatedDelivery: string;
  phone: string | null;
  statusDates: { status: string; date: string; location: string }[];
}

const ParcelTracker = () => {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [shipmentData, setShipmentData] = useState<ShipmentData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    // Note: localStorage usage removed for compatibility
    // const savedSearches = localStorage.getItem("recentTrackingSearches");
    // if (savedSearches) {
    //   setRecentSearches(JSON.parse(savedSearches));
    // }
  }, []);

  const saveToRecentSearches = (number: string) => {
    const updatedSearches = [
      number,
      ...recentSearches.filter(item => item !== number)
    ].slice(0, 5);
    
    setRecentSearches(updatedSearches);
    // localStorage.setItem("recentTrackingSearches", JSON.stringify(updatedSearches));
  };

  const trackParcel = async (number: string) => {
    if (!number.trim()) {
      setError("Veuillez entrer un numéro de suivi.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setShipmentData(null);
      
      const results = await findByTrackingNumber(number) as ShipmentData[];
      
      if (results && results.length > 0) {
        setShipmentData(results[0]);
        saveToRecentSearches(number);
      } else {
        setError("Aucun colis trouvé avec ce numéro de suivi.");
      }
    } catch (err) {
      console.error("Erreur lors du suivi du colis:", err);
      setError("Une erreur est survenue lors de la recherche du colis. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    trackParcel(trackingNumber);
  };

  const handleSelectRecent = (number: string) => {
    setTrackingNumber(number);
    trackParcel(number);
    setShowSuggestions(false);
  };

  const renderStatusIcon = (status: string) => {
    if (!status) return <Info className="h-6 w-6 text-gray-400" />;
    
    if (status.includes("Livré") || status.includes("✅")) 
      return <CheckCircle className="h-6 w-6 text-emerald-400" />;
    
    if (status.includes("En attente") || status.includes("⏳")) 
      return <Clock className="h-6 w-6 text-amber-400" />;
    
    if (status.includes("Transit") || status.includes("🚚")) 
      return <Truck className="h-6 w-6 text-blue-400" />;
    
    if (status.includes("Problème") || status.includes("⚠️")) 
      return <AlertCircle className="h-6 w-6 text-red-400" />;
    
    return <Package className="h-6 w-6 text-gray-400" />;
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white">
      {/* Animated background particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -inset-10 opacity-30">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-blue-400 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
              }}
              animate={{
                y: [null, -10, 10, -5],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>

      <motion.div 
        className="flex flex-col items-center p-2 md:p-4 w-full min-h-screen relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Section */}
        <motion.div 
          className="w-full max-w-4xl mb-8"
          variants={itemVariants}
        >
          <div className="relative overflow-hidden bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20 backdrop-blur-xl border border-white/10 rounded-3xl">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 blur-xl"></div>
            
            <div className="relative p-8 md:p-12 text-center">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, ease: "backOut" }}
                className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-2xl shadow-blue-500/25"
              >
                <Package className="w-10 h-10 text-white" />
              </motion.div>

              <motion.h1 
                className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                Suivez votre colis 🚚
              </motion.h1>

              <motion.p 
                className="text-lg md:text-xl text-gray-300 mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                Suivi rapide et sécurisé ⚡
              </motion.p>

              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100px" }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mx-auto"
              />
            </div>
          </div>
        </motion.div>

        {/* Search Form */}
        <motion.div 
          className="w-full max-w-4xl mb-8"
          variants={itemVariants}
        >
          <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 md:p-8 shadow-2xl">
            <motion.p 
              className="text-gray-300 mb-6 text-center leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              💡 Pour suivre votre colis sur <span className="text-blue-400 font-semibold">Pnice</span>, entrez votre numéro de suivi fourni par
              le vendeur ou la plateforme auprès de laquelle vous avez effectué votre
              achat. Nous assurons uniquement le transport de votre colis.
            </motion.p>
            
            <form onSubmit={handleSubmit} className="w-full">
              <div className="relative">
                <motion.label
                  className="block text-sm font-medium mb-3 text-gray-200 flex items-center"
                  htmlFor="tracking-number"
                  whileHover={{ x: 2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Search className="w-4 h-4 mr-2 text-blue-400" />
                  Numéro de suivi*
                </motion.label>
                
                <div className="flex items-center group">
                  <div className="relative flex-grow">
                    <motion.input
                      id="tracking-number"
                      type="text"
                      className="w-full p-4 bg-gray-900/50 border border-gray-600/50 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 text-white placeholder-gray-400 backdrop-blur-sm"
                      placeholder="Entrez le numéro de suivi... ✨"
                      value={trackingNumber}
                      onChange={(e) => {
                        setTrackingNumber(e.target.value);
                        setShowSuggestions(e.target.value.length > 0);
                      }}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                      onFocus={() => setShowSuggestions(trackingNumber.length > 0)}
                      whileFocus={{ scale: 1.01 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    />
                    
                    <AnimatePresence>
                      {showSuggestions && recentSearches.length > 0 && (
                        <motion.div 
                          className="absolute z-20 w-full mt-2 bg-gray-800/95 backdrop-blur-xl border border-gray-600/50 rounded-xl shadow-2xl max-h-60 overflow-auto"
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="p-3 text-xs text-gray-400 border-b border-gray-700/50 flex items-center">
                            <Clock className="w-3 h-3 mr-2" />
                            Recherches récentes
                          </div>
                          {recentSearches.map((number, index) => (
                            <motion.div
                              key={index}
                              className="p-3 hover:bg-gray-700/50 cursor-pointer flex items-center transition-colors duration-200"
                              onClick={() => handleSelectRecent(number)}
                              whileHover={{ x: 4, backgroundColor: "rgba(59, 130, 246, 0.1)" }}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                            >
                              <Clock className="h-4 w-4 mr-3 text-gray-400" />
                              <span className="text-gray-200">{number}</span>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  <motion.button 
                    type="submit"
                    disabled={loading}
                    className="px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-r-xl font-medium shadow-xl shadow-blue-500/25 transition-all duration-300 min-w-24 relative overflow-hidden group disabled:opacity-50"
                    whileHover={{ scale: 1.02, boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.5)" }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative flex items-center justify-center">
                      {loading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <RefreshCw className="h-5 w-5" />
                        </motion.div>
                      ) : (
                        <>
                          <span className="hidden md:inline mr-2">Suivre</span>
                          <Search className="h-5 w-5" />
                        </>
                      )}
                    </div>
                  </motion.button>
                </div>
                
                <AnimatePresence>
                  {error && (
                    <motion.div 
                      className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-center"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </form>
          </div>
        </motion.div>

        {/* Shipment Results */}
        <AnimatePresence>
          {shipmentData && (
            <motion.div 
              className="w-full max-w-4xl mb-8"
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.9 }}
              transition={{ duration: 0.5, ease: "backOut" }}
            >
              <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl overflow-hidden shadow-2xl">
                <div className="bg-gradient-to-r from-blue-600/80 to-purple-600/80 p-6">
                  <motion.h2 
                    className="text-xl md:text-2xl font-bold flex items-center text-white"
                    initial={{ x: -20 }}
                    animate={{ x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Package className="mr-3 h-6 w-6" />
                    Informations sur le colis 📦
                  </motion.h2>
                  <motion.p 
                    className="text-blue-100 mt-2 font-mono"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    Numéro de suivi: <span className="font-bold text-white bg-white/20 px-2 py-1 rounded-md">{shipmentData.trackingNumber}</span>
                  </motion.p>
                </div>
                
                <div className="p-6 md:p-8">
                  {/* General Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <motion.div 
                      className="bg-gray-900/50 p-6 rounded-xl border border-gray-700/30"
                      whileHover={{ scale: 1.02, borderColor: "rgba(59, 130, 246, 0.3)" }}
                      transition={{ duration: 0.3 }}
                    >
                      <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center">
                        <Info className="mr-2 h-5 w-5 text-blue-400" />
                        Détails du colis 📋
                      </h3>
                      <div className="space-y-3">
                        {[
                          { label: "Catégorie", value: shipmentData.category || "Non spécifié", icon: "📦" },
                          { label: "Poids", value: shipmentData.weight ? `${shipmentData.weight} lbs` : "Non spécifié", icon: "⚖️" },
                          { label: "Destination", value: shipmentData.destination || "Non spécifié", icon: "📍" },
                          { label: "Livraison estimée", value: shipmentData.estimatedDelivery ? new Date(shipmentData.estimatedDelivery).toLocaleDateString() : "Non spécifié", icon: "📅" }
                        ].map((item, index) => (
                          <motion.div 
                            key={index}
                            className="flex justify-between items-center p-3 bg-gray-800/30 rounded-lg hover:bg-gray-700/30 transition-colors duration-200"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * index }}
                          >
                            <span className="text-gray-400 flex items-center">
                              <span className="mr-2">{item.icon}</span>
                              {item.label}:
                            </span>
                            <span className="font-medium text-white">{item.value}</span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      className="bg-gray-900/50 p-6 rounded-xl border border-gray-700/30"
                      whileHover={{ scale: 1.02, borderColor: "rgba(34, 197, 94, 0.3)" }}
                      transition={{ duration: 0.3 }}
                    >
                      <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center">
                        <Zap className="mr-2 h-5 w-5 text-emerald-400" />
                        Statut actuel ⚡
                      </h3>
                      <motion.div 
                        className="flex items-center mb-4 p-4 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-lg"
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        <motion.div
                          animate={{ rotate: [0, 5, -5, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          {renderStatusIcon(shipmentData.status)}
                        </motion.div>
                        <span className="ml-3 text-lg font-semibold text-white">
                          {shipmentData.status || "Statut inconnu"}
                        </span>
                      </motion.div>
                      
                      <div className="text-sm text-gray-400 flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-blue-400" />
                        <p>Dernière mise à jour: {shipmentData.statusDates && shipmentData.statusDates.length > 0 
                          ? shipmentData.statusDates[shipmentData.statusDates.length - 1].date 
                          : "Non disponible"}
                        </p>
                      </div>
                    </motion.div>
                  </div>
                  
                  {/* Status Timeline */}
                  <motion.div 
                    className="mb-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <h3 className="text-lg font-semibold text-gray-200 mb-6 flex items-center">
                      <Clock className="mr-3 h-5 w-5 text-blue-400" />
                      Historique de suivi 📈
                    </h3>
                    
                    {shipmentData.statusDates && shipmentData.statusDates.length > 0 ? (
                      <div className="relative">
                        {/* Timeline line */}
                        <motion.div 
                          className="absolute left-6 top-0 w-0.5 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"
                          initial={{ height: 0 }}
                          animate={{ height: "100%" }}
                          transition={{ duration: 1, delay: 0.8 }}
                        ></motion.div>
                        
                        <div className="space-y-6">
                          {[...shipmentData.statusDates].reverse().map((statusItem, index) => (
                            <motion.div 
                              key={index} 
                              className="ml-12 relative"
                              initial={{ opacity: 0, x: -50 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.9 + index * 0.1 }}
                            >
                              {/* Timeline dot */}
                              <motion.div 
                                className="absolute -left-12 mt-2 h-6 w-6 rounded-full border-2 border-blue-500 bg-gray-900 shadow-lg shadow-blue-500/50"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 1 + index * 0.1, type: "spring" }}
                                whileHover={{ scale: 1.2 }}
                              >
                                <motion.div
                                  className="absolute inset-1 bg-blue-500 rounded-full"
                                  animate={{ opacity: [0.5, 1, 0.5] }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                />
                              </motion.div>
                              
                              <motion.div 
                                className="bg-gray-900/50 p-4 rounded-xl border border-gray-700/30 hover:border-blue-500/30 transition-all duration-300"
                                whileHover={{ scale: 1.02, backgroundColor: "rgba(17, 24, 39, 0.8)" }}
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <span className="font-semibold text-white">{statusItem.status}</span>
                                  <span className="text-sm text-gray-400 bg-gray-800 px-2 py-1 rounded-md">{statusItem.date}</span>
                                </div>
                                <p className="text-sm text-gray-300 flex items-center">
                                  <Map className="w-4 h-4 mr-2 text-gray-400" />
                                  {statusItem.location}
                                </p>
                              </motion.div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <motion.div 
                        className="p-6 bg-gray-900/30 rounded-xl text-center text-gray-400 border border-gray-700/30"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                      >
                        <Package className="w-8 h-8 mx-auto mb-2 text-gray-500" />
                        Aucun historique de statut disponible pour ce colis.
                      </motion.div>
                    )}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Info Cards */}
        <motion.div 
          className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8"
          variants={itemVariants}
        >
          {[
            {
              icon: Package,
              title: "Ce que vous pouvez envoyer 📦",
              description: "Découvrez les types de colis que nous acceptons pour l'expédition.",
              link: "/guide/shipping-items",
              gradient: "from-blue-500/20 to-cyan-500/20",
              iconColor: "text-blue-400"
            },
            {
              icon: Info,
              title: "Guide des tailles et poids 📏",
              description: "Consultez notre guide pour préparer correctement vos colis.",
              link: "/guide/size-weight",
              gradient: "from-emerald-500/20 to-teal-500/20",
              iconColor: "text-emerald-400"
            },
            {
              icon: Truck,
              title: "Zones de livraison 🌍",
              description: "Vérifiez les régions desservies et les délais estimés.",
              link: "/delivery-zones",
              gradient: "from-purple-500/20 to-pink-500/20",
              iconColor: "text-purple-400"
            }
          ].map((card, index) => (
            <motion.div
              key={index}
              className={`bg-gradient-to-br ${card.gradient} backdrop-blur-xl border border-white/10 p-6 rounded-2xl text-center shadow-xl hover:shadow-2xl transition-all duration-300 group cursor-pointer`}
              whileHover={{ 
                scale: 1.05, 
                y: -10,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
              }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * index, duration: 0.5 }}
            >
              <motion.div 
                className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300`}
                whileHover={{ rotate: 5, scale: 1.1 }}
              >
                <card.icon className={`h-8 w-8 ${card.iconColor}`} />
              </motion.div>
              <h3 className="font-bold text-white mb-3 group-hover:text-blue-300 transition-colors duration-300">
                {card.title}
              </h3>
              <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                {card.description}
              </p>
              <motion.a 
                href={card.link} 
                className="text-blue-400 hover:text-blue-300 text-sm font-semibold inline-flex items-center group-hover:underline"
                whileHover={{ x: 5 }}
              >
                En savoir plus
                <Sparkles className="ml-1 h-3 w-3" />
              </motion.a>
            </motion.div>
          ))}
        </motion.div>

        {/* FAQ Section */}
        <motion.div 
          className="w-full max-w-4xl mb-8"
          variants={itemVariants}
        >
          <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 p-6 border-b border-gray-700/50">
              <motion.h2 
                className="text-xl md:text-2xl font-bold text-white flex items-center"
                whileHover={{ x: 5 }}
              >
                <Info className="mr-3 h-6 w-6 text-blue-400" />
                Questions fréquentes 💡
              </motion.h2>
            </div>
            
            <div className="p-6 md:p-8">
              <div className="space-y-6">
                {[
                  {
                    question: "Combien de temps prend une livraison standard ? ⏰",
                    answer: "La durée de livraison standard est généralement de 3 à 5 jours ouvrables, selon la destination. Des options d'expédition express sont également disponibles.",
                    icon: Clock
                  },
                  {
                    question: "Que faire si mon colis est retardé ? ⚠️",
                    answer: "Si vous constatez un retard dans la livraison de votre colis, vous pouvez contacter notre service client avec votre numéro de suivi pour obtenir plus d'informations.",
                    icon: AlertCircle
                  },
                  {
                    question: "Comment modifier l'adresse de livraison d'un colis ? 📍",
                    answer: "Pour modifier l'adresse de livraison d'un colis déjà expédié, veuillez contacter notre service client dès que possible. Des frais supplémentaires peuvent s'appliquer.",
                    icon: Map
                  },
                  {
                    question: "Les colis sont-ils assurés ? 🛡️",
                    answer: "Tous nos envois incluent une assurance de base. Pour une couverture supplémentaire, vous pouvez souscrire à notre assurance premium lors de l'expédition.",
                    icon: Shield
                  }
                ].map((faq, index) => (
                  <motion.div
                    key={index}
                    className="bg-gray-900/30 border border-gray-700/30 rounded-xl p-6 hover:bg-gray-800/40 hover:border-blue-500/30 transition-all duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-start space-x-4">
                      <motion.div
                        className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center"
                        whileHover={{ rotate: 5, scale: 1.1 }}
                      >
                        <faq.icon className="w-5 h-5 text-blue-400" />
                      </motion.div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white mb-3 text-lg">
                          {faq.question}
                        </h3>
                        <p className="text-gray-300 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Floating Help Button */}
        <motion.div 
          className="fixed bottom-6 right-6 z-50"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 1, type: "spring", stiffness: 200 }}
        >
          <motion.button 
            className="w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl shadow-2xl shadow-blue-500/50 flex items-center justify-center relative overflow-hidden group"
            whileHover={{ 
              scale: 1.1, 
              rotate: 5,
              boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.8)"
            }}
            whileTap={{ scale: 0.9 }}
            animate={{ 
              boxShadow: [
                "0 0 20px rgba(59, 130, 246, 0.3)",
                "0 0 40px rgba(147, 51, 234, 0.4)",
                "0 0 20px rgba(59, 130, 246, 0.3)"
              ]
            }}
            transition={{ 
              boxShadow: { duration: 3, repeat: Infinity },
              default: { type: "spring", stiffness: 300 }
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
            <motion.div
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              <MessageCircle className="w-6 h-6" />
            </motion.div>
            
            {/* Notification dot */}
            <motion.div
              className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <span className="text-xs font-bold text-white">!</span>
            </motion.div>
          </motion.button>
        </motion.div>
      </motion.div>
    </div>);
  };
  
  export default ParcelTracker;