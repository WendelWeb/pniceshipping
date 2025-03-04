import { useState, useEffect } from "react";
import {
  getAllShipments,
  updateShipmentStatus,
  updateShipmentWeight,
} from "../utils/shipmentQueries";
import { sendConfirmedEmail } from "../services/emailServices";
import { Shipment } from "@/types/shipment";

const MarkShipmentAsConfirmed = () => {
  const [shipments, setShipments] = useState<Shipment[]>([]); // Typage explicite
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(
    null
  ); // Typage explicite
  const [weight, setWeight] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [weightErrors, setWeightErrors] = useState<Record<string, boolean>>({}); // Typage explicite
  const [updatingShipments, setUpdatingShipments] = useState<
    Record<string, boolean>
  >({}); // Typage explicite

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
    // Typage explicite
    const shipment = shipments.find((s) => s.trackingNumber === trackingNumber);
    if (!shipment?.weight) {
      setWeightErrors((prev) => ({ ...prev, [trackingNumber]: true }));
      if (shipment) handleEditShipment(shipment);
      return;
    }

    try {
      setUpdatingShipments((prev) => ({ ...prev, [trackingNumber]: true }));
      await updateShipmentStatus(trackingNumber, "Recu📦", "Confirmation de reception du colis dans notre entrepot a Pnice Miami, FL Warehouse");
      setShipments((prev) =>
        prev.filter((s) => s.trackingNumber !== trackingNumber)
      );
      await sendConfirmedEmail(
        `${shipment.fullName},`,
        `${shipment.emailAdress}`,
        `${shipment.trackingNumber}`
      );
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
    // Typage explicite
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
        weight: parseFloat(weight).toString(), // Conversion en string pour correspondre à Shipment
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

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto p-6">
        <header className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            Confirmation des colis
          </h2>
          <p className="text-gray-600 mt-2">
            Gérez et confirmez les colis en attente
          </p>
        </header>

        <div className="mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <div className="text-gray-600">
            {filteredShipments.length} colis en attente
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredShipments.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <p className="mt-4 text-lg text-gray-500">
              {searchTerm
                ? "Aucun résultat trouvé pour votre recherche."
                : "Aucun colis en attente de confirmation."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredShipments.map((shipment) => (
              <div
                key={shipment.trackingNumber}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="bg-blue-500 px-4 py-2 text-white flex justify-between items-center">
                  <h3 className="font-medium">#{shipment.trackingNumber}</h3>
                  <span className="bg-yellow-400 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">
                    En attente
                  </span>
                </div>
                <div className="p-4">
                  <div className="mb-4 space-y-2">
                    <div className="flex items-center">
                      <svg
                        className="h-5 w-5 text-gray-500 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <p className="text-gray-700">{shipment.userName}</p>
                    </div>
                    <div className="flex items-center">
                      <svg
                        className="h-5 w-5 text-gray-500 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="text-gray-700 text-sm">
                        {shipment.emailAdress}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <svg
                        className="h-5 w-5 text-gray-500 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2M6 7H3m15 0h3M6 7H3m15 0h3"
                        />
                      </svg>
                      {shipment.weight ? (
                        <p className="text-gray-700">{shipment.weight} kg</p>
                      ) : (
                        <p className="text-red-500 font-medium text-sm">
                          Poids requis avant confirmation
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="mt-6 flex gap-2">
                    <button
                      onClick={() => confirmShipment(shipment.trackingNumber)}
                      disabled={
                        !shipment.weight ||
                        updatingShipments[shipment.trackingNumber]
                      }
                      className={`flex-1 px-4 py-2 rounded-md transition-colors duration-200 flex items-center justify-center gap-2 ${
                        shipment.weight &&
                        !updatingShipments[shipment.trackingNumber]
                          ? "bg-green-600 text-white hover:bg-green-700"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      {updatingShipments[shipment.trackingNumber] ? (
                        <div className="animate-spin h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></div>
                      ) : (
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                      Confirmer
                    </button>
                    <button
                      onClick={() => handleEditShipment(shipment)}
                      disabled={updatingShipments[shipment.trackingNumber]}
                      className={`flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2 ${
                        !shipment.weight ? "animate-pulse" : ""
                      } ${
                        updatingShipments[shipment.trackingNumber]
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      {!shipment.weight ? "Ajouter poids" : "Modifier poids"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  {selectedShipment?.weight
                    ? `Modifier le poids du colis #${selectedShipment?.trackingNumber}`
                    : `Ajouter le poids du colis #${selectedShipment?.trackingNumber}`}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  disabled={updatingShipments[selectedShipment!.trackingNumber]}
                  className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="weight">
                    Poids (kg) <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="weight"
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                      selectedShipment &&
                      weightErrors[selectedShipment.trackingNumber]
                        ? "border-red-500"
                        : ""
                    }`}
                    placeholder="Entrez le poids"
                    step="0.1"
                    min="0"
                    disabled={
                      !!selectedShipment &&
                      updatingShipments[selectedShipment.trackingNumber]
                    }
                  />
                  {selectedShipment &&
                    weightErrors[selectedShipment.trackingNumber] && (
                      <p className="text-red-500 text-sm mt-1">
                        Le poids est obligatoire pour confirmer ce colis
                      </p>
                    )}
                </div>

                <div className="flex justify-between gap-4 mt-6">
                  <button
                    onClick={() => setShowModal(false)}
                    disabled={!!selectedShipment && updatingShipments[selectedShipment.trackingNumber]}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200 flex-1 disabled:opacity-50"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleUpdateShipment}
                    disabled={!!selectedShipment && updatingShipments[selectedShipment.trackingNumber]}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 flex-1 disabled:opacity-50 flex items-center justify-center"
                  >
                    {selectedShipment && updatingShipments[selectedShipment.trackingNumber] ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-t-2 border-b-2 border-white rounded-full mr-2"></div>
                        Enregistrement...
                      </>
                    ) : (
                      "Enregistrer"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarkShipmentAsConfirmed;
