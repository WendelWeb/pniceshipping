/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { db } from "../../configs/index";
import { useUser } from "@clerk/clerk-react";
import { shipmentListing } from "../../configs/schema";
import { eq } from "drizzle-orm";
import shipmentDetails from "../assets/shared/shipmentDetails.json";
import { sendStatusEmail } from "../services/emailServices";
import { findByTrackingNumber, updateShipmentStatus } from "@/utils/shipmentQueries.ts";

type AddShipmentByUserProps = {
  setRefreshShipments: (value: boolean) => void;
};

const Loader = () => (
  <div className="flex items-center justify-center space-x-2">
    <div className="h-4 w-4 bg-blue-500 rounded-full animate-bounce"></div>
    <div className="h-4 w-4 bg-blue-500 rounded-full animate-bounce delay-200"></div>
    <div className="h-4 w-4 bg-blue-500 rounded-full animate-bounce delay-400"></div>
  </div>
);

const ShipmentErrorCard = ({
  trackingNumber,
  onClose,
}: {
  trackingNumber: string;
  onClose: () => void;
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-red-600 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-[400px] shadow-2xl border-l-4 border-red-500 animate-fade-in">
        <div className="flex items-center gap-2 mb-4">
          <svg
            className="w-6 h-6 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-xl font-semibold text-red-600">
            Colis déjà livré !
          </h3>
        </div>
        <p className="text-sm text-gray-600 mb-4 font-medium">
          Le colis avec le numéro de suivi{" "}
          <span className="font-semibold">{trackingNumber}</span>{" "}
          a déjà été livré et ne peut pas être transféré.
        </p>
        <button
          onClick={onClose}
          className="mt-4 w-full cursor-pointer bg-red-500 text-white py-2 rounded hover:bg-red-600 transition-colors"
        >
          Fermer
        </button>
      </div>
    </div>
  );
};

const ShipmentClaimedCard = ({
  trackingNumber,
  onClose,
}: {
  trackingNumber: string;
  onClose: () => void;
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-orange-600 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-[400px] border-l-4 border-orange-500 shadow-2xl animate-fade-in">
        <div className="flex items-center gap-2 mb-4">
          <svg
            className="w-6 h-6 text-orange-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-xl font-semibold text-orange-600">
            Colis déjà revendiqué !
          </h3>
        </div>
        <p className="text-sm text-gray-600 mb-4 font-medium">
          Le colis avec le numéro de suivi{" "}
          <span className="font-semibold">{trackingNumber}</span>{" "}
          est déjà associé à un autre client et ne peut pas être transféré.
        </p>
        <button
          onClick={onClose}
          className="mt-4 w-full cursor-pointer bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition-colors"
        >
          Fermer
        </button>
      </div>
    </div>
  );
};

const ShipmentSuccessModal = ({
  isTransfer,
  trackingNumber,
  onClose,
}: {
  isTransfer: boolean;
  trackingNumber: string;
  onClose: () => void;
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-blue-600 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-[350px] shadow-2xl border-l-4 border-green-500 animate-fade-in">
        <h3 className="text-lg font-semibold text-center">
          {isTransfer ? "Colis transféré avec succès !" : "Requête envoyée avec succès !"}
        </h3>
        <p className="text-sm text-center mt-2">
          {isTransfer
            ? `Le colis avec le numéro de suivi ${trackingNumber} a été transféré à votre compte.`
            : "Une fois le colis reçu dans nos locaux, il sera validé. Vous pourrez suivre toutes les mises à jour sur l'application."}
        </p>
        <button
          onClick={onClose}
          className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Fermer
        </button>
      </div>
    </div>
  );
};

