import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getAllShipments, deleteShipmentById } from "@/utils/shipmentQueries";
import { 
  Package, MapPin, Barcode, User, Mail, Calendar, Clock, Search, 
  Loader2, Trash2,  Filter, Eye, Sparkles, 
  CheckCircle, XCircle, PackageX, ArrowUpDown
} from "lucide-react";
import { Shipment, StatusDates } from "@/types/shipment";

const statusColors: Record<string, { bg: string; badge: string; glow: string }> = {
  "Recu📦": { bg: "bg-blue-500/10", badge: "bg-blue-500", glow: "shadow-blue-500/20" },
  "En Transit✈️": { bg: "bg-yellow-500/10", badge: "bg-yellow-500", glow: "shadow-yellow-500/20" },
  "Disponible🟢": { bg: "bg-green-500/10", badge: "bg-green-500", glow: "shadow-green-500/20" },
  "Livré✅": { bg: "bg-gray-500/10", badge: "bg-gray-500", glow: "shadow-gray-500/20" },
};

// Fonction pour récupérer la date de réception
const getReceptionDate = (statusDates: StatusDates[]): string => {
  return statusDates?.length > 0 ? statusDates[0].date : "Non disponible";
};

const AllShipments = () => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [shipmentToDelete, setShipmentToDelete] = useState<Shipment | null>(null);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Clear messages after 3 seconds
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    if (errorMessage || successMessage) {
      timeoutId = setTimeout(() => {
        setErrorMessage(null);
        setSuccessMessage(null);
      }, 3000);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [errorMessage, successMessage]);

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        setIsLoading(true);
        const data = await getAllShipments();

        const formattedData: Shipment[] = data.map((item) => ({
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
          statusDates: item.statusDates as StatusDates[] || null,
          phone: item.phone || "Non disponible",
        }));

        setShipments(formattedData);
      } catch (err) {
        console.error("Erreur lors du chargement des colis", err);
        setErrorMessage("Impossible de charger les colis. Veuillez réessayer.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchShipments();
  }, []);

  // Mise à jour de la logique de filtrage
  const filteredShipments = shipments.filter(
    (shipment) =>
      (shipment.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shipment.emailAdress.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shipment.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterStatus ? shipment.status === filterStatus : true)
  );

  // Fonction pour gérer la suppression
  const handleDelete = async (id: number) => {
    try {
      setIsDeleting(id);
      await deleteShipmentById(id);
      
      // Optimistic update
      const updatedShipments = shipments.filter((shipment) => shipment.id !== id);
      setShipments(updatedShipments);
      
      // Notification de succès
      setSuccessMessage("Le colis a été supprimé avec succès.");
      
      setShipmentToDelete(null);
    } catch (err) {
      console.error("Erreur lors de la suppression", err);
      
      // Notification d'erreur
      setErrorMessage("Impossible de supprimer le colis. Veuillez réessayer.");
    } finally {
      setIsDeleting(null);
    }
  };

  // Loader générique
  const renderLoader = () => (
    <motion.div 
      className="flex flex-col justify-center items-center h-96 space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Package className="h-12 w-12 text-blue-400" />
        </motion.div>
        <motion.div
          className="absolute inset-0 border-2 border-blue-400/30 rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
      <p className="text-gray-400 text-lg">Chargement des colis...</p>
    </motion.div>
  );

  // Aucun résultat
  const renderNoResults = () => (
    <motion.div 
      className="text-center py-16 bg-gray-900/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        animate={{ 
          y: [0, -10, 0],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          repeatDelay: 1
        }}
      >
        <PackageX className="h-16 w-16 mx-auto text-gray-500 mb-4" />
      </motion.div>
      <p className="text-gray-300 text-xl mb-2">🔍 Aucun colis trouvé</p>
      <p className="text-gray-500 text-sm">Essayez de modifier votre recherche ou filtre</p>
    </motion.div>
  );

  // Rendu des notifications
  const renderNotification = () => {
    if (errorMessage) {
      return (
        <AnimatePresence>
          <motion.div 
            className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50"
            initial={{ opacity: 0, y: -50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="bg-red-900/90 backdrop-blur-sm border border-red-500/50 text-red-100 px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3">
              <XCircle className="h-6 w-6 text-red-400" />
              <span className="font-medium">{errorMessage}</span>
            </div>
          </motion.div>
        </AnimatePresence>
      );
    }

    if (successMessage) {
      return (
        <AnimatePresence>
          <motion.div 
            className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50"
            initial={{ opacity: 0, y: -50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="bg-green-900/90 backdrop-blur-sm border border-green-500/50 text-green-100 px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-green-400" />
              <span className="font-medium">{successMessage}</span>
            </div>
          </motion.div>
        </AnimatePresence>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4 py-8">
      {/* Notifications */}
      {renderNotification()}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <motion.div 
          className="flex items-center gap-4 mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
            <Eye className="w-8 h-8 text-blue-400" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              📦 Tous les Colis
            </h1>
            <p className="text-gray-400">
              Gérez et visualisez tous vos envois en un seul endroit ✨
            </p>
          </div>
        </motion.div>

        {/* Search and Filter Bar */}
        <motion.div 
          className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <motion.input
                type="text"
                className="block w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                placeholder="🔍 Rechercher par nom, email ou numéro de suivi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={isLoading}
                whileFocus={{ scale: 1.01 }}
              />
            </div>

            {/* Filter Select */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <motion.select
                className="block w-full pl-12 pr-8 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 cursor-pointer"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                disabled={isLoading}
                whileFocus={{ scale: 1.01 }}
              >
                <option value="">📋 Tous les statuts</option>
                <option value="Recu📦">📦 Reçu</option>
                <option value="En Transit✈️">✈️ En Transit</option>
                <option value="Disponible🟢">🟢 Disponible</option>
                <option value="Livré✅">✅ Livré</option>
              </motion.select>
            </div>
          </div>

          {/* Results Counter */}
          <motion.div 
            className="mt-4 flex items-center gap-2 text-sm text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <ArrowUpDown className="w-4 h-4" />
            <span>
              {isLoading 
                ? "Chargement..." 
                : `${filteredShipments.length} colis trouvé${filteredShipments.length > 1 ? 's' : ''}`
              }
            </span>
          </motion.div>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            renderLoader()
          ) : filteredShipments.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {filteredShipments.map((shipment, index) => (
                <motion.div
                  key={shipment.id}
                  className={`bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 transition-all duration-300 hover:border-gray-600/50 relative overflow-hidden ${statusColors[shipment.status]?.glow} hover:shadow-lg`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                >
                  {/* Status Glow Effect */}
                  <div className={`absolute inset-0 ${statusColors[shipment.status]?.bg} opacity-30 pointer-events-none`} />
                  
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4 relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500/10 rounded-lg">
                        <User className="w-5 h-5 text-blue-400" />
                      </div>
                      <h2 className="text-xl font-bold text-white truncate">
                        {shipment.fullName}
                      </h2>
                    </div>
                    <motion.div
                      className={`text-white px-3 py-1 rounded-full text-xs font-semibold ${statusColors[shipment.status]?.badge}`}
                      whileHover={{ scale: 1.05 }}
                    >
                      {shipment.status}
                    </motion.div>
                  </div>

                  {/* User Info */}
                  <div className="space-y-3 mb-4 relative z-10">
                    <div className="flex items-center text-gray-300 text-sm">
                      <User className="h-4 w-4 text-blue-400 mr-3 flex-shrink-0" />
                      <span className="truncate">@{shipment.userName}</span>
                    </div>
                    <div className="flex items-center text-gray-300 text-sm">
                      <Mail className="h-4 w-4 text-green-400 mr-3 flex-shrink-0" />
                      <span className="truncate">{shipment.emailAdress}</span>
                    </div>
                  </div>

                  {/* Package Info */}
                  <div className="space-y-3 mb-4 relative z-10">
                    <div className="flex items-center text-gray-300 text-sm">
                      <Barcode className="h-4 w-4 text-purple-400 mr-3 flex-shrink-0" />
                      <span className="font-mono bg-gray-800/50 px-2 py-1 rounded text-xs">
                        {shipment.trackingNumber}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-300 text-sm">
                      <MapPin className="h-4 w-4 text-red-400 mr-3 flex-shrink-0" />
                      <span className="truncate">{shipment.destination}</span>
                    </div>
                    <div className="flex items-center text-gray-300 text-sm">
                      <Calendar className="h-4 w-4 text-yellow-400 mr-3 flex-shrink-0" />
                      <span className="truncate">Reçu: {getReceptionDate(shipment.statusDates)}</span>
                    </div>
                    <div className="flex items-center text-gray-300 text-sm">
                      <Clock className="h-4 w-4 text-orange-400 mr-3 flex-shrink-0" />
                      <span className="truncate">Livraison: {shipment.estimatedDelivery}</span>
                    </div>
                    <div className="flex items-center text-gray-300 text-sm">
                      <Package className="h-4 w-4 text-indigo-400 mr-3 flex-shrink-0" />
                      <span>{shipment.weight} lbs</span>
                    </div>
                  </div>

                  {/* Status History */}
                  <div className="mb-4 relative z-10">
                    <h3 className="text-sm font-semibold text-gray-200 mb-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-yellow-400" />
                      Historique des statuts
                    </h3>
                    <div className="bg-gray-800/30 rounded-xl p-3 max-h-32 overflow-y-auto custom-scrollbar">
                      <div className="space-y-2">
                        {shipment.statusDates?.map((entry, index) => (
                          <motion.div 
                            key={index} 
                            className="flex justify-between items-start text-xs text-gray-400 border-b border-gray-700/30 pb-2 last:border-b-0"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <div className="flex-1 pr-2">
                              <p className="text-gray-300 font-medium">{entry.status}</p>
                              <p className="text-gray-500 text-xs">{entry.date}</p>
                            </div>
                            <span className="italic text-gray-500 text-xs text-right">
                              {entry.location}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Delete Button */}
                  <motion.button
                    onClick={() => setShipmentToDelete(shipment)}
                    disabled={isDeleting === shipment.id}
                    className="flex items-center justify-center bg-gradient-to-r from-red-600 to-red-500 text-white px-4 py-3 rounded-xl hover:from-red-500 hover:to-red-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed w-full font-semibold relative z-10"
                    whileHover={!isDeleting ? { scale: 1.02 } : {}}
                    whileTap={!isDeleting ? { scale: 0.98 } : {}}
                  >
                    {isDeleting === shipment.id ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Suppression...
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4 mr-2" />
                        🗑️ Supprimer
                      </>
                    )}
                  </motion.button>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            renderNoResults()
          )}
        </AnimatePresence>
      </motion.div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {shipmentToDelete && (
          <motion.div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShipmentToDelete(null)}
          >
            <motion.div 
              className="bg-gray-900 border border-gray-700/50 p-8 rounded-2xl shadow-2xl max-w-md w-full relative"
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center mb-6">
                <div className="p-3 bg-red-500/10 rounded-xl mr-4">
                  <Trash2 className="h-8 w-8 text-red-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">
                  🗑️ Confirmer la suppression
                </h2>
              </div>
              
              <p className="mb-6 text-gray-300">
                Êtes-vous sûr de vouloir supprimer ce colis ? Cette action est irréversible.
              </p>
              
              <div className="bg-gray-800/50 border border-gray-700/50 p-4 rounded-xl mb-6 space-y-2">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">ID :</p>
                    <p className="text-white font-semibold">{shipmentToDelete.id}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Statut :</p>
                    <p className="text-white font-semibold">{shipmentToDelete.status}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-400">Nom :</p>
                    <p className="text-white font-semibold">{shipmentToDelete.fullName}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-400">Numéro de suivi :</p>
                    <p className="text-white font-semibold font-mono text-xs bg-gray-700/50 px-2 py-1 rounded">
                      {shipmentToDelete.trackingNumber}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-400">Destination :</p>
                    <p className="text-white font-semibold">{shipmentToDelete.destination}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-4">
                <motion.button
                  onClick={() => setShipmentToDelete(null)}
                  disabled={isDeleting === shipmentToDelete.id}
                  className="bg-gray-700 text-gray-300 px-6 py-3 rounded-xl hover:bg-gray-600 transition-all duration-200 disabled:opacity-50 font-semibold"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Annuler
                </motion.button>
                <motion.button
                  onClick={() => handleDelete(shipmentToDelete.id)}
                  disabled={isDeleting === shipmentToDelete.id}
                  className="flex items-center bg-gradient-to-r from-red-600 to-red-500 text-white px-6 py-3 rounded-xl hover:from-red-500 hover:to-red-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                  whileHover={!isDeleting ? { scale: 1.02 } : {}}
                  whileTap={!isDeleting ? { scale: 0.98 } : {}}
                >
                  {isDeleting === shipmentToDelete.id ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Suppression...
                    </>
                  ) : (
                    "Confirmer"
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(55, 65, 81, 0.3);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(107, 114, 128, 0.5);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(107, 114, 128, 0.7);
        }
      `}</style>
    </div>
  );
};

export default AllShipments;