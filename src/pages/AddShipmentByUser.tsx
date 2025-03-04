import { useEffect, useState } from "react";
import { db } from "../../configs/index";
import { useUser } from "@clerk/clerk-react";
import { shipmentListing } from "../../configs/schema";
import shipmentDetails from "../assets/shared/shipmentDetails.json";
import { sendPendingEmail } from "@/services/emailServices";

const Loader = () => (
  <div className="flex items-center justify-center space-x-2">
    <div className="h-4 w-4 bg-blue-500 rounded-full animate-bounce"></div>
    <div className="h-4 w-4 bg-blue-500 rounded-full animate-bounce delay-200"></div>
    <div className="h-4 w-4 bg-blue-500 rounded-full animate-bounce delay-400"></div>
  </div>
);

const ShipmentSuccessModal = ({ onClose }: { onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-blue-600 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-[350px] shadow-2xl border-l-4 border-green-500 animate-fade-in">
        <h3 className="text-lg font-semibold text-center">Requête envoyée avec succès !</h3>
        <p className="text-sm text-center mt-2">
          Une fois le colis reçu dans nos locaux, il sera validé. Vous pourrez suivre toutes les mises à jour sur l'application.
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

const AddShipmentByUser = () => {
  const { user } = useUser();
  const [trackingNumber, setTrackingNumber] = useState("");
  const [destination, setDestination] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTrackingNumber(e.target.value);
  };

  const handleDestinationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDestination(e.target.value);
  };

  const resetForm = () => {
    setTrackingNumber("");
    setDestination("");
  };

  const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const now = new Date();
    const formattedDate = now.toISOString().split("T")[0];
    const formattedTime = now.toLocaleTimeString("fr-FR", { hour12: false });
    const statusDates = [{
      date: `${formattedDate} ${formattedTime}`,
      status: 'request',
      location: "by user online"
    }];

    try {
      const insertData = {
        fullName: `${user?.firstName ?? ""} ${user?.lastName ?? ""}`,
        userName: user?.username ?? "",
        emailAdress: user?.emailAddresses?.[0]?.emailAddress ?? "",
        trackingNumber: trackingNumber,
        category: "Standard",
        weight: "",
        status: "En attente⏳",
        ownerId: user?.id ?? "",
        destination: destination  || "non spécifié",
        estimatedDelivery: "Sera calculé après confirmation",
        phone: "inconu"
        
      };

      const result = await db.insert(shipmentListing).values({ ...insertData, statusDates });

      if (result) {
        setShowSuccessModal(true);
        resetForm();
        await sendPendingEmail(`${insertData.fullName}`, `${insertData.emailAdress}`, `${insertData.trackingNumber}`);
      }
    } catch (error) {
      console.log(error);
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
      <form onSubmit={onFormSubmit} className="p-10 px-2 border rounded-xl mt-2">
        <h2 className="font-medium text-xl mb-6">Détails du colis</h2>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Ajoutez Votre Numéro de tracking</label>
          <input
            type="text"
            value={trackingNumber}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md"
            required
            disabled={loading}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Choisissez une destination</label>
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
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
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
      {showSuccessModal && <ShipmentSuccessModal onClose={() => setShowSuccessModal(false)} />}
    </div>
  );
};

export default AddShipmentByUser;
