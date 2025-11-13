import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calculator,
  MapPin,
  Package,
  Weight,
  Zap,
  DollarSign,
  Sparkles,
  Info,
} from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";

export default function PricingCalculator() {
  const [weight, setWeight] = useState(1);
  const [itemType, setItemType] = useState("standard");
  const [destination, setDestination] = useState("cap-haitien");

  // Get settings from global context
  const {
    shippingRates,
    specialItems,
    isLoading: loading,
    getRate,
  } = useSettings();

  // Tarifs de base selon la destination
  const serviceFee = shippingRates.serviceFee;
  const perLbsRate = getRate(destination);

  // Vérifier si c'est un article à tarif spécial
  const isSpecialItem = itemType !== "standard";

  // Trouver l'article spécial sélectionné
  const selectedSpecialItem = specialItems.items.find(
    (item) => item.id === itemType
  );

  // Frais supplémentaires pour le type d'article sélectionné
  const specialFee =
    isSpecialItem && selectedSpecialItem ? selectedSpecialItem.price : 0;

  // Calcul du coût total
  const weightCost = isSpecialItem ? 0 : weight * perLbsRate;
  const totalCost = serviceFee + weightCost + specialFee;

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5 },
    },
  };

  const formatItemName = (key: string) => {
    return (
      key.replace("_", " ").charAt(0).toUpperCase() +
      key.replace("_", " ").slice(1)
    );
  };

  // Log pour utiliser formatItemName (disponible pour usage futur)
  console.log("formatItemName function available:", typeof formatItemName);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-4xl mx-auto p-8"
      id="calculator"
    >
      {/* Header Section */}
      <motion.div variants={itemVariants} className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-6">
          <motion.div
            className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-2xl"
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.5 }}
          >
            <Calculator className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">
            Pnice Shipping 📦
          </h1>
        </div>
      </motion.div>

      {/* Main Calculator Card */}
      <motion.div
        variants={itemVariants}
        className="relative bg-slate-800/80 backdrop-blur-sm rounded-3xl p-8 border border-slate-700/50 shadow-2xl overflow-hidden"
      >
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-3xl"></div>

        <div className="relative z-10">
          {/* Calculator Title */}
          <motion.div variants={itemVariants} className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-blue-400" />
              <h2 className="text-3xl font-bold text-white">
                Calculez Votre Tarif ⚡
              </h2>
              <Sparkles className="w-6 h-6 text-purple-400" />
            </div>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">
              Utilisez notre calculateur intelligent pour obtenir une estimation
              précise de vos frais d'expédition ✨
            </p>
          </motion.div>

          {/* Destination Selection */}
          <motion.div variants={itemVariants} className="mb-8">
            <label className="flex items-center gap-2 text-white font-semibold mb-3 text-lg">
              <MapPin className="w-5 h-5 text-blue-400" />
              Destination 🗺️
            </label>

            <motion.select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full p-4 rounded-2xl bg-slate-700/50 text-white border-2 border-slate-600/50 focus:border-blue-400 focus:outline-none transition-all duration-300 text-lg backdrop-blur-sm"
              whileFocus={{ scale: 1.02 }}
            >
              <option value="cap-haitien" className="bg-slate-800">
                Cap-Haïtien
              </option>
              <option value="port-au-prince" className="bg-slate-800">
                Port-au-Prince
              </option>
            </motion.select>

            <motion.div
              className="mt-3 p-3 bg-slate-700/30 rounded-xl border border-slate-600/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              key={destination}
            >
              <div className="flex items-center gap-2 text-slate-200">
                <Info className="w-4 h-4 text-blue-400" />
                <span className="text-sm">
                  {destination === "port-au-prince"
                    ? `📍 Port-au-Prince: $${shippingRates.serviceFee} frais de service, $${shippingRates.ratePortAuPrince}/lbs`
                    : `📍 Cap-Haïtien: $${shippingRates.serviceFee} frais de service, $${shippingRates.rateCapHaitien}/lbs`}
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* Weight and Item Type Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Weight Input */}
            <motion.div variants={itemVariants}>
              <label className="flex items-center gap-2 text-white font-semibold mb-3 text-lg">
                <Weight className="w-5 h-5 text-purple-400" />
                Poids (lbs) ⚖️
              </label>

              <motion.input
                type="number"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className={`w-full p-4 rounded-2xl text-white border-2 transition-all duration-300 text-lg backdrop-blur-sm ${
                  isSpecialItem
                    ? "border-slate-500/50 bg-slate-600/30 cursor-not-allowed opacity-60"
                    : "border-slate-600/50 bg-slate-700/50 focus:border-purple-400 focus:outline-none"
                }`}
                placeholder="Poids en livres"
                min="1"
                step="0.1"
                disabled={isSpecialItem}
                whileFocus={!isSpecialItem ? { scale: 1.02 } : {}}
              />

              <AnimatePresence>
                {isSpecialItem && (
                  <motion.div
                    className="mt-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <div className="flex items-center gap-2 text-amber-300 text-sm">
                      <Info className="w-4 h-4" />
                      Le poids n'est pas pris en compte pour les articles à prix
                      fixe 💡
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Item Type Selection */}
            <motion.div variants={itemVariants}>
              <label className="flex items-center gap-2 text-white font-semibold mb-3 text-lg">
                <Package className="w-5 h-5 text-green-400" />
                Type d'objet 📦
              </label>

              <motion.select
                value={itemType}
                onChange={(e) => setItemType(e.target.value)}
                className="w-full p-4 rounded-2xl bg-slate-700/50 text-white border-2 border-slate-600/50 focus:border-green-400 focus:outline-none transition-all duration-300 text-lg backdrop-blur-sm"
                whileFocus={{ scale: 1.02 }}
                disabled={loading}
              >
                <option value="standard" className="bg-slate-800">
                  📦 Standard
                </option>
                {specialItems.items.map((item) => (
                  <option
                    key={item.id}
                    value={item.id}
                    className="bg-slate-800"
                  >
                    {item.category === "computer"
                      ? "💻"
                      : item.category === "phone"
                      ? "📱"
                      : "🛰️"}{" "}
                    {item.name}
                  </option>
                ))}
              </motion.select>

              <AnimatePresence>
                {isSpecialItem && selectedSpecialItem && (
                  <motion.div
                    className="mt-3 p-3 bg-green-500/10 border border-green-500/20 rounded-xl"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    key={itemType}
                  >
                    <div className="flex items-center gap-2 text-green-300 text-sm">
                      <DollarSign className="w-4 h-4" />
                      Prix fixe: ${selectedSpecialItem.price} + frais de service
                      ⚡
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Cost Breakdown */}
          <motion.div
            variants={itemVariants}
            className="relative bg-slate-900/60 backdrop-blur-sm p-6 rounded-2xl border border-slate-600/30"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-2xl"></div>

            <div className="relative z-10">
              <h3 className="flex items-center gap-2 text-white font-bold text-xl mb-4">
                <Zap className="w-5 h-5 text-yellow-400" />
                Estimation des coûts 💰
              </h3>

              <div className="space-y-3">
                <motion.div
                  className="flex justify-between items-center py-2 border-b border-slate-700/50"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <span className="text-slate-300 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-blue-400" />
                    Frais de service:
                  </span>
                  <span className="text-white font-semibold">
                    ${serviceFee.toFixed(2)}
                  </span>
                </motion.div>

                {!isSpecialItem && (
                  <motion.div
                    className="flex justify-between items-center py-2 border-b border-slate-700/50"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <span className="text-slate-300 flex items-center gap-2">
                      <Weight className="w-4 h-4 text-purple-400" />
                      Frais par poids ({weight} lbs):
                    </span>
                    <span className="text-white font-semibold">
                      ${weightCost.toFixed(2)}
                    </span>
                  </motion.div>
                )}

                {isSpecialItem && selectedSpecialItem && (
                  <motion.div
                    className="flex justify-between items-center py-2 border-b border-slate-700/50"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <span className="text-slate-300 flex items-center gap-2">
                      <Package className="w-4 h-4 text-green-400" />
                      Prix fixe ({selectedSpecialItem.name}):
                    </span>
                    <span className="text-white font-semibold">
                      ${specialFee.toFixed(2)}
                    </span>
                  </motion.div>
                )}

                <motion.div
                  className="flex justify-between items-center py-4 px-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl border border-blue-500/30"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                >
                  <span className="text-white font-bold text-xl flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-yellow-400" />
                    Total: 🎯
                  </span>
                  <motion.span
                    className="text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text font-bold text-2xl"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    ${totalCost.toFixed(2)}
                  </motion.span>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