const AddShipmentByUser: React.FC<AddShipmentByUserProps> = ({ setRefreshShipments }) => {
  const { user } = useUser();
  const [trackingNumber, setTrackingNumber] = useState("");
  const [destination, setDestination] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isTransfer, setIsTransfer] = useState(false);
  const [showErrorCard, setShowErrorCard] = useState(false);
  const [showClaimedCard, setShowClaimedCard] = useState(false);
  const [existingShipment, setExistingShipment] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const COMPANY_USER_ID = "user_2v0TyYr3oFSH1ZqHhlas0sPkEyq";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Limiter l'entrée à 20 caractères
    const value = e.target.value.slice(0, 20);
    setTrackingNumber(value);
  };

  const handleDestinationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDestination(e.target.value);
  };

  const resetForm = () => {
    setTrackingNumber("");
    setDestination("");
    setShowErrorCard(false);
    setShowClaimedCard(false);
    setExistingShipment(null);
  };

  const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // S'assurer que seuls les 20 premiers caractères sont utilisés
    const truncatedTrackingNumber = trackingNumber.slice(0, 21);

    try {
      // Vérification de la validité des données utilisateur
      if (!user?.id || !user?.emailAddresses?.[0]?.emailAddress) {
        console.error("Données utilisateur manquantes :", { userId: user?.id, email: user?.emailAddresses?.[0]?.emailAddress });
        throw new Error("Informations utilisateur manquantes.");
      }

      // Étape 1 : Vérifier si le colis existe
      const existingShipments = await findByTrackingNumber(truncatedTrackingNumber);
      console.log("Résultat de findByTrackingNumber :", existingShipments);

      if (existingShipments.length > 0) {
        const shipment = existingShipments[0];

        // Étape 2 : Vérifier si le colis est déjà livré
        if (shipment.status === "Livré✅") {
          console.log("Colis déjà livré :", shipment.trackingNumber);
          setExistingShipment(shipment);
          setShowErrorCard(true);
          setLoading(false);
          return;
        }

        // Étape 3 : Vérifier si le colis appartient à l'entreprise
        if (shipment.ownerId !== COMPANY_USER_ID) {
          console.log("Colis revendiqué par un autre client :", { trackingNumber: truncatedTrackingNumber, ownerId: shipment.ownerId });
          setExistingShipment(shipment);
          setShowClaimedCard(true);
          setLoading(false);
          return;
        }

        // Étape 4 : Transférer le colis à l'utilisateur
        const updatedData = {
          ownerId: user.id,
          fullName: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
          userName: user.username ?? "",
          emailAdress: user.emailAddresses[0].emailAddress,
          phone: user.phoneNumbers?.[0]?.phoneNumber ?? "inconnu",
          destination: destination || shipment.destination,
        };

        console.log("Données de mise à jour pour le transfert :", { ...updatedData, status: shipment.status });

        await db
          .update(shipmentListing)
          .set(updatedData)
          .where(eq(shipmentListing.trackingNumber, truncatedTrackingNumber));

        // Ajouter une entrée dans statusDates pour indiquer le transfert, en conservant le statut actuel
        await updateShipmentStatus(
          shipment.id,
          shipment.status,
          `Transféré à l'utilisateur ${updatedData.fullName}`
        );

        // Envoyer un email de confirmation avec statut "En attente⏳"
        await sendStatusEmail(
          "En attente⏳",
          updatedData.fullName,
          updatedData.emailAdress,
          truncatedTrackingNumber
        );

        console.log("Transfert réussi pour le colis :", { trackingNumber: truncatedTrackingNumber, status: shipment.status });

        setIsTransfer(true);
        setShowSuccessModal(true);
        setRefreshShipments(true);
        resetForm();
      } else {
        // Étape 5 : Si le colis n'existe pas, créer une nouvelle requête
        const now = new Date();
        const formattedDate = now.toISOString().split("T")[0];
        const formattedTime = now.toLocaleTimeString("fr-FR", { hour12: false });
        const statusDates = [
          {
            date: `${formattedDate} ${formattedTime}`,
            status: "En attente⏳",
            location: "by user online",
          },
        ];

        const insertData = {
          fullName: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
          userName: user.username ?? "",
          emailAdress: user.emailAddresses[0].emailAddress,
          trackingNumber: truncatedTrackingNumber,
          category: "Standard",
          weight: "",
          status: "En attente⏳",
          ownerId: user.id,
          destination: destination || "non spécifié",
          estimatedDelivery: "Sera calculé après confirmation",
          phone: user.phoneNumbers?.[0]?.phoneNumber ?? "inconnu",
          statusDates,
        };

        console.log("Données pour nouvelle requête :", insertData);

        // Envoyer un email avec statut "En attente⏳"
        await sendStatusEmail(
          "En attente⏳",
          insertData.fullName,
          insertData.emailAdress,
          truncatedTrackingNumber
        );

        const result = await db
          .insert(shipmentListing)
          .values(insertData);

        if (result) {
          console.log("Nouvelle requête enregistrée :", truncatedTrackingNumber);
          setIsTransfer(false);
          setShowSuccessModal(true);
          setRefreshShipments(true);
          resetForm();
        }
      }
    } catch (error) {
      console.error("Erreur lors de la soumission de la requête :", error);
    } finally {
      setLoading(false);
    }
  };

  const destinationField = shipmentDetails.shipmentDetails.find(
    (item) => item.name === "destination"
  );
  const destinationOptions = destinationField?.options || [];

  return (
    <div className="px-2 md:px-20 py-10">
      <div className="flex justify-between">
        <h2 className="font-bold text-xl">Ajouter un colis en attente</h2>
      </div>
      <form
        onSubmit={onFormSubmit}
        className="p-10 px-2 border rounded-xl mt-2"
      >
        <h2 className="font-medium text-xl mb-6">Détails du colis</h2>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">
            Ajoutez Votre Numéro de tracking
          </label>
          <input
            type="text"
            value={trackingNumber}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md"
            required
            disabled={loading}
            maxLength={20} // Ajout de l'attribut maxLength pour limiter l'entrée
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">
            Choisissez une destination
          </label>
          <select
            value={destination}
            onChange={handleDestinationChange}
            className="w-full p-2 border rounded-md"
            required
            disabled={loading}
          >
            <option value="">Sélectionnez une destination</option>
            {destinationOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="my-6 h-px bg-gray-200" />
        <div className="mt-6 flex justify-center">
          <button
            type="submit"
            className={`px-6 py-2 text-lg rounded-lg text-white transition cursor-pointer flex items-center gap-2 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader />
                <span>Envoi en cours...</span>
              </>
            ) : (
              "Soumettre"
            )}
          </button>
        </div>
      </form>
      {showSuccessModal && (
        <ShipmentSuccessModal
          isTransfer={isTransfer}
          trackingNumber={trackingNumber}
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
    </div>
  );
};

export default AddShipmentByUser;