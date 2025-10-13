/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Send, MapPin,  CheckCircle, AlertTriangle, XCircle, Sparkles } from "lucide-react";
import { db } from "../../configs";
import { useUser } from "@clerk/clerk-react";
import { sql } from "drizzle-orm";
import shipmentDetails from "../assets/shared/shipmentDetails.json";
import { findByTrackingNumber, updateShipmentStatus } from "@/utils/shipmentQueries";
import { sendStatusEmail } from "@/services/emailServices";
import { shipmentListing } from "../../configs/schema";

type AddShipmentProps = {
  setRefreshShipments: (value: boolean) => void;
};

const Loader = () => (
  <motion.div 
    className="flex items-center justify-center space-x-1"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        className="h-2 w-2 bg-blue-400 rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          delay: i * 0.2
        }}
      />
    ))}
  </motion.div>
);

const ShipmentErrorCard = ({
  trackingNumber,
  onClose,
}: {
  trackingNumber: string;
  onClose: () => void;
}) => (
  <AnimatePresence>
    <motion.div 
      className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className="bg-gray-900 border border-red-500/20 rounded-2xl p-8 w-[420px] shadow-2xl"
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-red-500/10 rounded-full">
            <XCircle className="w-6 h-6 text-red-400" />
          </div>
          <h3 className="text-xl font-semibold text-white">
            🚫 Colis déjà livré !
          </h3>
        </div>
        <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 mb-6">
          <p className="text-sm text-gray-300 font-medium">
            Le colis avec le numéro de suivi{" "}
            <span className="font-bold text-red-400 bg-red-500/10 px-2 py-1 rounded">
              {trackingNumber}
            </span>{" "}
            a déjà été livré et ne peut pas être transféré.
          </p>
        </div>
        <motion.button
          onClick={onClose}
          className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white py-3 rounded-xl hover:from-red-500 hover:to-red-400 transition-all duration-200 font-semibold"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Fermer
        </motion.button>
      </motion.div>
    </motion.div>
  </AnimatePresence>
);

const ShipmentClaimedCard = ({
  trackingNumber,
  onClose,
}: {
  trackingNumber: string;
  onClose: () => void;
}) => (
  <AnimatePresence>
    <motion.div 
      className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className="bg-gray-900 border border-orange-500/20 rounded-2xl p-8 w-[420px] shadow-2xl"
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-orange-500/10 rounded-full">
            <AlertTriangle className="w-6 h-6 text-orange-400" />
          </div>
          <h3 className="text-xl font-semibold text-white">
            ⚠️ Colis déjà revendiqué !
          </h3>
        </div>
        <div className="bg-orange-500/5 border border-orange-500/20 rounded-xl p-4 mb-6">
          <p className="text-sm text-gray-300 font-medium">
            Le colis avec le numéro de suivi{" "}
            <span className="font-bold text-orange-400 bg-orange-500/10 px-2 py-1 rounded">
              {trackingNumber}
            </span>{" "}
            est déjà associé à un autre client et ne peut pas être transféré.
          </p>
        </div>
        <motion.button
          onClick={onClose}
          className="w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white py-3 rounded-xl hover:from-orange-500 hover:to-orange-400 transition-all duration-200 font-semibold"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Fermer
        </motion.button>
      </motion.div>
    </motion.div>
  </AnimatePresence>
);

const UserDataErrorCard = ({
  onClose,
  errorMessage,
}: {
  onClose: () => void;
  errorMessage?: string;
}) => (
  <AnimatePresence>
    <motion.div 
      className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className="bg-gray-900 border border-red-500/20 rounded-2xl p-8 w-[420px] shadow-2xl"
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-red-500/10 rounded-full">
            <XCircle className="w-6 h-6 text-red-400" />
          </div>
          <h3 className="text-xl font-semibold text-white">
            💥 Erreur !
          </h3>
        </div>
        <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 mb-6">
          <p className="text-sm text-gray-300 font-medium">
            {errorMessage || "Une erreur s'est produite. Veuillez vérifier les informations et réessayer."}
          </p>
        </div>
        <motion.button
          onClick={onClose}
          className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white py-3 rounded-xl hover:from-red-500 hover:to-red-400 transition-all duration-200 font-semibold"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Fermer
        </motion.button>
      </motion.div>
    </motion.div>
  </AnimatePresence>
);

const ShipmentSuccessModal = ({
  isTransfer,
  trackingNumber,
  userName,
  onClose,
}: {
  isTransfer: boolean;
  trackingNumber: string;
  userName: string;
  onClose: () => void;
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 7000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div 
          className="bg-gray-900 border border-green-500/20 rounded-2xl p-8 w-[480px] shadow-2xl relative overflow-hidden"
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
        >
          {/* Particles de succès */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-green-400 rounded-full"
                initial={{ 
                  x: "50%", 
                  y: "50%",
                  scale: 0,
                  opacity: 0 
                }}
                animate={{ 
                  x: `${Math.random() * 100}%`,
                  y: `${Math.random() * 100}%`,
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.2,
                  repeat: Infinity,
                  repeatDelay: 3
                }}
              />
            ))}
          </div>

          <div className="flex items-center gap-3 mb-6">
            <motion.div 
              className="p-2 bg-green-500/10 rounded-full"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0] 
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                repeatDelay: 1
              }}
            >
              <CheckCircle className="w-8 h-8 text-green-400" />
            </motion.div>
            <h3 className="text-xl font-semibold text-white">
              {isTransfer ? "🎉 Transfert effectué avec succès !" : "📝 Requête enregistrée !"}
            </h3>
          </div>

          {isTransfer ? (
            <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4 mb-6">
              <p className="font-medium text-gray-300 mb-3">
                ✅ Nous avons vérifié que le colis avec le numéro{" "}
                <span className="font-bold text-green-400 bg-green-500/10 px-2 py-1 rounded">
                  {trackingNumber}
                </span>{" "}
                existe dans notre système.
              </p>
              <ul className="text-sm text-gray-400 space-y-2">
                <motion.li 
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                  Il est maintenant attribué à votre compte ({userName}).
                </motion.li>
                <motion.li 
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                  Vous recevrez des notifications pour chaque mise à jour du statut.
                </motion.li>
                <motion.li 
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                  Suivez votre colis directement sur notre application.
                </motion.li>
              </ul>
            </div>
          ) : (
            <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-300 font-medium">
                📦 Votre requête pour le colis avec le numéro{" "}
                <span className="font-bold text-blue-400 bg-blue-500/10 px-2 py-1 rounded">
                  {trackingNumber}
                </span>{" "}
                a été enregistrée. Une fois reçu dans nos locaux, nous validerons le processus. 
                Suivez les mises à jour sur l'application.
              </p>
            </div>
          )}

          <motion.button
            onClick={onClose}
            className="w-full py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl hover:from-green-500 hover:to-green-400 transition-all duration-200 font-semibold"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Fermer
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

function addDays(date: Date, days: number): string {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result.toISOString().split("T")[0];
}

const AddShipmentByUser: React.FC<AddShipmentProps> = ({ setRefreshShipments }) => {
  const { user } = useUser();
  const [trackingNumber, setTrackingNumber] = useState("");
  const [destination, setDestination] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isTransfer, setIsTransfer] = useState(false);
  const [showErrorCard, setShowErrorCard] = useState(false);
  const [showClaimedCard, setShowClaimedCard] = useState(false);
  const [showUserDataErrorCard, setShowUserDataErrorCard] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const [existingShipment, setExistingShipment] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const COMPANY_USER_ID = "user_2v0TyYr3oFSH1ZqHhlas0sPkEyq";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTrackingNumber(e.target.value);
  };

  const handleDestinationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDestination(e.target.value);
  };

  const resetForm = () => {
    setTrackingNumber("");
    setDestination("");
    setShowErrorCard(false);
    setShowClaimedCard(false);
    setShowUserDataErrorCard(false);
    setErrorMessage(undefined);
    setExistingShipment(null);
  };

  const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!user?.id || !user?.emailAddresses?.[0]?.emailAddress) {
        console.error("Données utilisateur manquantes :", {
          userId: user?.id,
          email: user?.emailAddresses?.[0]?.emailAddress,
        });
        setErrorMessage("Informations utilisateur manquantes.");
        setShowUserDataErrorCard(true);
        setLoading(false);
        return;
      }

      const userName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
      const now = new Date();
      const formattedDate = now.toISOString().split("T")[0];
      const formattedTime = now.toLocaleTimeString("fr-FR", { hour12: false });
      const requestStatusEntry = {
        date: `${formattedDate} ${formattedTime}`,
        status: "Requête par l'utilisateur en ligne",
        location: `Soumise en ligne par ${userName}`,
      };

      const existingShipments = await findByTrackingNumber(trackingNumber);
      console.log("Résultat de findByTrackingNumber :", existingShipments);

      if (existingShipments.length > 0) {
        const shipment = existingShipments[0];

        if (shipment.status === "Livré✅") {
          console.log("Colis déjà livré :", shipment.trackingNumber);
          setExistingShipment(shipment);
          setShowErrorCard(true);
          setLoading(false);
          return;
        }

        if (shipment.ownerId !== COMPANY_USER_ID) {
          console.log("Colis revendiqué par un autre client :", {
            trackingNumber: trackingNumber,
            ownerId: shipment.ownerId,
          });
          setExistingShipment(shipment);
          setShowClaimedCard(true);
          setLoading(false);
          return;
        }

        const updatedData = {
          ownerId: user.id,
          fullName: userName,
          userName: user.username ?? "",
          emailAdress: user.emailAddresses[0].emailAddress,
          phone: user.phoneNumbers?.[0]?.phoneNumber || "inconnu",
          destination: destination || shipment.destination,
        };

        console.log("Données de mise à jour pour le transfert :", { ...updatedData, status: shipment.status });

        const currentStatusDates = Array.isArray(shipment.statusDates) ? shipment.statusDates : [];
        const updatedStatusDates = [...currentStatusDates, requestStatusEntry];

        await db
          .update(shipmentListing)
          .set({ ...updatedData, statusDates: updatedStatusDates })
          .where(sql`${shipmentListing.trackingNumber} = ${shipment.trackingNumber}`);

        await updateShipmentStatus(
          shipment.id,
          shipment.status,
          `Transféré à l'utilisateur ${updatedData.fullName}`
        );

        // Tentative d'envoi d'email (n'arrête pas le processus en cas d'échec)
        try {
          await sendStatusEmail(
            "En attente⏳",
            updatedData.fullName,
            updatedData.emailAdress,
            trackingNumber
          );
          console.log("✅ Email de transfert envoyé avec succès");
        } catch (emailError: any) {
          console.error("⚠️ Erreur lors de l'envoi de l'email (le colis a été transféré quand même) :", emailError.message);
        }

        console.log("Transfert réussi :", { trackingNumber: trackingNumber, status: shipment.status });

        setIsTransfer(true);
        setShowSuccessModal(true);
        setRefreshShipments(true);
        resetForm();
      } else {
        const statusDates = [
          requestStatusEntry,
          {
            date: `${formattedDate} ${formattedTime}`,
            status: "En attente⏳",
            location: "En attente de réception",
          },
        ];

        const data = {
          fullName: userName,
          userName: user.username ?? "",
          emailAdress: user.emailAddresses[0].emailAddress,
          trackingNumber: trackingNumber,
          category: "Standard",
          weight: "",
          status: "En attente⏳",
          ownerId: user.id,
          destination: destination || "non spécifié",
          estimatedDelivery: addDays(new Date(), 7),
          phone: user.phoneNumbers?.[0]?.phoneNumber || "inconnu",
          statusDates,
        };

        console.log("Données pour la nouvelle requête :", data);

        // Tentative d'envoi d'email (n'arrête pas le processus en cas d'échec)
        try {
          await sendStatusEmail(
            "En attente⏳",
            data.fullName,
            data.emailAdress,
            trackingNumber
          );
          console.log("✅ Email de nouvelle requête envoyé avec succès");
        } catch (emailError: any) {
          console.error("⚠️ Erreur lors de l'envoi de l'email (la requête a été enregistrée quand même) :", emailError.message);
        }

        const result = await db
          .insert(shipmentListing)
          .values(data);

        if (result) {
          console.log("Nouvelle requête enregistrée :", trackingNumber);
          setIsTransfer(false);
          setShowSuccessModal(true);
          setRefreshShipments(true);
          resetForm();
        }
      }
    } catch (error: any) {
      console.error("Erreur lors de la soumission :", error);
      setErrorMessage(
        error.message.includes("not-null constraint")
          ? "Erreur : Une date de livraison estimée valide est requise."
          : "Une erreur s'est produite lors de l'enregistrement de la requête. Veuillez réessayer."
      );
      setShowUserDataErrorCard(true);
    } finally {
      setLoading(false);
    }
  };

  const destinationField = shipmentDetails.shipmentDetails.find(
    (item) => item.name === "destination"
  );
  const destinationOptions = destinationField?.options || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4 md:px-20 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between mb-8">
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
              <Package className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h2 className="font-bold text-3xl text-white mb-1">
                📦 Ajouter un colis en attente
              </h2>
              <p className="text-gray-400 text-sm">
                Transférez ou créez une nouvelle demande de colis ✨
              </p>
            </div>
          </motion.div>
        </div>

        <motion.form
          onSubmit={onFormSubmit}
          className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 shadow-2xl relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none" />
          
          <motion.div 
            className="flex items-center gap-3 mb-8 relative z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Sparkles className="w-6 h-6 text-blue-400" />
            <h3 className="font-semibold text-xl text-white">
              Détails du colis
            </h3>
          </motion.div>

          <div className="space-y-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label className="flex items-center gap-2 text-gray-300 font-medium mb-3">
                <Package className="w-4 h-4 text-blue-400" />
                Numéro de suivi
              </label>
              <motion.input
                type="text"
                value={trackingNumber}
                onChange={handleInputChange}
                className="w-full p-4 bg-gray-800/50 border border-gray-600/50 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 text-white placeholder-gray-400"
                required
                disabled={loading}
                placeholder="Entrez votre numéro de suivi..."
                whileFocus={{ scale: 1.01 }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <label className="flex items-center gap-2 text-gray-300 font-medium mb-3">
                <MapPin className="w-4 h-4 text-green-400" />
                Destination
              </label>
              <motion.select
                value={destination}
                onChange={handleDestinationChange}
                className="w-full p-4 bg-gray-800/50 border border-gray-600/50 rounded-xl focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-200 text-white"
                required
                disabled={loading}
                whileFocus={{ scale: 1.01 }}
              >
                <option value="" className="bg-gray-800">
                  Sélectionnez une destination 🌍
                </option>
                {destinationOptions.map((option) => (
                  <option key={option} value={option} className="bg-gray-800">
                    {option}
                  </option>
                ))}
              </motion.select>
            </motion.div>
          </div>

          <motion.div 
            className="my-8 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          />

          <motion.div 
            className="flex justify-center relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <motion.button
              type="submit"
              className={`px-8 py-4 text-lg rounded-xl text-white font-semibold transition-all duration-200 flex items-center gap-3 ${
                loading
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-lg hover:shadow-xl"
              }`}
              disabled={loading}
              whileHover={!loading ? { scale: 1.05 } : {}}
              whileTap={!loading ? { scale: 0.95 } : {}}
            >
              {loading ? (
                <>
                  <Loader />
                  <span>Envoi en cours...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>🚀 Soumettre</span>
                </>
              )}
            </motion.button>
          </motion.div>
        </motion.form>
      </motion.div>

      {showSuccessModal && (
        <ShipmentSuccessModal
          isTransfer={isTransfer}
          trackingNumber={trackingNumber}
          userName={`${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim()}
          onClose={() => setShowSuccessModal(false)}
        />
      )}
      {showErrorCard && existingShipment && (
        <ShipmentErrorCard
          trackingNumber={trackingNumber}
          onClose={() => setShowErrorCard(false)}
        />
      )}
      {showClaimedCard && existingShipment && (
        <ShipmentClaimedCard
          trackingNumber={trackingNumber}
          onClose={() => setShowClaimedCard(false)}
        />
      )}
      {showUserDataErrorCard && (
        <UserDataErrorCard
          onClose={() => setShowUserDataErrorCard(false)}
          errorMessage={errorMessage}
        />
      )}
    </div>
  );
};

export default AddShipmentByUser;