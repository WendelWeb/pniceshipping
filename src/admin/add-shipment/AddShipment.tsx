/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
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

// Composant Modal de succès
const ShipmentSuccessModal = ({
  shipmentData,
  onClose,
}: {
  shipmentData: any;
  user: any;
  onClose: () => void;
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // Ferme automatiquement après 5 secondes
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-blue-600 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-[350px] shadow-2xl border-l-4 border-green-500 animate-fade-in">
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
          <h3 className="text-lg font-semibold">Colis enregistré!</h3>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"
              />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <p>
              <span className="font-semibold">Tracking:</span>{" "}
              {shipmentData.trackingNumber}
            </p>
          </div>
          <p>
            <span className="font-semibold">Destinataire:</span>{" "}
            {shipmentData.fullName}
          </p>
          <p>
            <span className="font-semibold">Email:</span>{" "}
            {shipmentData.emailAdress}
          </p>
          <p>
            <span className="font-semibold">Destination:</span>{" "}
            {shipmentData.destination}
          </p>
          <p>
            <span className="font-semibold">Statut:</span> {shipmentData.status}
          </p>
        </div>
        <Link to="/admin-page/all-users">
          <button
            onClick={onClose}
            className="mt-4 w-full cursor-pointer bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Fermer
          </button>
        </Link>
      </div>
    </div>
  );
};

const AddShipment = () => {
  const { user } = useUserContext();
  const [formData, setFormData] = useState<ShipmentFormData>({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  function addDays(date: Date, days: number): string {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result.toISOString().split("T")[0];
  }

  const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const insertData = {
        fullName: formData.fullName || "",
        userName: formData.userName || "",
        emailAdress: formData.emailAdress || "",
        trackingNumber: formData.trackingNumber || "",
        category: formData.category || "",
        weight: formData.weight?.toString() || "",
        status: formData.status || "",
        ownerId: formData.ownerId || "",
        destination: formData.destination || "",
        estimatedDelivery: addDays(new Date(), 7),
        phone: 'inconu'
      };

      const now = new Date();
      const formattedDate = now.toISOString().split("T")[0];
      const formattedTime = now.toLocaleTimeString("fr-FR", { hour12: false });
      const statusDates = [
        {
          date: `${formattedDate} ${formattedTime}`,
          status: insertData.status,
          location:
            insertData.status === "Recu📦"
              ? "Pnice Miami, FL Warehouse"
              : insertData.status === "Transit✈️"
              ? "En route vers Haiti"
              : insertData.status === "Disponible🟢"
              ? `Coli Disponible au local ${insertData.destination}`
              : insertData.status === "Livré✅" &&
                `Coli Livré au local ${insertData.destination}`,
        },
      ];

      const result = await db
        .insert(shipmentListing)
        .values({ ...insertData, statusDates });

      if (result) {
        setShowSuccessModal(true);
        setFormData({});
      }
    } catch (error) {
      console.log(error);
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
        return ``;
      case "Category":
        return `Standard`;
      case "Status":
        return `Recu📦`;
      case "Destination":
        return `Cap-haitien`;
      default:
        return "Statut inconnu";
    }
  };

  return (
    <div className="">
      <div className="px-10 md:px-20 py-10">
        <div className="flex justify-between">
          <h2 className="font-bold text-4xl">Ajouter un nouveau colis</h2>
          <Link to="/admin-page/all-users">
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
                      handleIputChange={handleInputChange}
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
          <div className="my-6 h-px bg-gray-200" />{" "}
          {/* Separator personnalisé */}
          <div className="mt-6 flex justify-center">
            <button
              type="submit"
              className="px-6 py-3 text-lg rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition cursor-pointer"
            >
              Enregistrer le colis
            </button>
          </div>
        </form>
      </div>
      {showSuccessModal && (
        <ShipmentSuccessModal
          shipmentData={formData}
          user={user}
          onClose={() => setShowSuccessModal(false)}
        />
      )}
    </div>
  );
};

export default AddShipment;
