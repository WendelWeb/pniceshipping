import { Shipment, StatusDates } from "@/types/shipment";
import { findByOwnerId } from "@/utils/shipmentQueries";
import { useEffect, useState } from "react";
import AddShipmentByUser from "./AddShipmentByUser.tsx";
import { useUser } from "@clerk/clerk-react";
import LoginPrompt from "./LoginPrompts.tsx";
import { useSettings } from "@/contexts/SettingsContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Package, 
  Plane, 
  CheckCircle, 
  Truck, 
  Clock, 
  Eye, 
  X, 
  MapPin, 
  User, 
  Calendar,
  Weight,
  DollarSign,
  Filter,
  ArrowRight,
  TrendingUp,
  Sparkles
} from "lucide-react";

interface Colis {
  tracking: string;
  poids: number;
  frais: number;
  isFixedRate: boolean;
  fixedRateCategory?: string;
  destination: string;
  statut: string;
  dateCreation: string;
  dateEstimee: string;
  expediteur: string;
  description: string;
  historique: { date: string; statut: string; lieu: string }[];
  id?: string;
}

const Dashboard = () => {
  const { user, isSignedIn } = useUser();
  const { shippingRates, getRate, getSpecialItemPrice } = useSettings();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("tous");
  const [selectedColis, setSelectedColis] = useState<Colis | null>(null);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [asToRefreshShipments, setAsToRefreshShipments] = useState<boolean>(false);

  // Récupérer les colis
  useEffect(() => {
    if (!isSignedIn || !user?.id) return;
    setAsToRefreshShipments(false);
    const fetchUserShipments = async () => {
      try {
        const response = await findByOwnerId(user.id);
        const formattedShipments: Shipment[] = response.map((item) => ({
          id: item.id,
          ownerId: item.ownerId,
          fullName: item.fullName,
          userName: item.userName,
          category: item.category,
          emailAdress: item.emailAdress,
          trackingNumber: item.trackingNumber,
          weight: item.weight,
          status: item.status,
          destination: item.destination,
          estimatedDelivery: item.estimatedDelivery,
          statusDates: (item.statusDates as StatusDates[]) || null,
          phone: item.phone || "Non disponible",
        }));
        setShipments(formattedShipments);
      } catch (err) {
        console.error("Erreur lors de la récupération des colis:", err);
        alert("Erreur lors du chargement des colis. Rafraîchissez votre page.");
      }
    };
    fetchUserShipments();
  }, [user, isSignedIn, asToRefreshShipments]);

  const colis = shipments.map((shipment: Shipment) => {
    const dateCreation =
      shipment.statusDates?.find((statusDate) => statusDate.status === "Recu📦")?.date || "Non spécifiée";
    const poids = shipment.weight ? parseFloat(shipment.weight) : 0;
    let frais = 0;
    let isFixedRate = false;
    let fixedRateCategory: string | undefined;

    // Try to get special item price first (dynamique)
    const specialPrice = getSpecialItemPrice(shipment.category);

    if (specialPrice !== null) {
      // This is a special item with fixed price
      frais = specialPrice + shippingRates.serviceFee;
      isFixedRate = true;
      fixedRateCategory = shipment.category;
    } else {
      // Regular weight-based calculation (dynamique)
      const rate = getRate(shipment.destination);
      frais = poids * rate + shippingRates.serviceFee;
      isFixedRate = false;
      } else {
        frais = poids * rate + SERVICE_FEE;
        isFixedRate = false;
      }
    } else {
      frais = poids * rate + SERVICE_FEE;
      isFixedRate = false;
    }

    return {
      tracking: shipment.trackingNumber ?? "Inconnu",
      poids,
      frais,
      isFixedRate,
      fixedRateCategory,
      destination: shipment.destination ?? "Non spécifiée",
      statut: shipment.status ?? "Statut inconnu",
      dateCreation,
      dateEstimee: shipment.estimatedDelivery ?? "Non estimée",
      expediteur: shipment.userName ?? "Inconnu",
      description: shipment.category ?? "Non spécifiée",
      historique: Array.isArray(shipment.statusDates)
        ? shipment.statusDates.map((stage: StatusDates) => ({
            statut: stage.status ?? "Inconnu",
            date: stage.date ?? "Non spécifiée",
            lieu: stage.location ?? "Non spécifié",
          }))
        : [],
      id: shipment.id.toString(),
    };
  });

  const getFilteredColis = () => {
    switch (activeTab) {
      case "recu":
        return colis.filter((c) => c.statut === "Recu📦");
      case "transit":
        return colis.filter((c) => c.statut === "En Transit✈️");
      case "disponible":
        return colis.filter((c) => c.statut === "Disponible🟢");
      case "livré":
        return colis.filter((c) => c.statut === "Livré✅");
      default:
        return colis;
    }
  };

  const stats = {
    total: colis.length,
    recu: colis.filter((c) => c.statut === "Recu📦").length,
    transit: colis.filter((c) => c.statut === "En Transit✈️").length,
    disponible: colis.filter((c) => c.statut === "Disponible🟢").length,
    livré: colis.filter((c) => c.statut === "Livré✅").length,
  };

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case "En attente⏳":
        return "text-amber-400 bg-amber-500/10 border-amber-500/20";
      case "Recu📦":
        return "text-blue-400 bg-blue-500/10 border-blue-500/20";
      case "En Transit✈️":
        return "text-purple-400 bg-purple-500/10 border-purple-500/20";
      case "Disponible🟢":
        return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
      case "Livré✅":
        return "text-green-400 bg-green-500/10 border-green-500/20";
      default:
        return "text-gray-400 bg-gray-500/10 border-gray-500/20";
    }
  };

  const getStatusIcon = (statut: string) => {
    switch (statut) {
      case "En attente⏳":
        return <Clock className="h-4 w-4" />;
      case "Recu📦":
        return <Package className="h-4 w-4" />;
      case "En Transit✈️":
        return <Plane className="h-4 w-4" />;
      case "Disponible🟢":
        return <Truck className="h-4 w-4" />;
      case "Livré✅":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const handleColisClick = (colis: Colis) => {
    navigate(`/shipment/${colis.id}`);
  };

  const closeColisDetails = () => {
    setSelectedColis(null);
  };

  const getFraisExplanation = (colis: Colis) => {
    if (colis.isFixedRate) {
      const baseFrais = colis.frais - SERVICE_FEE;
      return (
        <div className="space-y-1">
          <p className="font-semibold text-sm text-white">
            ${colis.frais.toFixed(2)} <span className="text-emerald-400">✨</span>
          </p>
          <p className="text-xs text-gray-400 leading-relaxed">
            Tarif fixe ${baseFrais.toFixed(2)} + ${SERVICE_FEE.toFixed(2)} frais de service 🚀
          </p>
        </div>
      );
    }
    return (
      <div className="space-y-1">
        <p className="font-semibold text-sm text-white">${colis.frais.toFixed(2)}</p>
        <p className="text-xs text-gray-400 leading-relaxed">
          ${getShippingRate(colis.destination).toFixed(2)}/lbs × {colis.poids}lbs + ${SERVICE_FEE.toFixed(2)} service 📊
        </p>
      </div>
    );
  };

  if (!isSignedIn) {
    return <LoginPrompt />;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <motion.div 
        className="flex flex-col min-h-screen"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <AddShipmentByUser setRefreshShipments={setAsToRefreshShipments} />
        
        <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AnimatePresence mode="wait">
            {!selectedColis ? (
              <motion.div
                key="dashboard"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={containerVariants}
                className="space-y-8"
              >
                {/* Header */}
                <motion.div variants={itemVariants} className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                      <Package className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-bold text-white">
                        Mes Colis <Sparkles className="inline h-6 w-6 text-yellow-400 ml-2" />
                      </h1>
                      <p className="text-gray-400 mt-1">Gérez vos expéditions en temps réel 🚀</p>
                    </div>
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="hidden sm:flex items-center space-x-2 text-sm text-gray-400"
                  >
                    <TrendingUp className="h-4 w-4" />
                    <span>{stats.total} colis actifs</span>
                  </motion.div>
                </motion.div>

                {/* Stats Cards */}
                <motion.div 
                  variants={itemVariants}
                  className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6"
                >
                  {[
                    { 
                      label: 'Total', 
                      value: stats.total, 
                      tab: 'tous', 
                      gradient: 'from-blue-500 to-cyan-500',
                      icon: Package,
                      emoji: '📦'
                    },
                    { 
                      label: 'Reçus', 
                      value: stats.recu, 
                      tab: 'recu', 
                      gradient: 'from-indigo-500 to-blue-500',
                      icon: Package,
                      emoji: '📥'
                    },
                    { 
                      label: 'En Transit', 
                      value: stats.transit, 
                      tab: 'transit', 
                      gradient: 'from-purple-500 to-pink-500',
                      icon: Plane,
                      emoji: '✈️'
                    },
                    { 
                      label: 'Disponibles', 
                      value: stats.disponible, 
                      tab: 'disponible', 
                      gradient: 'from-emerald-500 to-teal-500',
                      icon: Truck,
                      emoji: '🚚'
                    },
                    { 
                      label: 'Livrés', 
                      value: stats.livré, 
                      tab: 'livré', 
                      gradient: 'from-green-500 to-emerald-500',
                      icon: CheckCircle,
                      emoji: '✅'
                    },
                  ].map((stat) => (
                    <motion.div
                      key={stat.tab}
                      variants={itemVariants}
                      whileHover={{ 
                        scale: 1.02,
                        y: -4,
                        transition: { duration: 0.2 }
                      }}
                      whileTap={{ scale: 0.98 }}
                      className={`relative group cursor-pointer overflow-hidden
                        bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 
                        rounded-2xl p-4 sm:p-6 transition-all duration-300
                        ${activeTab === stat.tab ? 'ring-2 ring-blue-500/50 bg-gray-800/70' : 'hover:bg-gray-800/70'}
                      `}
                      onClick={() => setActiveTab(stat.tab)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{stat.emoji}</span>
                            <p className="text-xs sm:text-sm text-gray-400 font-medium">{stat.label}</p>
                          </div>
                          <motion.p 
                            className="text-2xl sm:text-3xl font-bold text-white"
                            key={stat.value}
                            initial={{ scale: 1.2, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            {stat.value}
                          </motion.p>
                        </div>
                        <div className={`p-3 bg-gradient-to-br ${stat.gradient} rounded-xl shadow-lg opacity-80 group-hover:opacity-100 transition-opacity`}>
                          <stat.icon className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      
                      {/* Gradient overlay on hover */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl`} />
                    </motion.div>
                  ))}
                </motion.div>

                {/* Filter Tabs - Desktop */}
                <motion.div variants={itemVariants} className="hidden lg:block">
                  <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-2">
                    <nav className="flex space-x-2">
                      {[
                        { key: 'tous', label: 'Tous les colis', icon: Package },
                        { key: 'recu', label: 'Reçus', icon: Package },
                        { key: 'transit', label: 'En Transit', icon: Plane },
                        { key: 'disponible', label: 'Disponibles', icon: Truck },
                        { key: 'livré', label: 'Livrés', icon: CheckCircle }
                      ].map((tab) => (
                        <motion.button
                          key={tab.key}
                          onClick={() => setActiveTab(tab.key)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                            activeTab === tab.key
                              ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                              : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                          }`}
                        >
                          <tab.icon className="h-4 w-4" />
                          <span>{tab.label}</span>
                        </motion.button>
                      ))}
                    </nav>
                  </div>
                </motion.div>

                {/* Filter Select - Mobile */}
                <motion.div variants={itemVariants} className="lg:hidden">
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <select
                      value={activeTab}
                      onChange={(e) => setActiveTab(e.target.value)}
                      className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="tous">📦 Tous les colis</option>
                      <option value="recu">📥 Reçus</option>
                      <option value="transit">✈️ En Transit</option>
                      <option value="disponible">🚚 Disponibles</option>
                      <option value="livré">✅ Livrés</option>
                    </select>
                  </div>
                </motion.div>

                {/* Table - Desktop */}
                <motion.div variants={itemVariants} className="hidden lg:block">
                  <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full">
                        <thead className="bg-gray-800/50">
                          <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                              Tracking 🏷️
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                              Poids ⚖️
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                              Destination 🌍
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                              Statut 📊
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                              Frais 💰
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                              Actions ⚡
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700/50">
                          <AnimatePresence>
                            {getFilteredColis().map((colis, index) => (
                              <motion.tr
                                key={colis.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                whileHover={{ 
                                  backgroundColor: "rgba(55, 65, 81, 0.3)",
                                  transition: { duration: 0.2 }
                                }}
                                className="cursor-pointer transition-colors"
                                onClick={() => handleColisClick(colis)}
                              >
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center space-x-3">
                                    <Package className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm font-mono text-white">{colis.tracking}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center space-x-2">
                                    <Weight className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm text-gray-300">{colis.poids} lbs</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center space-x-2">
                                    <MapPin className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm text-gray-300">{colis.destination}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${getStatusColor(colis.statut)}`}
                                  >
                                    {getStatusIcon(colis.statut)}
                                    <span>{colis.statut}</span>
                                  </motion.div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  {getFraisExplanation(colis)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <motion.button
                                    whileHover={{ scale: 1.05, x: 2 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="inline-flex items-center space-x-2 px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg text-sm font-medium transition-colors"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleColisClick(colis);
                                    }}
                                  >
                                    <Eye className="h-4 w-4" />
                                    <span>Détails</span>
                                    <ArrowRight className="h-3 w-3" />
                                  </motion.button>
                                </td>
                              </motion.tr>
                            ))}
                          </AnimatePresence>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>

                {/* Cards - Mobile/Tablet */}
                <motion.div variants={itemVariants} className="lg:hidden space-y-4">
                  <AnimatePresence>
                    {getFilteredColis().map((colis, index) => (
                      <motion.div
                        key={colis.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden cursor-pointer group hover:border-gray-600/50 transition-all duration-300"
                        onClick={() => handleColisClick(colis)}
                      >
                        <div className="p-5">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center space-x-3">
                              <Package className="h-5 w-5 text-blue-400" />
                              <div>
                                <h3 className="font-mono text-lg font-semibold text-white">{colis.tracking}</h3>
                                <p className="text-sm text-gray-400">{colis.description}</p>
                              </div>
                            </div>
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(colis.statut)}`}
                            >
                              {getStatusIcon(colis.statut)}
                              <span>{colis.statut}</span>
                            </motion.div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="space-y-3">
                              <div className="flex items-center space-x-2">
                                <MapPin className="h-4 w-4 text-gray-400" />
                                <div>
                                  <p className="text-xs text-gray-500">Destination</p>
                                  <p className="text-sm font-medium text-white">{colis.destination}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Weight className="h-4 w-4 text-gray-400" />
                                <div>
                                  <p className="text-xs text-gray-500">Poids</p>
                                  <p className="text-sm font-medium text-white">{colis.poids} lbs</p>
                                </div>
                              </div>
                            </div>
                            <div className="space-y-3">
                              <div className="flex items-center space-x-2">
                                <User className="h-4 w-4 text-gray-400" />
                                <div>
                                  <p className="text-xs text-gray-500">Expéditeur</p>
                                  <p className="text-sm font-medium text-white">{colis.expediteur}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <DollarSign className="h-4 w-4 text-gray-400" />
                                <div>
                                  <p className="text-xs text-gray-500">Frais</p>
                                  {getFraisExplanation(colis)}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center pt-4 border-t border-gray-700/50">
                            <div className="flex items-center space-x-2 text-xs text-gray-400">
                              <Calendar className="h-3 w-3" />
                              <span>Créé le {colis.dateCreation}</span>
                            </div>
                            <motion.div
                              whileHover={{ x: 4 }}
                              className="flex items-center space-x-2 text-blue-400 text-sm font-medium group-hover:text-blue-300 transition-colors"
                            >
                              <span>Voir détails</span>
                              <ArrowRight className="h-4 w-4" />
                            </motion.div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            ) : (
              /* Modal de détails */
              <motion.div
                key="details"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden shadow-2xl"
              >
                {/* Header */}
                <div className="px-6 py-5 border-b border-gray-700/50 bg-gray-800/30">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                        <Package className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">
                          Colis {selectedColis.tracking} 📦
                        </h3>
                        <p className="text-gray-400">Détails complets de votre expédition</p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 rounded-xl hover:bg-gray-700/50 transition-colors text-gray-400 hover:text-white"
                      onClick={closeColisDetails}
                    >
                      <X className="h-5 w-5" />
                    </motion.button>
                  </div>
                </div>

                <div className="p-6 space-y-8">
                  {/* Informations principales */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-6"
                  >
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl">
                        <Sparkles className="h-5 w-5 text-white" />
                      </div>
                      <h4 className="text-lg font-semibold text-white">Informations du colis ✨</h4>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[
                        { 
                          label: "N° Tracking", 
                          value: selectedColis.tracking, 
                          icon: Package,
                          emoji: "🏷️"
                        },
                        { 
                          label: "Statut", 
                          value: selectedColis.statut, 
                          icon: getStatusIcon(selectedColis.statut).type,
                          emoji: "📊",
                          isStatus: true
                        },
                        { 
                          label: "Date de création", 
                          value: selectedColis.dateCreation, 
                          icon: Calendar,
                          emoji: "📅"
                        },
                        { 
                          label: "Date estimée", 
                          value: selectedColis.dateEstimee, 
                          icon: Calendar,
                          emoji: "⏰"
                        },
                        { 
                          label: "Destination", 
                          value: selectedColis.destination, 
                          icon: MapPin,
                          emoji: "🌍"
                        },
                        { 
                          label: "Expéditeur", 
                          value: selectedColis.expediteur, 
                          icon: User,
                          emoji: "👤"
                        },
                        { 
                          label: "Poids", 
                          value: `${selectedColis.poids} lbs`, 
                          icon: Weight,
                          emoji: "⚖️"
                        },
                        { 
                          label: "Description", 
                          value: selectedColis.description, 
                          icon: Package,
                          emoji: "📝",
                          fullWidth: true
                        },
                      ].map((item, index) => (
                        <motion.div
                          key={item.label}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 + index * 0.05 }}
                          className={`space-y-2 ${item.fullWidth ? 'sm:col-span-2 lg:col-span-3' : ''}`}
                        >
                          <div className="flex items-center space-x-2">
                            <span className="text-sm">{item.emoji}</span>
                            <item.icon className="h-4 w-4 text-gray-400" />
                            <p className="text-xs text-gray-400 font-medium">{item.label}</p>
                          </div>
                          {item.isStatus ? (
                            <motion.div
                              whileHover={{ scale: 1.02 }}
                              className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-semibold border ${getStatusColor(item.value)}`}
                            >
                              {getStatusIcon(item.value)}
                              <span>{item.value}</span>
                            </motion.div>
                          ) : (
                            <p className="text-sm font-semibold text-white">{item.value}</p>
                          )}
                        </motion.div>
                      ))}
                      
                      {/* Frais - Section spéciale */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-2"
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">💰</span>
                          <DollarSign className="h-4 w-4 text-gray-400" />
                          <p className="text-xs text-gray-400 font-medium">Frais</p>
                        </div>
                        <div className="bg-gray-900/50 rounded-xl p-3 border border-gray-600/30">
                          {getFraisExplanation(selectedColis)}
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* Historique de suivi */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-6"
                  >
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                        <Clock className="h-5 w-5 text-white" />
                      </div>
                      <h4 className="text-lg font-semibold text-white">Suivi du colis 🚚</h4>
                    </div>
                    
                    <div className="space-y-6">
                      {selectedColis.historique.map((evenement, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 + index * 0.1 }}
                          className="relative flex items-start group"
                        >
                          {/* Timeline dot */}
                          <div className="flex items-center h-full mr-4">
                            <motion.div 
                              whileHover={{ scale: 1.2 }}
                              className={`flex-shrink-0 h-4 w-4 rounded-full border-2 ${
                                index === 0 
                                  ? 'bg-gradient-to-r from-emerald-400 to-teal-400 border-emerald-400' 
                                  : 'bg-blue-500 border-blue-400'
                              } shadow-lg`}
                            >
                              {index === 0 && (
                                <motion.div
                                  animate={{ scale: [1, 1.2, 1] }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                  className="h-full w-full rounded-full bg-white opacity-30"
                                />
                              )}
                            </motion.div>
                            {index < selectedColis.historique.length - 1 && (
                              <div className="ml-1.5 w-0.5 bg-gradient-to-b from-gray-600 to-gray-700 h-full absolute top-6" />
                            )}
                          </div>
                          
                          {/* Event content */}
                          <motion.div
                            whileHover={{ x: 4, backgroundColor: "rgba(55, 65, 81, 0.3)" }}
                            className="flex-1 bg-gray-900/30 rounded-xl p-4 border border-gray-700/30 group-hover:border-gray-600/50 transition-all duration-300"
                          >
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <div className="flex items-center space-x-2">
                                  {getStatusIcon(evenement.statut)}
                                  <p className="text-sm font-semibold text-white">{evenement.statut}</p>
                                  {index === 0 && <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">Actuel ✨</span>}
                                </div>
                                <div className="flex items-center space-x-2 text-xs text-gray-400">
                                  <Calendar className="h-3 w-3" />
                                  <span>{evenement.date}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-xs text-gray-400">
                                  <MapPin className="h-3 w-3" />
                                  <span>{evenement.lieu}</span>
                                </div>
                              </div>
                              <motion.div
                                whileHover={{ rotate: 15 }}
                                className="text-2xl opacity-70"
                              >
                                {index === 0 ? '🔥' : '📍'}
                              </motion.div>
                            </div>
                          </motion.div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </motion.div>
    </div>
  );
};

export default Dashboard;