/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
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
}) => (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
    <div className="bg-white rounded-lg p-6 w-[400px] shadow-2xl border-l-4 border-red-600 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <svg
          className="w-6 h-6 text-red-600"
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
      <p className="text-sm text-gray-700 mb-4 font-medium">
        Le colis avec le numéro de suivi{" "}
        <span className="font-bold">{trackingNumber}</span>{" "}
        a déjà été livré et ne peut pas être transféré.
      </p>
      <button
        onClick={onClose}
        className="mt-4 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors"
      >
        Fermer
      </button>
    </div>
  </div>
);

const ShipmentClaimedCard = ({
  trackingNumber,
  onClose,
}: {
  trackingNumber: string;
  onClose: () => void;
}) => (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
    <div className="bg-white rounded-lg p-6 w-[400px] shadow-2xl border-l-4 border-orange-600 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <svg
          className="w-6 h-6 text-orange-600"
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
      <p className="text-sm text-gray-700 mb-4 font-medium">
        Le colis avec le numéro de suivi{" "}
        <span className="font-bold">{trackingNumber}</span>{" "}
        est déjà associé à un autre client et ne peut pas être transféré.
      </p>
      <button
        onClick={onClose}
        className="mt-4 w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition-colors"
      >
        Fermer
      </button>
    </div>
  </div>
);

const UserDataErrorCard = ({
  onClose,
  errorMessage,
}: {
  onClose: () => void;
  errorMessage?: string;
}) => (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
    <div className="bg-white rounded-lg p-6 w-[400px] shadow-2xl border-l-4 border-red-600 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <svg
          className="w-6 h-6 text-red-600"
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
          Erreur !
        </h3>
      </div>
      <p className="text-sm text-gray-700 mb-4 font-medium">
        {errorMessage || "Une erreur s'est produite. Veuillez vérifier les informations et réessayer."}
      </p>
      <button
        onClick={onClose}
        className="mt-4 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors"
      >
        Fermer
      </button>
    </div>
  </div>
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
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-60 z-50">
      <div className="bg-white rounded-xl p-8 w-[450px] shadow-2xl border-l-4 border-green-500 animate-fade-in">
        <div className="flex items-center gap-3 mb-4">
          <svg
            className="w-8 h-8 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
          <h3 className="text-xl font-semibold text-gray-800">
            {isTransfer ? "Transfert effectué avec succès !" : "Requête enregistrée !"}
          </h3>
        </div>
        {isTransfer ? (
          <div className="text-sm text-gray-600 mb-6">
            <p className="font-medium">
              Nous avons vérifié que le colis avec le numéro <span className="font-bold">{trackingNumber}</span> existe dans notre système.
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Il est maintenant attribué à votre compte ({userName}).</li>
              <li>Vous recevrez des notifications pour chaque mise à jour du statut.</li>
              <li>Suivez votre colis directement sur notre application.</li>
            </ul>
          </div>
        ) : (
          <p className="text-sm text-gray-600 mb-6 font-medium">
            Votre requête pour le colis avec le numéro <span className="font-bold">{trackingNumber}</span> a été enregistrée.
            Une fois reçu dans nos locaux, nous validerons le processus. Suivez les mises à jour sur l’application.
          </p>
        )}
        <button
          onClick={onClose}
          className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
        >
          Fermer
        </button>
      </div>
    </div>
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
      // Vérification des données utilisateur
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

      // Étape 1 : Vérifier si le colis existe
      const existingShipments = await findByTrackingNumber(trackingNumber);
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

        // Étape 3 : Vérifier si le colis appartient à l’entreprise
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

        // Étape 4 : Transférer le colis
        const updatedData = {
          ownerId: user.id,
          fullName: userName,
          userName: user.username ?? "",
          emailAdress: user.emailAddresses[0].emailAddress,
          phone: user.phoneNumbers?.[0]?.phoneNumber || "inconnu",
          destination: destination || shipment.destination,
        };

        console.log("Données de mise à jour pour le transfert :", { ...updatedData, status: shipment.status });

        // Ajouter l’entrée de requête à statusDates
        const currentStatusDates = Array.isArray(shipment.statusDates) ? shipment.statusDates : [];
        const updatedStatusDates = [...currentStatusDates, requestStatusEntry];

        await db
          .update(shipmentListing)
          .set({ ...updatedData, statusDates: updatedStatusDates })
          .where(sql`${shipmentListing.trackingNumber} = ${shipment.trackingNumber}`);

        // Ajouter une entrée pour le transfert
        await updateShipmentStatus(
          shipment.id,
          shipment.status,
          `Transféré à l'utilisateur ${updatedData.fullName}`
        );

        // Envoyer un email de confirmation
        await sendStatusEmail(
          "En attente⏳",
          updatedData.fullName,
          updatedData.emailAdress,
          trackingNumber
        );

        console.log("Transfert réussi :", { trackingNumber: trackingNumber, status: shipment.status });

        setIsTransfer(true);
        setShowSuccessModal(true);
        setRefreshShipments(true);
        resetForm();
      } else {
        // Étape 5 : Créer une nouvelle requête
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
          estimatedDelivery: addDays(new Date(), 7), // Date par défaut valide
          phone: user.phoneNumbers?.[0]?.phoneNumber || "inconnu",
          statusDates,
        };

        console.log("Données pour la nouvelle requête :", data);

        // Envoyer un email
        await sendStatusEmail(
          "En attente⏳",
          data.fullName,
          data.emailAdress,
          trackingNumber
        );

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
    <div className="px-4 md:px-20 py-10">
      <div className="flex justify-between">
        <h2 className="font-bold text-2xl">Ajouter un colis en attente</h2>
      </div>
      <form
        onSubmit={onFormSubmit}
        className="p-6 md:p-10 border rounded-xl mt-4 bg-white shadow-sm"
      >
        <h2 className="font-medium text-xl mb-6">Détails du colis</h2>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">
            Numéro de suivi
          </label>
          <input
            type="text"
            value={trackingNumber}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
            disabled={loading}
            placeholder="Entrez votre numéro de suivi"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">
            Destination
          </label>
          <select
            value={destination}
            onChange={handleDestinationChange}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
            className={`px-6 py-2 text-lg rounded-lg text-white transition flex items-center gap-2 ${
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