import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion,  } from "framer-motion";
import { Shipment, StatusDates } from "@/types/shipment";
import { findById } from "@/utils/shipmentQueries";
import { getShippingRate, SERVICE_FEE, FIXED_ITEM_RATES } from "@/constants/shippingRates";
import {
  CheckCircleIcon,
  InformationCircleIcon,
} from "@heroicons/react/solid";
import { 
  MapPinIcon, 
  MessageSquare, 
  Package,
  Zap,
  Star,
  Truck,
  Clock,
  DollarSign,
  Phone,
  User,
  AlertCircle,
  ChevronLeft,
  ExternalLink,
  Sparkles,
  Target,
  Timer,
  Wallet
} from "lucide-react";

const ShipmentView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mappage des catégories normalisées aux clés de FIXED_ITEM_RATES
  const categoryMapping: Record<string, string> = {
    telephone: "telephones",
    telephones: "telephones",
    téléphone: "telephones",
    téléphones: "telephones",
    ordinateurportbable: "ordinateurs_portables", // Gère la typo
    ordinateurportable: "ordinateurs_portables",
    ordinateursportables: "ordinateurs_portables",
    ordinateurportables: "ordinateurs_portables",
    starlink: "starlink",
  };

  useEffect(() => {
    const fetchShipment = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const result = await findById(parseInt(id));
        if (!result) throw new Error("Colis non trouvé");
        setShipment({
          ...result,
          statusDates: (result.statusDates as StatusDates[]) || [],
          phone: result.phone || "Non disponible",
        });
      } catch (err) {
        setError("Erreur lors de la récupération du colis");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchShipment();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900">
        <motion.div 
          className="relative"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="w-20 h-20 border-4 border-indigo-500/30 border-t-indigo-400 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-0 w-20 h-20 border-2 border-purple-400/20 border-b-purple-400 rounded-full"
            animate={{ rotate: -360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
          <motion.div 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Package className="w-8 h-8 text-indigo-400" />
          </motion.div>
          <motion.p 
            className="text-slate-300 mt-6 text-center font-medium"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ✨ Chargement de ton colis...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  if (error || !shipment) {
    return (
      <motion.div 
        className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-red-900/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="text-center max-w-md mx-auto p-8 bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
        >
          <motion.div
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          </motion.div>
          <h2 className="text-2xl font-bold text-red-400 mb-2">🚨 Oops!</h2>
          <p className="text-slate-300 mb-6">{error || "Colis non trouvé"}</p>
          <motion.button
            onClick={() => navigate("/dashboard")}
            className="group flex items-center gap-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-2xl hover:from-indigo-400 hover:to-purple-500 transition-all duration-300 font-medium shadow-lg hover:shadow-indigo-500/25 mx-auto"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <ChevronLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
            Retour dans mes colis
          </motion.button>
        </motion.div>
      </motion.div>
    );
  }

  // Calcul des frais
  const poids = parseFloat(shipment.weight || "0");
  const rate = getShippingRate(shipment.destination || "");
  let shippingCost = 0;
  let totalCost = 0;
  let isFixedRate = false;
  let fixedRateCategory: string | undefined;

  // Normalisation de la catégorie
  const normalizedCategory = shipment.category
    ?.toLowerCase()
    .replace(/[\s-]/g, "")
    .replace("portbable", "portables")
    .replace(/[éèê]/g, "e");

  if (normalizedCategory) {
    const mappedCategory = categoryMapping[normalizedCategory] || normalizedCategory;
    if (mappedCategory in FIXED_ITEM_RATES) {
      // Item spécial : tarif fixe + frais de service
      shippingCost = FIXED_ITEM_RATES[mappedCategory];
      totalCost = shippingCost + SERVICE_FEE;
      isFixedRate = true;
      fixedRateCategory = mappedCategory
        .charAt(0)
        .toUpperCase()
        + mappedCategory.slice(1).replace("_", " ");
    } else {
      // Standard ou inconnu : tarif par livre + frais de service
      shippingCost = poids * rate;
      totalCost = shippingCost + SERVICE_FEE;
      isFixedRate = false;
    }
  } else {
    // Pas de catégorie : tarif par livre + frais de service
    shippingCost = poids * rate;
    totalCost = shippingCost + SERVICE_FEE;
    isFixedRate = false;
  }

  const getFraisExplanation = () => {
    if (isFixedRate) {
      return `Tarif fixe de $${shippingCost.toFixed(2)} pour ${fixedRateCategory} + $${SERVICE_FEE.toFixed(2)} de frais de service.`;
    }
    return `Frais calculés à $${rate.toFixed(2)}/lb pour ${poids} lbs = $${shippingCost.toFixed(2)} + $${SERVICE_FEE.toFixed(2)} de frais de service.`;
  };

  const statusSteps = ["En attente⏳", "Recu📦", "En Transit✈️", "Disponible🟢", "Livré✅"];
  const currentStepIndex = statusSteps.indexOf(shipment.status);
  const progressPercent = ((currentStepIndex + 1) / statusSteps.length) * 100;

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900/20 p-4 sm:p-6 lg:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="bg-slate-800/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-700/50 overflow-hidden"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {/* En-tête premium */}
          <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6 sm:p-8">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <motion.div 
                  className="flex items-center gap-4"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6, type: "spring" }}
                    className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm"
                  >
                    <Package className="h-10 w-10 sm:h-12 sm:w-12 text-yellow-300" />
                  </motion.div>
                  <div>
                    <motion.h1 
                      className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white"
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      🚀 Colis #{shipment.trackingNumber}
                    </motion.h1>
                    <motion.p 
                      className="text-white/80 text-sm sm:text-base mt-1"
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      ID unique : {shipment.id} ✨
                    </motion.p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex flex-col sm:flex-row gap-3"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <motion.a
                    href="https://wa.me/50948812652"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white px-4 py-3 rounded-2xl transition-all duration-300 font-medium shadow-lg hover:shadow-green-500/25"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <MessageSquare className="h-5 w-5 transition-transform group-hover:scale-110" />
                    💬 Aide WhatsApp
                    <ExternalLink className="h-4 w-4 opacity-70" />
                  </motion.a>
                  
                  <motion.button
                    onClick={() => navigate("/dashboard")}
                    className="group flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-3 rounded-2xl transition-all duration-300 font-medium border border-white/20 hover:border-white/40"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ChevronLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
                    Retour
                  </motion.button>
                </motion.div>
              </div>
            </div>
            
            {/* Particules décoratives */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-white/20 rounded-full"
                  style={{
                    left: `${20 + i * 15}%`,
                    top: `${30 + (i % 2) * 40}%`,
                  }}
                  animate={{
                    y: [0, -10, 0],
                    opacity: [0.3, 0.7, 0.3],
                  }}
                  transition={{
                    duration: 2 + i * 0.3,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Contenu principal */}
          <div className="p-6 sm:p-8 grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Colonne gauche : Infos détaillées */}
            <div className="xl:col-span-2 space-y-8">
              {/* Informations principales */}
              <motion.div 
                className="bg-slate-800/30 backdrop-blur-sm p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-700/50"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <motion.h2 
                  className="text-2xl sm:text-3xl font-bold text-white mb-6 flex items-center gap-3"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <motion.div
                    whileHover={{ rotate: 15, scale: 1.1 }}
                    className="bg-indigo-500/20 p-2 rounded-xl"
                  >
                    <Target className="h-7 w-7 text-indigo-400" />
                  </motion.div>
                  📋 Détails de ton colis
                </motion.h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm sm:text-base">
                  {[
                    { icon: User, label: "Propriétaire", value: shipment.userName || "Inconnu", color: "text-blue-400" },
                    { icon: Phone, label: "Téléphone", value: shipment.phone, color: "text-green-400" },
                    { icon: Package, label: "N° Tracking", value: shipment.trackingNumber, color: "text-purple-400" },
                    { icon: MapPinIcon, label: "Destination", value: shipment.destination || "Non spécifiée", color: "text-pink-400" },
                    { icon: Timer, label: "Date estimée", value: shipment.estimatedDelivery || "Pas encore connue", color: "text-yellow-400" },
                    { icon: Zap, label: "Poids", value: `${shipment.weight} lbs`, color: "text-orange-400" },
                    { icon: Star, label: "Catégorie", value: shipment.category || "Non précisée", color: "text-cyan-400" },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      className="group"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      whileHover={{ x: 5 }}
                    >
                      <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-700/30 hover:bg-slate-700/50 transition-all duration-300 border border-slate-600/30 hover:border-slate-600/60">
                        <motion.div
                          whileHover={{ scale: 1.2, rotate: 10 }}
                          className={`${item.color} bg-slate-700 p-2 rounded-xl`}
                        >
                          <item.icon className="h-5 w-5" />
                        </motion.div>
                        <div className="flex-1">
                          <p className="text-slate-400 text-sm mb-1">{item.label}</p>
                          <p className="font-semibold text-white">{item.value}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {/* Statut spécial */}
                  <motion.div
                    className="sm:col-span-2"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1.3 }}
                  >
                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-700/30 border border-slate-600/30">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="bg-slate-700 p-2 rounded-xl"
                      >
                        <Sparkles className="h-5 w-5 text-indigo-400" />
                      </motion.div>
                      <div className="flex-1">
                        <p className="text-slate-400 text-sm mb-1">Statut actuel</p>
                        <motion.span 
                          className={`inline-flex items-center px-4 py-2 text-sm font-semibold rounded-full ${getStatusColor(shipment.status)}`}
                          whileHover={{ scale: 1.05 }}
                        >
                          {shipment.status}
                        </motion.span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Historique avec barre de progression */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <motion.h2 
                  className="text-2xl sm:text-3xl font-bold text-white mb-6 flex items-center gap-3"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.8 }}
                    className="bg-purple-500/20 p-2 rounded-xl"
                  >
                    <Clock className="h-7 w-7 text-purple-400" />
                  </motion.div>
                  🛤️ L'aventure de ton colis
                </motion.h2>
                
                {/* Barre de progression premium */}
                <motion.div 
                  className="relative w-full bg-slate-700/50 rounded-full h-3 mb-8 overflow-hidden"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                >
                  <motion.div
                    className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-full rounded-full relative"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ delay: 1, duration: 1.2, ease: "easeOut" }}
                  >
                    <motion.div
                      className="absolute right-0 top-0 h-full w-8 bg-white/30 rounded-full"
                      animate={{ x: [0, 10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </motion.div>
                </motion.div>
                
                {/* Timeline */}
                <div className="relative">
                  {shipment.statusDates.map((stage, index) => (
                    <motion.div 
                      key={index} 
                      className="relative flex items-start mb-8 last:mb-0"
                      initial={{ x: -30, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 1.2 + index * 0.2 }}
                    >
                      {/* Ligne de connexion */}
                      {index < shipment.statusDates.length - 1 && (
                        <div className="absolute left-6 top-12 w-0.5 bg-gradient-to-b from-indigo-500 to-purple-500 h-16 opacity-60" />
                      )}
                      
                      {/* Point de timeline */}
                      <motion.div 
                        className="flex-shrink-0 mr-6 relative z-10"
                        whileHover={{ scale: 1.2 }}
                      >
                        <motion.div
                          className={`h-12 w-12 rounded-full border-4 flex items-center justify-center ${
                            stage.status === "Livré✅" 
                              ? "bg-green-500 border-green-400 shadow-lg shadow-green-500/50" 
                              : "bg-indigo-500 border-indigo-400 shadow-lg shadow-indigo-500/50"
                          }`}
                          animate={{ 
                            boxShadow: [
                              "0 0 20px rgba(99, 102, 241, 0.5)",
                              "0 0 30px rgba(99, 102, 241, 0.8)",
                              "0 0 20px rgba(99, 102, 241, 0.5)"
                            ]
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          {stage.status === "Livré✅" ? (
                            <CheckCircleIcon className="h-6 w-6 text-white" />
                          ) : (
                            <Truck className="h-6 w-6 text-white" />
                          )}
                        </motion.div>
                      </motion.div>
                      
                      {/* Contenu */}
                      <motion.div 
                        className="flex-1 bg-slate-800/30 backdrop-blur-sm p-6 rounded-2xl border border-slate-700/50 hover:bg-slate-800/50 transition-all duration-300"
                        whileHover={{ y: -2, scale: 1.02 }}
                      >
                        <p className="text-lg font-bold text-white mb-2">{stage.date}</p>
                        <p className="text-slate-300 font-medium mb-1">{stage.status}</p>
                        <p className="text-slate-400 text-sm">{stage.location || "🌍 Lieu non précisé"}</p>
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Explication simple */}
              <motion.div 
                className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 backdrop-blur-sm p-6 sm:p-8 rounded-3xl shadow-xl border border-amber-500/20"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                <motion.h2 
                  className="text-2xl sm:text-3xl font-bold text-white mb-6 flex items-center gap-3"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.9 }}
                >
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                    className="bg-amber-500/20 p-2 rounded-xl"
                  >
                    <InformationCircleIcon className="h-7 w-7 text-amber-400" />
                  </motion.div>
                  💡 Tout savoir sur ton envoi
                </motion.h2>
                
                <motion.div 
                  className="text-slate-300 leading-relaxed space-y-4"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  <p className="text-base sm:text-lg">
                    <strong className="text-white">👋 Salut !</strong> Ce colis appartient à <span className="text-amber-400 font-semibold">{shipment.fullName || "quelqu'un"}</span>.
                  </p>
                  
                  <p>
                    Son numéro de suivi est <span className="bg-slate-700 text-indigo-400 px-3 py-1 rounded-lg font-mono">{shipment.trackingNumber}</span>, 
                    c'est comme sa carte d'identité pour qu'on puisse le retrouver facilement ! 🎯
                  </p>

                  <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
                    <p className="font-semibold text-white mb-2">📌 Statut actuel : {shipment.status}</p>
                    <p className="text-slate-300">
                      {shipment.status === "En attente⏳"
                        ? "🔄 Le client a demandé l'expédition et on attend de le recevoir."
                        : shipment.status === "Recu📦"
                        ? "✅ On l'a bien reçu dans notre entrepôt de Miami, FL 31166. On va le peser bientôt pour calculer les frais d'envoi."
                        : shipment.status === "En Transit✈️"
                        ? "🚀 Il est en route, soit dans un camion, soit dans un avion."
                        : shipment.status === "Disponible🟢"
                        ? "🎉 Il est prêt à être récupéré."
                        : "🏆 Il est arrivé à sa destination !"}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div className="bg-slate-800/30 p-3 rounded-xl">
                      <p><span className="text-indigo-400">📦 Poids :</span> {shipment.weight ? `${shipment.weight} lb` : "⏱️ On va le peser bientôt"}</p>
                    </div>
                    <div className="bg-slate-800/30 p-3 rounded-xl">
                      <p><span className="text-purple-400">🎯 Destination :</span> {shipment.destination || "Non spécifiée"}</p>
                    </div>
                    <div className="bg-slate-800/30 p-3 rounded-xl">
                      <p><span className="text-green-400">⏳ Pris en charge :</span> {shipment.statusDates[0]?.date || "Date inconnue"}</p>
                    </div>
                    <div className="bg-slate-800/30 p-3 rounded-xl">
                      <p><span className="text-yellow-400">🚚 Arrivée prévue :</span> {shipment.estimatedDelivery || "Bientôt"}</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/30 p-4 rounded-2xl">
                    <h4 className="text-emerald-400 font-semibold mb-2">💰 Détail des frais</h4>
                    <div className="space-y-1 text-slate-300">
                      <p>💵 Frais d'expédition : <span className="text-emerald-400 font-semibold">${shippingCost.toFixed(2)}</span> 
                      {isFixedRate ? ` (Tarif fixe pour ${fixedRateCategory})` : ` (Calculé à ${rate.toFixed(2)}/lb pour ${poids} lbs)`}</p>
                      <p>🔧 Frais de service : <span className="text-emerald-400 font-semibold">${SERVICE_FEE.toFixed(2)}</span></p>
                      <p className="text-lg font-bold">💎 Total : <span className="text-emerald-400">${totalCost.toFixed(2)}</span></p>
                    </div>
                  </div>

                  <motion.div 
                    className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-2xl"
                    whileHover={{ scale: 1.02 }}
                  >
                    <p className="text-blue-400">
                      ❓ <strong>Une question ?</strong> Envoie-nous un message sur WhatsApp :{" "}
                      <motion.a 
                        href="https://wa.me/50931970548" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-green-400 underline font-semibold hover:text-green-300 transition-colors"
                        whileHover={{ scale: 1.05 }}
                      >
                        +509 31 97 0548 📱
                      </motion.a>
                    </p>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>

            {/* Colonne droite : Prix et résumé */}
            <div className="space-y-6">
              {/* Breakdown du prix premium */}
              <motion.div 
                className="bg-gradient-to-br from-emerald-500/10 to-green-600/10 backdrop-blur-sm p-6 sm:p-8 rounded-3xl shadow-xl border border-emerald-500/20 sticky top-6"
                initial={{ x: 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <motion.h3 
                  className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-3"
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className="bg-emerald-500/20 p-2 rounded-xl"
                  >
                    <Wallet className="h-6 w-6 text-emerald-400" />
                  </motion.div>
                  💰 Le prix, c'est combien ?
                </motion.h3>
                
                <div className="space-y-4">
                  {/* Frais d'expédition */}
                  <motion.div 
                    className="flex justify-between items-center p-4 bg-slate-800/30 rounded-2xl border border-slate-700/50"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    whileHover={{ x: 5, backgroundColor: "rgba(30, 41, 59, 0.5)" }}
                  >
                    <div className="flex items-center gap-3">
                      <motion.div
                        whileHover={{ rotate: 180 }}
                        className="text-indigo-400"
                      >
                        <Package className="h-5 w-5" />
                      </motion.div>
                      <div>
                        <p className="text-slate-300 text-sm">
                          {isFixedRate ? `Tarif fixe (${fixedRateCategory})` : `Poids (${poids} lbs × ${rate}/lb)`}
                        </p>
                        <p className="text-xs text-slate-400">Expédition</p>
                      </div>
                    </div>
                    <p className="font-bold text-white text-lg">${shippingCost.toFixed(2)}</p>
                  </motion.div>
                  
                  {/* Frais de service */}
                  <motion.div 
                    className="flex justify-between items-center p-4 bg-slate-800/30 rounded-2xl border border-slate-700/50"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    whileHover={{ x: 5, backgroundColor: "rgba(30, 41, 59, 0.5)" }}
                  >
                    <div className="flex items-center gap-3">
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-purple-400"
                      >
                        <Zap className="h-5 w-5" />
                      </motion.div>
                      <div>
                        <p className="text-slate-300 text-sm">Frais de service</p>
                        <p className="text-xs text-slate-400">Traitement</p>
                      </div>
                    </div>
                    <p className="font-bold text-white text-lg">${SERVICE_FEE.toFixed(2)}</p>
                  </motion.div>
                  
                  {/* Total avec effet spécial */}
                  <motion.div 
                    className="relative overflow-hidden p-6 bg-gradient-to-r from-emerald-600/20 to-green-600/20 rounded-2xl border-2 border-emerald-500/40"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.9, type: "spring", stiffness: 100 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-green-500/10 animate-pulse" />
                    <div className="relative flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <motion.div
                          animate={{ 
                            scale: [1, 1.2, 1],
                            rotate: [0, 180, 360]
                          }}
                          transition={{ duration: 3, repeat: Infinity }}
                          className="text-emerald-400"
                        >
                          <DollarSign className="h-8 w-8" />
                        </motion.div>
                        <div>
                          <p className="text-white font-bold text-xl">Total à payer</p>
                          <p className="text-emerald-400 text-sm">Tout compris ✨</p>
                        </div>
                      </div>
                      <motion.p 
                        className="font-bold text-emerald-400 text-3xl"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        ${totalCost.toFixed(2)}
                      </motion.p>
                    </div>
                  </motion.div>
                  
                  {/* Explication */}
                  <motion.p 
                    className="text-xs text-slate-400 mt-4 p-3 bg-slate-800/20 rounded-xl border border-slate-700/30"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.1 }}
                  >
                    ℹ️ {getFraisExplanation()}
                  </motion.p>
                </div>
              </motion.div>

              {/* Résumé rapide premium */}
              <motion.div 
                className="bg-gradient-to-br from-indigo-500/10 to-purple-600/10 backdrop-blur-sm p-6 rounded-3xl shadow-xl border border-indigo-500/20"
                initial={{ x: 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.6 }}
              >
                <motion.h3 
                  className="text-xl font-bold text-white mb-6 flex items-center gap-3"
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <motion.div
                    whileHover={{ rotate: -360 }}
                    transition={{ duration: 0.8 }}
                    className="bg-indigo-500/20 p-2 rounded-xl"
                  >
                    <Sparkles className="h-6 w-6 text-indigo-400" />
                  </motion.div>
                  📋 En bref
                </motion.h3>
                
                <div className="space-y-3">
                  {[
                    { emoji: "📦", label: "Colis", value: shipment.trackingNumber },
                    { emoji: "⚖️", label: "Poids", value: `${shipment.weight} lbs` },
                    { emoji: "🏠", label: "Destination", value: shipment.destination },
                    { emoji: "📅", label: "Arrive", value: shipment.estimatedDelivery || "Bientôt" },
                    { emoji: "💰", label: "Coût", value: `${totalCost.toFixed(2)}` },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center justify-between p-3 bg-slate-800/30 rounded-xl hover:bg-slate-800/50 transition-all duration-300 group"
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.9 + index * 0.1 }}
                      whileHover={{ x: -5 }}
                    >
                      <div className="flex items-center gap-3">
                        <motion.span 
                          className="text-xl"
                          whileHover={{ scale: 1.3, rotate: 360 }}
                          transition={{ duration: 0.3 }}
                        >
                          {item.emoji}
                        </motion.span>
                        <span className="text-slate-300 font-medium">{item.label}</span>
                      </div>
                      <span className="text-white font-semibold group-hover:text-indigo-400 transition-colors">
                        {item.value}
                      </span>
                    </motion.div>
                  ))}
                </div>
                
                {/* Action rapide */}
                <motion.div 
                  className="mt-6 pt-4 border-t border-slate-700/50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.4 }}
                >
                  <motion.button
                    onClick={() => window.open("https://wa.me/50948812652", "_blank")}
                    className="w-full group flex items-center justify-center gap-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white px-6 py-4 rounded-2xl transition-all duration-300 font-semibold shadow-lg hover:shadow-green-500/25"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <motion.div
                      animate={{ rotate: [0, 15, -15, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <MessageSquare className="h-5 w-5" />
                    </motion.div>
                    💬 Poser une question
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </motion.div>
                  </motion.button>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>
        
        {/* Footer décoratif */}
        <motion.div 
          className="text-center mt-8 pb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <p className="text-slate-400 text-sm">
            ✨ Fait avec ❤️ pour ton expérience d'expédition 🚀
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

const getStatusColor = (statut: string) => {
  switch (statut) {
    case "En attente⏳": return "text-orange-400 bg-orange-500/20 border border-orange-500/40 shadow-lg shadow-orange-500/25";
    case "Recu📦": return "text-blue-400 bg-blue-500/20 border border-blue-500/40 shadow-lg shadow-blue-500/25";
    case "En Transit✈️": return "text-yellow-400 bg-yellow-500/20 border border-yellow-500/40 shadow-lg shadow-yellow-500/25";
    case "Disponible🟢": return "text-green-400 bg-green-500/20 border border-green-500/40 shadow-lg shadow-green-500/25";
    case "Livré✅": return "text-emerald-400 bg-emerald-500/20 border border-emerald-500/40 shadow-lg shadow-emerald-500/25";
    default: return "text-slate-400 bg-slate-500/20 border border-slate-500/40";
  }
};

export default ShipmentView;