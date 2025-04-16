import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { shipmentListing } from "../../../configs/schema.ts";
import { db } from "../../../configs/index.ts";
import { useUserContext } from "@/contexts/UserContext.tsx";
import shipmentDetails from "../../assets/shared/shipmentDetails.json";
import InputField from "./InputField.tsx";
import DropdownField from "./DropdownField.tsx";
import IconField from "./IconField.tsx";
import { Link } from "react-router-dom";
import Button from "@/components/Button.tsx";
// Composant Modal de succès
const ShipmentSuccessModal = ({ shipmentData, onClose, }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 5000); // Ferme automatiquement après 5 secondes
        return () => clearTimeout(timer);
    }, [onClose]);
    return (_jsx("div", { className: "fixed inset-0 flex items-center justify-center bg-blue-600 bg-opacity-50 z-50", children: _jsxs("div", { className: "bg-white rounded-lg p-6 w-[350px] shadow-2xl border-l-4 border-green-500 animate-fade-in", children: [_jsxs("div", { className: "flex items-center gap-2 mb-4", children: [_jsx("svg", { className: "w-6 h-6 text-green-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M5 13l4 4L19 7" }) }), _jsx("h3", { className: "text-lg font-semibold", children: "Colis enregistr\u00E9!" })] }), _jsxs("div", { className: "space-y-2 text-sm", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("svg", { className: "w-4 h-4 text-blue-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: [_jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" }), _jsx("circle", { cx: "12", cy: "7", r: "4" })] }), _jsxs("p", { children: [_jsx("span", { className: "font-semibold", children: "Tracking:" }), " ", shipmentData.trackingNumber] })] }), _jsxs("p", { children: [_jsx("span", { className: "font-semibold", children: "Destinataire:" }), " ", shipmentData.fullName] }), _jsxs("p", { children: [_jsx("span", { className: "font-semibold", children: "Email:" }), " ", shipmentData.emailAdress] }), _jsxs("p", { children: [_jsx("span", { className: "font-semibold", children: "Destination:" }), " ", shipmentData.destination] }), _jsxs("p", { children: [_jsx("span", { className: "font-semibold", children: "Statut:" }), " ", shipmentData.status] })] }), _jsx(Link, { to: "/admin/all-users", children: _jsx("button", { onClick: onClose, className: "mt-4 w-full cursor-pointer bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors", children: "Fermer" }) })] }) }));
};
const AddShipment = () => {
    const { user } = useUserContext();
    const [formData, setFormData] = useState({});
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    useEffect(() => {
        const initialFormData = {};
        shipmentDetails.shipmentDetails.forEach((item) => {
            const defaultValue = defaultValues(item.label);
            initialFormData[item.name] =
                item.fieldType === "number"
                    ? parseFloat(defaultValue) || 0
                    : defaultValue;
        });
        setFormData(initialFormData);
    }, []);
    const handleInputChange = (name, value) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    function addDays(date, days) {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result.toISOString().split("T")[0];
    }
    const onFormSubmit = async (e) => {
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
                    location: insertData.status === "Recu📦"
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
        }
        catch (error) {
            console.log(error);
        }
    };
    const defaultValues = (label) => {
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
    return (_jsxs("div", { className: "", children: [_jsxs("div", { className: "px-10 md:px-20 py-10", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("h2", { className: "font-bold text-4xl", children: "Ajouter un nouveau colis" }), _jsx(Link, { to: "/admin/all-users", children: _jsx(Button, { text: "Liste Utilisateurs" }) })] }), _jsxs("form", { onSubmit: onFormSubmit, className: "p-10 border rounded-xl mt-10", children: [_jsx("h2", { className: "font-medium text-xl mb-6", children: "D\u00E9tails du colis" }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4", children: shipmentDetails.shipmentDetails.map((item, index) => (_jsxs("div", { className: `${item.fieldType == "textarea" &&
                                        "my-custom-breakpoint:col-span-2"}`, children: [_jsxs("label", { className: "flex gap-2 items-center text-gray-700 font-medium", children: [_jsx(IconField, { icon: item.icon }), item.label, item.required && _jsx("span", { className: "text-red-500", children: "*" })] }), item.fieldType === "text" || item.fieldType === "number" ? (_jsx(InputField, { handleIputChange: handleInputChange, defaultValue: defaultValues(item.label), item: item })) : (item.fieldType === "dropdown" && (_jsx(DropdownField, { defaultValue: defaultValues(item.label), item: {
                                                ...item,
                                                options: item.options || [],
                                            }, handleInputChange: handleInputChange })))] }, index))) }), _jsx("div", { className: "my-6 h-px bg-gray-200" }), " ", _jsx("div", { className: "mt-6 flex justify-center", children: _jsx("button", { type: "submit", className: "px-6 py-3 text-lg rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition cursor-pointer", children: "Enregistrer le colis" }) })] })] }), showSuccessModal && (_jsx(ShipmentSuccessModal, { shipmentData: formData, user: user, onClose: () => setShowSuccessModal(false) }))] }));
};
export default AddShipment;
