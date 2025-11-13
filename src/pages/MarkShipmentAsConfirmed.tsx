import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Package,
  User,
  Mail,
  Weight,
  Check,
  Edit3,
  X,
  Loader2,
  Clock,
  AlertCircle,
  Sparkles,
  Truck,
} from "lucide-react";
import {
  getAllShipments,
  updateShipmentStatus,
  updateShipmentWeight,
} from "../utils/shipmentQueries";
import { sendConfirmedEmail } from "../services/emailServices";
import { Shipment } from "@/types/shipment";

const MarkShipmentAsConfirmed = () => {
  // Log pour utiliser sendConfirmedEmail (disponible pour usage futur)
  console.log("Email service available:", typeof sendConfirmedEmail);

  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(
    null
  );
  const [weight, setWeight] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [weightErrors, setWeightErrors] = useState<Record<string, boolean>>({});
  const [updatingShipments, setUpdatingShipments] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    fetchPendingShipments();
  }, []);

  const fetchPendingShipments = async () => {
    try {
      setLoading(true);
      const results = await getAllShipments();
      const pendingShipments = results.filter(
        (shipment) => shipment.status === "En attente⏳"
      );

      const errors: Record<string, boolean> = {};
      const updatingState: Record<string, boolean> = {};
      pendingShipments.forEach((shipment) => {
        errors[shipment.trackingNumber] = !shipment.weight;
        updatingState[shipment.trackingNumber] = false;
      });
      setWeightErrors(errors);
      setUpdatingShipments(updatingState);
      setShipments(pendingShipments as Shipment[]);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des colis en attente:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const confirmShipment = async (trackingNumber: string) => {
    const shipment = shipments.find((s) => s.trackingNumber === trackingNumber);
    if (!shipment?.weight) {
      setWeightErrors((prev) => ({ ...prev, [trackingNumber]: true }));
      if (shipment) handleEditShipment(shipment);
      return;
    }

    try {
      setUpdatingShipments((prev) => ({ ...prev, [trackingNumber]: true }));
      await updateShipmentStatus(
        shipment.id,
        "Recu📦",
        "Confirmation de reception du colis dans notre entrepot a Pnice Miami, FL Warehouse"
      );
      setShipments((prev) =>
        prev.filter((s) => s.trackingNumber !== trackingNumber)
      );
      // 🚫 ENVOI D'EMAIL TEMPORAIREMENT DÉSACTIVÉ
      // Tentative d'envoi d'email (n'arrête pas le processus en cas d'échec)
      // try {
      //   await sendConfirmedEmail(
      //     `${shipment.fullName},`,
      //     `${shipment.emailAdress}`,
      //     `${shipment.trackingNumber}`
      //   );
      //   console.log("✅ Email de confirmation envoyé avec succès");
      // } catch (emailError: any) {
      //   console.error("⚠️ Erreur lors de l'envoi de l'email (le colis a été confirmé quand même) :", emailError.message);
      // }
      console.log("📧 Email désactivé temporairement - Migration en cours");
      if (selectedShipment?.trackingNumber === trackingNumber) {
        setSelectedShipment(null);
        setShowModal(false);
      }
    } catch (error) {
      console.error("Erreur lors de la confirmation du colis:", error);
    } finally {
      setUpdatingShipments((prev) => ({ ...prev, [trackingNumber]: false }));
    }
  };

  const handleEditShipment = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setWeight(shipment.weight || "");
    setShowModal(true);
  };

  const handleUpdateShipment = async () => {
    if (!selectedShipment) return;

    if (!weight || isNaN(parseFloat(weight)) || parseFloat(weight) <= 0) {
      setWeightErrors((prev) => ({
        ...prev,
        [selectedShipment.trackingNumber]: true,
      }));
      return;
    }

    try {
      setUpdatingShipments((prev) => ({
        ...prev,
        [selectedShipment.trackingNumber]: true,
      }));
      await updateShipmentWeight(
        selectedShipment.trackingNumber,
        parseFloat(weight)
      );

      const updatedShipment = {
        ...selectedShipment,
        weight: parseFloat(weight).toString(),
      };

      setShipments((prev) =>
        prev.map((s) =>
          s.trackingNumber === selectedShipment.trackingNumber
            ? updatedShipment
            : s
        )
      );
      setWeightErrors((prev) => ({
        ...prev,
        [selectedShipment.trackingNumber]: false,
      }));
      setShowModal(false);
      setSelectedShipment(null);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du poids du colis:", error);
    } finally {
      setUpdatingShipments((prev) => ({
        ...prev,
        [selectedShipment.trackingNumber]: false,
      }));
    }
  };

  const filteredShipments = shipments.filter(
    (shipment) =>
      shipment.trackingNumber
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
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
          <div className="flex items-center gap-3 mb-4">
            <motion.div
              whileHover={{ rotate: 180, scale: 1.1 }}
              transition={{ duration: 0.3 }}
              className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg shadow-blue-500/25"
            >
              <Package className="h-8 w-8 text-white" />
            </motion.div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                Confirmation des colis ✨
              </h1>
              <p className="text-slate-400 text-lg mt-1">
                Gérez et confirmez vos colis en attente avec style 🚀
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
              placeholder="Rechercher par numéro, nom ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all duration-300 hover:bg-slate-800/70"
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
            <Clock className="h-5 w-5 text-amber-400" />
            <span className="text-slate-300 font-medium">
              {filteredShipments.length} colis en attente
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
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
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
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
                className="mx-auto mb-6 p-4 bg-slate-700/50 rounded-full w-fit"
              >
                <Truck className="h-12 w-12 text-slate-400" />
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-3">
                {searchTerm
                  ? "Aucun résultat trouvé 🔍"
                  : "Tout est à jour ! 🎉"}
              </h3>
              <p className="text-slate-400 text-lg">
                {searchTerm
                  ? "Essayez avec d'autres termes de recherche."
                  : "Aucun colis en attente de confirmation pour le moment."}
              </p>
            </motion.div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredShipments.map((shipment) => (
                <motion.div
                  key={shipment.trackingNumber}
                  variants={cardVariants}
                  layout
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-slate-700/30 overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300"
                >
                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
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
                        className="bg-amber-400/90 text-amber-900 text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1"
                        whileHover={{ scale: 1.1 }}
                        animate={{
                          boxShadow: [
                            "0 0 0 0 rgba(245, 158, 11, 0.4)",
                            "0 0 0 8px rgba(245, 158, 11, 0)",
                            "0 0 0 0 rgba(245, 158, 11, 0)",
                          ],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Clock className="h-3 w-3" />
                        En attente
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
                        <div className="p-2 bg-emerald-500/20 rounded-lg">
                          <User className="h-4 w-4 text-emerald-400" />
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
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                          <Mail className="h-4 w-4 text-blue-400" />
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
                        <div
                          className={`p-2 rounded-lg ${
                            shipment.weight
                              ? "bg-green-500/20"
                              : "bg-red-500/20"
                          }`}
                        >
                          <Weight
                            className={`h-4 w-4 ${
                              shipment.weight
                                ? "text-green-400"
                                : "text-red-400"
                            }`}
                          />
                        </div>
                        {shipment.weight ? (
                          <p className="text-slate-200 font-medium">
                            {shipment.weight} lbs
                          </p>
                        ) : (
                          <motion.p
                            className="text-red-400 font-medium text-sm flex items-center gap-1"
                            animate={{ opacity: [0.7, 1, 0.7] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <AlertCircle className="h-4 w-4" />
                            Poids requis avant confirmation
                          </motion.p>
                        )}
                      </motion.div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <motion.button
                        onClick={() => confirmShipment(shipment.trackingNumber)}
                        disabled={
                          !shipment.weight ||
                          updatingShipments[shipment.trackingNumber]
                        }
                        className={`flex-1 px-4 py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                          shipment.weight &&
                          !updatingShipments[shipment.trackingNumber]
                            ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-600 hover:to-green-700 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40"
                            : "bg-slate-700/50 text-slate-500 cursor-not-allowed"
                        }`}
                        whileHover={
                          shipment.weight &&
                          !updatingShipments[shipment.trackingNumber]
                            ? { scale: 1.05, y: -2 }
                            : {}
                        }
                        whileTap={
                          shipment.weight &&
                          !updatingShipments[shipment.trackingNumber]
                            ? { scale: 0.98 }
                            : {}
                        }
                      >
                        {updatingShipments[shipment.trackingNumber] ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                          >
                            <Loader2 className="h-4 w-4" />
                          </motion.div>
                        ) : (
                          <Check className="h-4 w-4" />
                        )}
                        Confirmer ✅
                      </motion.button>

                      <motion.button
                        onClick={() => handleEditShipment(shipment)}
                        disabled={updatingShipments[shipment.trackingNumber]}
                        className={`flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-3 rounded-xl font-bold hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 ${
                          !shipment.weight
                            ? "animate-pulse ring-2 ring-blue-400/50"
                            : ""
                        } ${
                          updatingShipments[shipment.trackingNumber]
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        whileHover={
                          !updatingShipments[shipment.trackingNumber]
                            ? { scale: 1.05, y: -2 }
                            : {}
                        }
                        whileTap={
                          !updatingShipments[shipment.trackingNumber]
                            ? { scale: 0.98 }
                            : {}
                        }
                      >
                        <Edit3 className="h-4 w-4" />
                        {!shipment.weight
                          ? "Ajouter poids ⚡"
                          : "Modifier poids ✏️"}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() =>
                !updatingShipments[selectedShipment!.trackingNumber] &&
                setShowModal(false)
              }
            >
              <motion.div
                className="bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full border border-slate-700/50"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                      <motion.div
                        whileHover={{ rotate: 180 }}
                        transition={{ duration: 0.3 }}
                        className="p-2 bg-blue-500/20 rounded-lg"
                      >
                        <Weight className="h-5 w-5 text-blue-400" />
                      </motion.div>
                      <div>
                        <h3 className="text-xl font-bold text-white">
                          {selectedShipment?.weight
                            ? "Modifier le poids 📝"
                            : "Ajouter le poids ⚖️"}
                        </h3>
                        <p className="text-slate-400 text-sm">
                          #{selectedShipment?.trackingNumber}
                        </p>
                      </div>
                    </div>
                    <motion.button
                      onClick={() => setShowModal(false)}
                      disabled={
                        updatingShipments[selectedShipment!.trackingNumber]
                      }
                      className="text-slate-400 hover:text-white disabled:opacity-50 p-2 hover:bg-slate-700/50 rounded-lg transition-all duration-200"
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X className="h-5 w-5" />
                    </motion.button>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label
                        className="block text-slate-300 mb-3 font-medium"
                        htmlFor="weight"
                      >
                        Poids (lbs) <span className="text-red-400">*</span>
                      </label>
                      <motion.input
                        id="weight"
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className={`w-full px-4 py-3 bg-slate-700/50 backdrop-blur-sm border rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all duration-300 ${
                          selectedShipment &&
                          weightErrors[selectedShipment.trackingNumber]
                            ? "border-red-500/50 ring-2 ring-red-500/20"
                            : "border-slate-600/50"
                        }`}
                        placeholder="Entrez le poids..."
                        step="0.1"
                        min="0"
                        disabled={
                          !!selectedShipment &&
                          updatingShipments[selectedShipment.trackingNumber]
                        }
                        whileFocus={{ scale: 1.02 }}
                      />
                      {selectedShipment &&
                        weightErrors[selectedShipment.trackingNumber] && (
                          <motion.p
                            className="text-red-400 text-sm mt-2 flex items-center gap-1"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                          >
                            <AlertCircle className="h-4 w-4" />
                            Le poids est obligatoire pour confirmer ce colis
                          </motion.p>
                        )}
                    </div>

                    <div className="flex justify-between gap-4">
                      <motion.button
                        onClick={() => setShowModal(false)}
                        disabled={
                          !!selectedShipment &&
                          updatingShipments[selectedShipment.trackingNumber]
                        }
                        className="px-6 py-3 border border-slate-600 rounded-xl text-slate-300 hover:bg-slate-700/50 transition-all duration-300 flex-1 disabled:opacity-50 font-medium"
                        whileHover={{ scale: 1.02, y: -1 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Annuler
                      </motion.button>
                      <motion.button
                        onClick={handleUpdateShipment}
                        disabled={
                          !!selectedShipment &&
                          updatingShipments[selectedShipment.trackingNumber]
                        }
                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 flex-1 disabled:opacity-50 flex items-center justify-center gap-2 font-bold shadow-lg shadow-blue-500/25"
                        whileHover={{ scale: 1.02, y: -1 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {selectedShipment &&
                        updatingShipments[selectedShipment.trackingNumber] ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                            >
                              <Loader2 className="h-4 w-4" />
                            </motion.div>
                            Enregistrement...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4" />
                            Enregistrer ✨
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default MarkShipmentAsConfirmed;
