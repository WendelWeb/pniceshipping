import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Package,
  User,
  Mail,
  Weight,
  Plane,
  Loader2,
  CheckCircle,
  Rocket,
  MapPin,
  ArrowUp,
} from "lucide-react";
import {
  getAllShipments,
  updateShipmentStatus,
} from "../utils/shipmentQueries";
import { sendTransitEmail } from "../services/emailServices";
import { Shipment } from "@/types/shipment";

const MarkShipmentAsTransit = () => {
  // Log pour utiliser sendTransitEmail (disponible pour usage futur)
  console.log("Email service available:", typeof sendTransitEmail);

  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingShipments, setUpdatingShipments] = useState<
    Record<number, boolean>
  >({});

  useEffect(() => {
    fetchReceivedShipments();
  }, []);

  const fetchReceivedShipments = async () => {
    try {
      setLoading(true);
      const results = await getAllShipments();
      const receivedShipments = results
        .filter((shipment) => shipment.status === "Recu📦")
        .map((shipment) => ({
          ...shipment,
          statusDates: Array.isArray(shipment.statusDates)
            ? shipment.statusDates
            : [],
        })) as Shipment[];

      const initialUpdatingState = receivedShipments.reduce<
        Record<number, boolean>
      >((acc, shipment) => {
        acc[shipment.id] = false;
        return acc;
      }, {});
      setUpdatingShipments(initialUpdatingState);
      setShipments(receivedShipments);
    } catch (error) {
      console.error("Erreur lors de la récupération des colis reçus:", error);
    } finally {
      setLoading(false);
    }
  };

  const transitShipment = async (id: number) => {
    try {
      setUpdatingShipments((prev) => ({ ...prev, [id]: true }));
      const shipment = shipments.find((s) => s.id === id);
      if (!shipment) {
        console.warn(`Colis avec id ${id} non trouvé`);
        return;
      }
      await updateShipmentStatus(
        shipment.id,
        "En Transit✈️",
        "En route vers Haiti"
      );

      // 🚫 ENVOI D'EMAIL TEMPORAIREMENT DÉSACTIVÉ
      // Tentative d'envoi d'email (n'arrête pas le processus en cas d'échec)
      // try {
      //   await sendTransitEmail(`${shipment.fullName}`, `${shipment.emailAdress}`, `${shipment.trackingNumber}`);
      //   console.log("✅ Email de transit envoyé avec succès");
      // } catch (emailError: any) {
      //   console.error("⚠️ Erreur lors de l'envoi de l'email (le colis est passé en transit quand même) :", emailError.message);
      // }
      console.log("📧 Email désactivé temporairement - Migration en cours");
      setShipments((prev) => prev.filter((s) => s.id !== id));
    } catch (error) {
      console.error("Erreur lors du passage en transit:", error);
    } finally {
      setUpdatingShipments((prev) => ({ ...prev, [id]: false }));
    }
  };

  const filteredShipments = shipments.filter(
    (shipment) =>
      shipment.id.toString().includes(searchTerm.toLowerCase()) ||
      shipment.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.emailAdress.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      x: 100,
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <motion.div
        className="max-w-7xl mx-auto p-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.header className="mb-8" variants={itemVariants}>
          <div className="flex items-center gap-4 mb-4">
            <motion.div
              whileHover={{
                rotate: [0, 10, -10, 0],
                scale: 1.1,
              }}
              transition={{ duration: 0.5 }}
              className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow-lg shadow-orange-500/25"
            >
              <Plane className="h-8 w-8 text-white" />
            </motion.div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                Passage en Transit ✈️
              </h1>
              <p className="text-slate-400 text-lg mt-1">
                Expédiez vos colis reçus vers leur destination finale 🚀
              </p>
            </div>
          </div>
        </motion.header>

        {/* Search Bar & Stats */}
        <motion.div
          className="mb-8 flex flex-col md:flex-row items-center justify-between gap-6"
          variants={itemVariants}
        >
          <motion.div
            className="relative w-full md:w-96"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher par ID, nom ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 outline-none transition-all duration-300 hover:bg-slate-800/70"
            />
          </motion.div>

          <motion.div
            className="flex items-center gap-3 px-6 py-3 bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700/30"
            whileHover={{
              scale: 1.05,
              backgroundColor: "rgba(51, 65, 85, 0.5)",
            }}
            transition={{ duration: 0.2 }}
          >
            <CheckCircle className="h-5 w-5 text-emerald-400" />
            <span className="text-slate-300 font-medium">
              {filteredShipments.length} colis reçus
            </span>
          </motion.div>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              className="flex justify-center items-center h-64"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                animate={{
                  rotate: 360,
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  rotate: { duration: 1, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity },
                }}
                className="p-4 bg-gradient-to-r from-orange-500 to-red-600 rounded-full"
              >
                <Loader2 className="h-8 w-8 text-white" />
              </motion.div>
            </motion.div>
          ) : filteredShipments.length === 0 ? (
            <motion.div
              className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/30 p-12 text-center"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div
                whileHover={{
                  scale: 1.1,
                  rotate: [0, -10, 10, 0],
                  y: [-5, 0, -5, 0],
                }}
                transition={{ duration: 0.6 }}
                className="mx-auto mb-6 p-4 bg-slate-700/50 rounded-full w-fit"
              >
                <Package className="h-12 w-12 text-slate-400" />
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-3">
                {searchTerm
                  ? "Aucun résultat trouvé 🔍"
                  : "Tout est parti ! ✈️"}
              </h3>
              <p className="text-slate-400 text-lg">
                {searchTerm
                  ? "Essayez avec d'autres termes de recherche."
                  : "Aucun colis reçu à passer en transit pour le moment."}
              </p>
            </motion.div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <AnimatePresence>
                {filteredShipments.map((shipment, index) => (
                  <motion.div
                    key={shipment.id}
                    variants={cardVariants}
                    layout
                    exit="exit"
                    whileHover={{
                      y: -8,
                      scale: 1.02,
                      boxShadow:
                        "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(249, 115, 22, 0.1)",
                    }}
                    className="bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-slate-700/30 overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300"
                  >
                    {/* Card Header */}
                    <div className="bg-gradient-to-r from-emerald-500 to-green-600 px-6 py-4">
                      <div className="flex justify-between items-center">
                        <motion.div
                          className="flex items-center gap-2"
                          whileHover={{ scale: 1.05 }}
                        >
                          <Package className="h-5 w-5 text-white" />
                          <h3 className="font-bold text-white">
                            #{shipment.trackingNumber}
                          </h3>
                        </motion.div>
                        <motion.span
                          className="bg-emerald-100/90 text-emerald-800 text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1"
                          whileHover={{ scale: 1.1 }}
                          animate={{
                            boxShadow: [
                              "0 0 0 0 rgba(16, 185, 129, 0.4)",
                              "0 0 0 8px rgba(16, 185, 129, 0)",
                              "0 0 0 0 rgba(16, 185, 129, 0)",
                            ],
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <CheckCircle className="h-3 w-3" />
                          Reçu
                        </motion.span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6">
                      <div className="space-y-4 mb-6">
                        <motion.div
                          className="flex items-center gap-3"
                          whileHover={{ x: 4 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="p-2 bg-blue-500/20 rounded-lg">
                            <User className="h-4 w-4 text-blue-400" />
                          </div>
                          <p className="text-slate-200 font-medium">
                            {shipment.userName}
                          </p>
                        </motion.div>

                        <motion.div
                          className="flex items-center gap-3"
                          whileHover={{ x: 4 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="p-2 bg-purple-500/20 rounded-lg">
                            <Mail className="h-4 w-4 text-purple-400" />
                          </div>
                          <p className="text-slate-300 text-sm truncate">
                            {shipment.emailAdress}
                          </p>
                        </motion.div>

                        <motion.div
                          className="flex items-center gap-3"
                          whileHover={{ x: 4 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="p-2 bg-amber-500/20 rounded-lg">
                            <Weight className="h-4 w-4 text-amber-400" />
                          </div>
                          <p className="text-slate-200 font-medium">
                            {shipment.weight} lbs
                          </p>
                        </motion.div>

                        {/* Transit Indicator */}
                        <motion.div
                          className="flex items-center gap-3 pt-2 border-t border-slate-700/30"
                          whileHover={{ x: 4 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="p-2 bg-orange-500/20 rounded-lg">
                            <MapPin className="h-4 w-4 text-orange-400" />
                          </div>
                          <p className="text-slate-400 text-sm">
                            Prêt pour expédition
                          </p>
                        </motion.div>
                      </div>

                      {/* Action Button */}
                      <motion.button
                        onClick={() => transitShipment(shipment.id)}
                        disabled={updatingShipments[shipment.id]}
                        className={`w-full px-4 py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-3 ${
                          !updatingShipments[shipment.id]
                            ? "bg-gradient-to-r from-orange-500 to-red-600 text-white hover:from-orange-600 hover:to-red-700 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40"
                            : "bg-slate-700/50 text-slate-500 cursor-not-allowed"
                        }`}
                        whileHover={
                          !updatingShipments[shipment.id]
                            ? {
                                scale: 1.02,
                                y: -2,
                                boxShadow:
                                  "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                              }
                            : {}
                        }
                        whileTap={
                          !updatingShipments[shipment.id] ? { scale: 0.98 } : {}
                        }
                      >
                        {updatingShipments[shipment.id] ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                            >
                              <Loader2 className="h-5 w-5" />
                            </motion.div>
                            <span>Expédition en cours...</span>
                          </>
                        ) : (
                          <>
                            <motion.div
                              whileHover={{
                                y: [-2, 0, -2],
                                rotate: [0, 15, 0],
                              }}
                              transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "easeInOut",
                              }}
                            >
                              <Rocket className="h-5 w-5" />
                            </motion.div>
                            <span>Passer en Transit ✈️</span>
                            <ArrowUp className="h-4 w-4 opacity-70" />
                          </>
                        )}
                      </motion.button>

                      {/* Progress Indicator */}
                      <motion.div
                        className="mt-4 flex items-center justify-center gap-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.1 + 0.5 }}
                      >
                        <div className="flex items-center gap-1">
                          <motion.div
                            className="w-2 h-2 bg-emerald-500 rounded-full"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              delay: 0,
                            }}
                          />
                          <div className="w-8 h-0.5 bg-slate-600 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-gradient-to-r from-emerald-500 to-orange-500"
                              initial={{ width: "0%" }}
                              animate={{ width: "100%" }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                repeatType: "reverse",
                              }}
                            />
                          </div>
                          <motion.div
                            className="w-2 h-2 bg-orange-500 rounded-full"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              delay: 0.5,
                            }}
                          />
                        </div>
                        <span className="text-xs text-slate-500 ml-2">
                          Entrepôt → Transit
                        </span>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default MarkShipmentAsTransit;
