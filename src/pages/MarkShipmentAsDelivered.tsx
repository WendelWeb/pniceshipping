import { useState, useEffect } from "react";
import { getAllShipments, markMultipleShipmentsAsDelivered } from "../utils/shipmentQueries";
import { sendDeliveredEmail } from "../services/emailServices";
import { Shipment } from "@/types/shipment";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  emailAddresses: { emailAddress: string }[];
  imageUrl?: string;
  phoneNumbers: string[];
  createdAt: string;
  lastActiveAt: string;
  banned: boolean;
  twoFactorEnabled: boolean;
}

interface DeliverySuccess {
  batchId: number;
  totalCost: number;
  deliveredShipments: Shipment[];
}

const MarkShipmentAsDelivered = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [selectedShipmentIds, setSelectedShipmentIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDelivering, setIsDelivering] = useState(false);
  const [searchTermUsers, setSearchTermUsers] = useState<string>("");
  const [searchTermShipments, setSearchTermShipments] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<DeliverySuccess | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("https://pniceshippingbackend-2.onrender.com/api/users");
        if (!response.ok) throw new Error("Échec de la récupération des utilisateurs");
        const data = await response.json();
        setUsers(data.data);
        setFilteredUsers(data.data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        `${user.firstName} ${user.lastName}`
          .toLowerCase()
          .includes(searchTermUsers.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTermUsers.toLowerCase()) ||
        user.emailAddresses.some((email) =>
          email.emailAddress.toLowerCase().includes(searchTermUsers.toLowerCase())
        )
    );
    setFilteredUsers(filtered);
  }, [searchTermUsers, users]);

  useEffect(() => {
    if (!selectedUserId) return;
    const fetchAvailableShipments = async () => {
      try {
        setLoading(true);
        const results = await getAllShipments();
        const userShipments = results
          .filter(
            (shipment) =>
              shipment.ownerId === selectedUserId && shipment.status === "Disponible🟢"
          )
          .map((shipment) => ({
            ...shipment,
            statusDates: Array.isArray(shipment.statusDates) ? shipment.statusDates : [],
          })) as Shipment[];
        setShipments(userShipments);
      } catch (error) {
        console.error("Erreur lors de la récupération des colis disponibles:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAvailableShipments();
  }, [selectedUserId]);

  const handleSelectShipment = (id: number) => {
    setSelectedShipmentIds((prev) =>
      prev.includes(id) ? prev.filter((sId) => sId !== id) : [...prev, id]
    );
  };

  const markAsDelivered = async () => {
    if (selectedShipmentIds.length === 0 || !selectedUserId) return;

    try {
      setIsDelivering(true);
      const { batchId, totalCost, deliveredShipments } = await markMultipleShipmentsAsDelivered(
        selectedShipmentIds,
        selectedUserId
      );

      for (const shipment of deliveredShipments) {
        const user = users.find((u) => u.id === selectedUserId);
        if (user && user.emailAddresses.length > 0) {
          await sendDeliveredEmail(
            shipment.fullName,
            user.emailAddresses[0].emailAddress,
            shipment.trackingNumber
          );
        }
      }

      setShipments((prev) => prev.filter((s) => !selectedShipmentIds.includes(s.id)));
      setSelectedShipmentIds([]);
      setSuccessMessage({ batchId, totalCost, deliveredShipments });
    } catch (error) {
      console.error("Erreur lors de la livraison multiple:", error);
      setError("Une erreur s'est produite lors de la livraison.");
    } finally {
      setIsDelivering(false);
    }
  };

  const filteredShipments = shipments.filter(
    (shipment) =>
      shipment.trackingNumber.toLowerCase().includes(searchTermShipments.toLowerCase()) ||
      shipment.userName.toLowerCase().includes(searchTermShipments.toLowerCase()) ||
      shipment.emailAdress.toLowerCase().includes(searchTermShipments.toLowerCase())
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto p-6">
        <header className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Marquer comme Livré</h2>
          <p className="text-gray-600 mt-2">Sélectionnez un utilisateur pour livrer ses colis</p>
        </header>

        {/* Message de succès */}
        {successMessage && (
          <div className="mb-6 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg shadow-md">
            <div className="flex items-center">
              <svg
                className="h-6 w-6 mr-2"
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
              <h3 className="text-lg font-semibold">Livraison réussie !</h3>
            </div>
            <p className="mt-2">Les colis suivants ont été livrés dans le lot #{successMessage.batchId} :</p>
            <div className="mt-4 space-y-4">
              {successMessage.deliveredShipments.map((shipment) => (
                <div key={shipment.id} className="bg-white p-4 rounded-lg shadow-sm">
                  <p><strong>ID :</strong> {shipment.id}</p>
                  <p><strong>Propriétaire :</strong> {shipment.ownerId}</p>
                  <p><strong>Nom complet :</strong> {shipment.fullName}</p>
                  <p><strong>Nom d'utilisateur :</strong> {shipment.userName}</p>
                  <p><strong>Catégorie :</strong> {shipment.category}</p>
                  <p><strong>Email :</strong> {shipment.emailAdress}</p>
                  <p><strong>Numéro de suivi :</strong> {shipment.trackingNumber}</p>
                  <p><strong>Poids :</strong> {shipment.weight} lbs</p>
                  <p><strong>Statut :</strong> {shipment.status}</p>
                  <p><strong>Destination :</strong> {shipment.destination}</p>
                  <p><strong>Livraison estimée :</strong> {shipment.estimatedDelivery}</p>
                  <p><strong>Téléphone :</strong> {shipment.phone || "Non spécifié"}</p>
                  <p><strong>Historique des statuts :</strong></p>
                  <ul className="list-disc list-inside ml-4">
                    {shipment.statusDates?.map((status, index) => (
                      <li key={index}>
                        {status.date} - {status.status} ({status.location})
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <p><strong>Poids total :</strong> {successMessage.deliveredShipments.reduce((sum, s) => sum + parseFloat(s.weight), 0).toFixed(2)} lbs</p>
              <p><strong>Coût total :</strong> ${successMessage.totalCost.toFixed(2)}</p>
            </div>
            <button
              onClick={() => setSuccessMessage(null)}
              className="mt-4 text-sm text-green-600 hover:underline"
            >
              Fermer
            </button>
          </div>
        )}

        {/* Liste déroulante des utilisateurs */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Rechercher et sélectionner un utilisateur :
          </label>
          <div className="relative mb-4 w-full md:w-1/2">
            <input
              type="text"
              placeholder="Rechercher par nom, username ou email..."
              value={searchTermUsers}
              onChange={(e) => setSearchTermUsers(e.target.value)}
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
          <div className="relative">
            <select
              value={selectedUserId || ""}
              onChange={(e) => setSelectedUserId(e.target.value || null)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none"
            >
              <option value="">-- Choisir un utilisateur --</option>
              {filteredUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.firstName} {user.lastName} (@{user.username})
                </option>
              ))}
            </select>
            <svg
              className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>

          {selectedUserId && (
            <div className="mt-4 bg-white p-4 rounded-lg shadow-md flex items-center gap-4">
              {users.find((u) => u.id === selectedUserId)?.imageUrl ? (
                <img
                  src={users.find((u) => u.id === selectedUserId)?.imageUrl}
                  alt={`${users.find((u) => u.id === selectedUserId)?.firstName} ${users.find((u) => u.id === selectedUserId)?.lastName}`}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                  <svg
                    className="h-6 w-6 text-gray-500"
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
                </div>
              )}
              <div>
                <p className="text-lg font-semibold text-gray-800">
                  {users.find((u) => u.id === selectedUserId)?.firstName}{" "}
                  {users.find((u) => u.id === selectedUserId)?.lastName}
                </p>
                <p className="text-gray-600">
                  @{users.find((u) => u.id === selectedUserId)?.username}
                </p>
                <p className="text-gray-600">
                  {users.find((u) => u.id === selectedUserId)?.emailAddresses[0]?.emailAddress || "Aucune adresse email"}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Barre de recherche et bouton de livraison */}
        {selectedUserId && (
          <div className="mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Rechercher parmi les colis..."
                value={searchTermShipments}
                onChange={(e) => setSearchTermShipments(e.target.value)}
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
            <div className="flex items-center gap-4">
              <span className="text-gray-600">{filteredShipments.length} colis disponibles</span>
              <button
                onClick={markAsDelivered}
                disabled={isDelivering || selectedShipmentIds.length === 0}
                className={`px-4 py-2 rounded-md transition-colors duration-200 flex items-center justify-center gap-2 ${
                  isDelivering || selectedShipmentIds.length === 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
              >
                {isDelivering ? (
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
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                )}
                Livrer les sélectionnés ({selectedShipmentIds.length})
              </button>
            </div>
          </div>
        )}

        {/* Affichage des colis */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 p-4 rounded-lg text-center text-red-700">{error}</div>
        ) : !selectedUserId ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-lg text-gray-500">Veuillez sélectionner un utilisateur pour voir ses colis.</p>
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
              {searchTermShipments ? "Aucun résultat trouvé pour votre recherche." : "Aucun colis disponible pour cet utilisateur."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredShipments.map((shipment) => (
              <div
                key={shipment.id}
                className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 ${
                  selectedShipmentIds.includes(shipment.id) ? "border-2 border-indigo-500" : ""
                }`}
              >
                <div className="bg-blue-500 px-4 py-2 text-white flex justify-between items-center">
                  <h3 className="font-medium">#{shipment.trackingNumber}</h3>
                  <span className="bg-green-400 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                    Disponible
                  </span>
                </div>
                <div className="p-4">
                  <div className="mb-4 space-y-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedShipmentIds.includes(shipment.id)}
                        onChange={() => handleSelectShipment(shipment.id)}
                        className="mr-2 h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
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
                      <p className="text-gray-700 text-sm">{shipment.emailAdress}</p>
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
                      <p className="text-gray-700">{shipment.weight} lbs</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MarkShipmentAsDelivered;