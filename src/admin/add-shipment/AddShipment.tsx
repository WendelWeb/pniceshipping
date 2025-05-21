/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { shipmentListing } from "../../../configs/schema.ts";
import { db } from "../../../configs/index.ts";
import { ShipmentFormData } from "@/types/shipment.ts";
import { ShipmentFormItem } from "@/types/shipment.ts";
import { useUserContext } from "@/contexts/UserContext.tsx";
import shipmentDetails from "../../assets/shared/shipmentDetails.json";
import InputField from "./InputField.tsx";
import DropdownField from "./DropdownField.tsx";
import IconField from "./IconField.tsx";
import { Link } from "react-router-dom";
import Button from "@/components/Button.tsx";
import { findByTrackingNumber } from "@/utils/shipmentQueries.ts";
import { sql } from "drizzle-orm";
import { sendStatusEmail } from "@/services/emailServices.ts";

// Composant Loader
const Loader = () => (
  <div className="flex items-center justify-center space-x-2">
    <div className="h-4 w-4 bg-white rounded-full animate-bounce"></div>
    <div className="h-4 w-4 bg-white rounded-full animate-bounce delay-200"></div>
    <div className="h-4 w-4 bg-white rounded-full animate-bounce delay-400"></div>
  </div>
);

// Composant Modal de succès
const ShipmentSuccessModal = ({
  isTransfer,
  shipmentData,
  onClose,
}: {
  isTransfer: boolean;
  shipmentData: any;
  onClose: () => void;
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-blue-600 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-[450px] shadow-2xl border-l-4 border-green-500 animate-fade-in">
        <div className="flex items-center gap-2 mb-4">
          <svg
            className="w-6 h-6 text-green-500"
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
          <h3 className="text-lg font-semibold">
            {isTransfer ? "Colis mis à jour avec succès ! ✅" : "Colis enregistré avec succès ! 🎉"}
          </h3>
        </div>
        {isTransfer ? (
          <div className="text-sm text-gray-600 mb-4">
            <p className="font-semibold">Mise à jour d'un colis en attente ⏳ :</p>
            <ul className="list-disc pl-5 mt-2 space-y-2">
              <li>
                ✅ <span className="font-semibold">Conservation des informations du client initial</span> : Les données du propriétaire (Nom, Nom d'utilisateur, Email, ID du propriétaire) ont été préservées.
              </li>
              <li>
                ➡️ <span className="font-semibold">Mise à jour des paramètres du colis</span> : Les champs suivants ont été actualisés :
                <ul className="list-circle pl-5 mt-1">
                  <li>📦 Catégorie : {shipmentData.category}</li>
                  <li>⚖️ Poids : {shipmentData.weight || "Non spécifié"} lbs</li>
                  <li>📍 Statut : {shipmentData.status}</li>
                  <li>🌍 Destination : {shipmentData.destination}</li>
                  <li>📅 Livraison estimée : {shipmentData.estimatedDelivery}</li>
                  <li>📞 Téléphone : {shipmentData.phone || "Inconnu"}</li>
                </ul>
              </li>
              <li>
                📝 <span className="font-semibold">Ajout à l'historique des statuts</span> : Une nouvelle entrée a été ajoutée à l'historique.
              </li>
            </ul>
          </div>
        ) : (
          <p className="text-sm text-gray-600 mb-4">
            🎉 Un nouveau colis avec le numéro de suivi <span className="font-semibold">{shipmentData.trackingNumber}</span> a été enregistré.
          </p>
        )}
        <div className="space-y-2 text-sm bg-gray-50 p-4 rounded-md border border-gray-200">
          <p><span className="font-semibold">Numéro de suivi </span>
            suivi : {shipmentData.trackingNumber}</p>
          <p><span className="font-semibold">Destinataire :</span> {shipmentData.fullName}</p>
          <p><span className="font-semibold">Nom d'utilisateur :</span> {shipmentData.userName}</p>
          <p><span className="font-semibold">Email :</span> {shipmentData.emailAdress}</p>
          <p><span className="font-semibold">Téléphone :</span> {shipmentData.phone || "Inconnu"}</p>
          <p><span className="font-semibold">Catégorie :</span> {shipmentData.category}</p>
          <p><span className="font-semibold">Poids :</span> {shipmentData.weight || "Non spécifié"} lbs</p>
          <p><span className="font-semibold">Statut :</span> {shipmentData.status}</p>
          <p><span className="font-semibold">Destination :</span> {shipmentData.destination}</p>
          <p><span className="font-semibold">Livraison estimée :</span> {shipmentData.estimatedDelivery}</p>
          {shipmentData.statusDates && (
            <div>
              <span className="font-semibold">Historique des statuts :</span>
              <ul className="list-disc pl-5 mt-1">
                {shipmentData.statusDates.map((status: any, index: number) => (
                  <li key={index}>
                    {status.date} - {status.status} ({status.location})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <button
          onClick={onClose}
          className="mt-4 w-full cursor-pointer bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Fermer
        </button>
      </div>
    </div>
  );
};

// Composant pour afficher l'erreur de colis existant
const ShipmentErrorCard = ({
  existingShipment,
  onClose,
}: {
  existingShipment: any;
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
          <h3 className="text-lg font-semibold text-red-600">
            Colis déjà enregistré ! 🚫
          </h3>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Le colis avec le numéro de suivi <span className="font-semibold">{existingShipment.trackingNumber}</span> est déjà enregistré avec un statut autre qu'En attente⏳.
        </p>
        <div className="space-y-2 text-sm bg-gray-50 p-4 rounded-md border border-gray-200">
          <p><span className="font-semibold">Destinataire :</span> {existingShipment.fullName}</p>
          <p><span className="font-semibold">Nom d'utilisateur :</span> {existingShipment.userName}</p>
          <p><span className="font-semibold">Email :</span> {existingShipment.emailAdress}</p>
          <p><span className="font-semibold">Numéro de suivi :</span> {existingShipment.trackingNumber}</p>
          <p><span className="font-semibold">Catégorie :</span> {existingShipment.category}</p>
          <p><span className="font-semibold">Poids :</span> {existingShipment.weight || "Non spécifié"} lbs</p>
          <p><span className="font-semibold">Statut :</span> {existingShipment.status}</p>
          <p><span className="font-semibold">Destination :</span> {existingShipment.destination}</p>
          <p><span className="font-semibold">Livraison estimée :</span> {existingShipment.estimatedDelivery}</p>
          <p><span className="font-semibold">Téléphone :</span> {existingShipment.phone || "Inconnu"}</p>
          {existingShipment.statusDates && (
            <div>
              <span className="font-semibold">Historique des statuts :</span>
              <ul className="list-disc pl-5 mt-1">
                {existingShipment.statusDates.map((status: any, index: number) => (
                  <li key={index}>
                    {status.date} - {status.status} ({status.location})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
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

// Composant pour afficher l'erreur de données utilisateur
const UserDataErrorCard = ({
  onClose,
  errorMessage,
}: {
  onClose: () => void;
  errorMessage?: string;
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
          <h3 className="text-lg font-semibold text-red-600">
            Erreur ! 🚫
          </h3>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          {errorMessage || "Une erreur s'est produite. Veuillez vérifier les informations et réessayer."}
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

const AddShipment = () => {
  const { user } = useUserContext();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ShipmentFormData>({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isTransfer, setIsTransfer] = useState(false);
  const [showErrorCard, setShowErrorCard] = useState(false);
  const [showUserDataErrorCard, setShowUserDataErrorCard] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const [existingShipment, setExistingShipment] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [updatedShipmentData, setUpdatedShipmentData] = useState<any>(null);

  useEffect(() => {
    const initialFormData: ShipmentFormData = {};
    shipmentDetails.shipmentDetails.forEach((item: ShipmentFormItem) => {
      const defaultValue = defaultValues(item.label);
      initialFormData[item.name as keyof ShipmentFormData] =
        item.fieldType === "number"
          ? parseFloat(defaultValue) || 0
          : defaultValue;
    });
    setFormData(initialFormData);
  }, []);

  const handleInputChange = (name: string, value: any) => {
    // Ne pas limiter l'entrée pour trackingNumber
    const processedValue = name === "trackingNumber" ? String(value) : value;
    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
    }));
  };

  function addDays(date: Date, days: number): string {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result.toISOString().split("T")[0];
  }

  const resetForm = () => {
    const initialFormData: ShipmentFormData = {};
    shipmentDetails.shipmentDetails.forEach((item: ShipmentFormItem) => {
      const defaultValue = defaultValues(item.label);
      initialFormData[item.name as keyof ShipmentFormData] =
        item.fieldType === "number"
          ? parseFloat(defaultValue) || 0
          : defaultValue;
    });
    setFormData(initialFormData);
    setShowErrorCard(false);
    setShowUserDataErrorCard(false);
    setErrorMessage(undefined);
    setExistingShipment(null);
    setUpdatedShipmentData(null);
    setIsTransfer(false);
  };

  const sendEmailByStatus = async (
    status: string,
    userName: string,
    userEmail: string,
    packageId: string
  ): Promise<boolean> => {
    try {
      await sendStatusEmail(status, userName, userEmail, packageId);
      console.log(`Email envoyé pour le statut ${status} à ${userEmail}`);
      return true;
    } catch (error: any) {
      console.error("Erreur lors de l'envoi de l'email :", error.message);
      setErrorMessage("Erreur lors de l'envoi de l'email. Veuillez réessayer.");
      return false;
    }
  };

  const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Tronquer le numéro de suivi à 20 caractères pour la comparaison
    const truncatedTrackingNumber = String(formData.trackingNumber || "").slice(0, 20);

    try {
      if (!user?.id || !formData.emailAdress) {
        console.error("Données utilisateur manquantes :", {
          userId: user?.id,
          email: formData.emailAdress,
        });
        setErrorMessage("Données utilisateur manquantes (ID ou email).");
        setShowUserDataErrorCard(true);
        setLoading(false);
        return;
      }

      const existingShipments = await findByTrackingNumber(truncatedTrackingNumber);
      console.log("Résultat de findByTrackingNumber :", existingShipments);

      let emailSent = false;
      let emailRecipient = formData.emailAdress || "";
      let recipientName = formData.userName || formData.fullName || "Client";
      let shipmentData: any = {};

      if (existingShipments.length > 0) {
        const shipment = existingShipments[0];

        if (shipment.status === "En attente⏳") {
          emailRecipient = shipment.emailAdress;
          recipientName = shipment.userName || shipment.fullName || "Client";

          shipmentData = {
            fullName: shipment.fullName,
            userName: shipment.userName,
            emailAdress: shipment.emailAdress,
            ownerId: shipment.ownerId,
            trackingNumber: formData.trackingNumber, // Conserver l'intégralité du numéro de suivi
            category: formData.category || shipment.category,
            weight: formData.weight?.toString() || shipment.weight,
            status: formData.status || shipment.status,
            destination: formData.destination || shipment.destination,
            estimatedDelivery: addDays(new Date(), 7),
            phone: formData.phone || shipment.phone || "inconnu",
          };

          emailSent = await sendEmailByStatus(
            shipmentData.status,
            recipientName,
            emailRecipient,
            shipmentData.trackingNumber
          );

          if (!emailSent) {
            setShowUserDataErrorCard(true);
            setLoading(false);
            return;
          }

          console.log("Données de mise à jour pour le colis :", shipmentData);

          await db
            .update(shipmentListing)
            .set(shipmentData)
            .where(sql`LEFT(${shipmentListing.trackingNumber}, 20) = ${truncatedTrackingNumber}`);

          const now = new Date();
          const formattedDate = now.toISOString().split("T")[0];
          const formattedTime = now.toLocaleTimeString("fr-FR", { hour12: false });
          const statusDates = [
            ...(Array.isArray(shipment.statusDates) ? shipment.statusDates : []),
            {
              date: `${formattedDate} ${formattedTime}`,
              status: shipmentData.status,
              location:
                shipmentData.status === "Recu📦"
                  ? "Pnice Miami, FL Warehouse"
                  : shipmentData.status === "En Transit✈️"
                  ? "En route vers Haiti"
                  : shipmentData.status === "Disponible🟢"
                  ? `Coli Disponible au local ${shipmentData.destination}`
                  : shipmentData.status === "Livré✅"
                  ? `Coli Livré au local ${shipmentData.destination}`
                  : "Mis à jour par admin",
            },
          ];

          await db
            .update(shipmentListing)
            .set({ statusDates })
            .where(sql`LEFT(${shipmentListing.trackingNumber}, 20) = ${truncatedTrackingNumber}`);

          console.log("Mise à jour réussie pour le colis :", {
            trackingNumber: truncatedTrackingNumber,
            status: shipmentData.status,
          });

          setUpdatedShipmentData({ ...shipmentData, statusDates });

          setIsTransfer(true);
          setShowSuccessModal(true);
          resetForm();
        } else {
          console.log("Colis existant avec statut non autorisé :", {
            trackingNumber: truncatedTrackingNumber,
            status: shipment.status,
          });
          setExistingShipment(shipment);
          setShowErrorCard(true);
        }
        setLoading(false);
        return;
      }

      shipmentData = {
        fullName: formData.fullName || "",
        userName: formData.userName || "",
        emailAdress: formData.emailAdress || "",
        trackingNumber: formData.trackingNumber, // Conserver l'intégralité du numéro de suivi
        category: formData.category || "",
        weight: formData.weight?.toString() || "",
        status: formData.status || "",
        ownerId: formData.ownerId || "",
        destination: formData.destination || "",
        estimatedDelivery: addDays(new Date(), 7),
        phone: formData.phone || "inconnu",
      };

      emailSent = await sendEmailByStatus(
        shipmentData.status,
        recipientName,
        emailRecipient,
        shipmentData.trackingNumber
      );

      if (!emailSent) {
        setShowUserDataErrorCard(true);
        setLoading(false);
        return;
      }

      const now = new Date();
      const formattedDate = now.toISOString().split("T")[0];
      const formattedTime = now.toLocaleTimeString("fr-FR", { hour12: false });
      const statusDates = [
        {
          date: `${formattedDate} ${formattedTime}`,
          status: shipmentData.status,
          location:
            shipmentData.status === "Recu📦"
              ? "Pnice Miami, FL Warehouse"
              : shipmentData.status === "En Transit✈️"
              ? "En route vers Haiti"
              : shipmentData.status === "Disponible🟢"
              ? `Coli Disponible au local ${shipmentData.destination}`
              : shipmentData.status === "Livré✅"
              ? `Coli Livré au local ${shipmentData.destination}`
              : "Enregistré par admin",
        },
      ];

      console.log("Données pour nouvel enregistrement :", shipmentData);

      const result = await db
        .insert(shipmentListing)
        .values({ ...shipmentData, statusDates });

      if (result) {
        console.log("Nouvel enregistrement réussi :", formData.trackingNumber);
        setIsTransfer(false);
        setShowSuccessModal(true);
        resetForm();
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement ou de la mise à jour du colis :", error);
      setErrorMessage("Une erreur s'est produite lors du traitement. Veuillez réessayer.");
      setShowUserDataErrorCard(true);
    } finally {
      setLoading(false);
    }
  };

  const defaultValues = (label: string): string => {
    switch (label) {
      case "Full Name":
        return `${user?.firstName ?? ""} ${user?.lastName ?? ""}`;
      case "Username":
        return `${user?.username ?? ""}`;
      case "Owner Id":
        return `${user?.id ?? ""}`;
      case "Email Adress":
        return `${user?.emailAddresses?.[0]?.emailAddress ?? ""}`;
      case "Tracking Number":
        return "";
      case "Category":
        return "Standard";
      case "Status":
        return "Recu📦";
      case "Destination":
        return "Cap-haitien";
      case "Phone":
        return "inconnu";
      default:
        return "";
    }
  };

  return (
    <div className="">
      <div className="px-10 md:px-20 py-10">
        <div className="flex justify-between">
          <h2 className="font-bold text-4xl">Ajouter un nouveau colis</h2>
          <Link to="/admin/all-users">
            <Button text="Liste Utilisateurs" />
          </Link>
        </div>
        <form onSubmit={onFormSubmit} className="p-10 border rounded-xl mt-10">
          <h2 className="font-medium text-xl mb-6">Détails du colis</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {shipmentDetails.shipmentDetails.map(
              (item: ShipmentFormItem, index: number) => (
                <div
                  key={index}
                  className={`${
                    item.fieldType == "textarea" &&
                    "my-custom-breakpoint:col-span-2"
                  }`}
                >
                  <label className="flex gap-2 items-center text-gray-700 font-medium">
                    <IconField icon={item.icon} />
                    {item.label}
                    {item.required && <span className="text-red-500">*</span>}
                  </label>
                  {item.fieldType === "text" || item.fieldType === "number" ? (
                    <InputField
                      handleInputChange={handleInputChange}
                      defaultValue={defaultValues(item.label)}
                      item={item}
                    />
                  ) : (
                    item.fieldType === "dropdown" && (
                      <DropdownField
                        defaultValue={defaultValues(item.label)}
                        item={{
                          ...item,
                          options: item.options || [],
                        }}
                        handleInputChange={handleInputChange}
                      />
                    )
                  )}
                </div>
              )
            )}
          </div>
          <div className="my-6 h-px bg-gray-200" />
          <div className="mt-6 flex justify-center">
            <button
              type="submit"
              className={`px-6 py-3 text-lg rounded-lg text-white transition cursor-pointer flex items-center gap-2 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader />
                  <span>Traitement en cours...</span>
                </>
              ) : (
                "Enregistrer le colis"
              )}
            </button>
          </div>
        </form>
      </div>
      {showSuccessModal && (
        <ShipmentSuccessModal
          isTransfer={isTransfer}
          shipmentData={isTransfer ? updatedShipmentData : formData}
          onClose={() => {
            setShowSuccessModal(false);
            navigate('/admin/all-users');
          }}
        />
      )}
      {showErrorCard && existingShipment && (
        <ShipmentErrorCard
          existingShipment={existingShipment}
          onClose={() => setShowErrorCard(false)}
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

export default AddShipment;