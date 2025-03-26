import { useState, useEffect, useRef } from "react";
import { getAllShipments,  } from "../utils/shipmentQueries";
import { Shipment } from "@/types/shipment";
import { getShippingRate } from "@/constants/shippingRates";
import { useNavigate } from "react-router-dom";

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

const CATEGORIES = ["Electronics", "Clothing", "Books", "Furniture", "Other"];

const MarkShipmentAsDelivered = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [selectedShipmentIds, setSelectedShipmentIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTermUsers, setSearchTermUsers] = useState<string>("");
  const [searchTermShipments, setSearchTermShipments] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isUserListOpen, setIsUserListOpen] = useState(false);
  const userSearchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://pniceshippingbackend-2.onrender.com/api/users");
        if (!response.ok) throw new Error("Échec de la récupération des utilisateurs");
        const data = await response.json();
        setUsers(data.data);
        setFilteredUsers(data.data);
      } catch (err) {
        console.error(err);
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
    setIsUserListOpen(searchTermUsers.length > 0 && filtered.length > 0);
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

  const handleDeliver = () => {
    if (selectedShipmentIds.length === 0 || !selectedUserId) return;
    const selectedShipments = shipments.filter((s) => selectedShipmentIds.includes(s.id));
    navigate("/admin/confirm-delivery", { state: { selectedShipments, selectedUserId } });
  };

  const filteredShipments = shipments.filter(
    (shipment) =>
      (shipment.trackingNumber.toLowerCase().includes(searchTermShipments.toLowerCase()) ||
        shipment.fullName.toLowerCase().includes(searchTermShipments.toLowerCase()) ||
        shipment.userName.toLowerCase().includes(searchTermShipments.toLowerCase()) ||
        shipment.emailAdress.toLowerCase().includes(searchTermShipments.toLowerCase())) &&
      (selectedCategory ? shipment.category === selectedCategory : true)
  );

  return (
    <div className="bg-gradient-to-br from-gray-100 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto p-6">
        <header className="mb-8">
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">
            Marquer comme Livré
          </h2>
          <p className="text-gray-600 mt-2 text-lg">Sélectionnez vos colis avec élégance</p>
        </header>

        {/* Sélection des utilisateurs */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recherche par nom */}
          <div className="relative" ref={userSearchRef}>
            <label className="block text-gray-700 font-medium mb-2">Rechercher un utilisateur :</label>
            <input
              type="text"
              placeholder="Nom, username ou email..."
              value={searchTermUsers}
              onChange={(e) => setSearchTermUsers(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
            />
            <svg
              className="absolute left-4 top-10 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {isUserListOpen && (
              <div className="absolute z-10 mt-2 w-full bg-white rounded-lg shadow-xl max-h-96 overflow-y-auto animate-slide-down">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => {
                      setSelectedUserId(user.id);
                      setSearchTermUsers("");
                      setIsUserListOpen(false);
                    }}
                    className="p-4 border-b border-gray-100 hover:bg-indigo-50 cursor-pointer transition-all duration-200"
                  >
                    <div className="flex items-center gap-4">
                      {user.imageUrl ? (
                        <img src={user.imageUrl} alt={`${user.firstName}`} className="w-12 h-12 rounded-full object-cover shadow-sm" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                          <svg className="h-6 w-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      )}
                      <div>
                        <p className="text-lg font-semibold text-gray-800">{user.firstName} {user.lastName}</p>
                        <p className="text-sm text-gray-600">@{user.username}</p>
                        <p className="text-sm text-gray-500">{user.emailAddresses[0]?.emailAddress}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Liste déroulante */}
          <div className="relative">
            <label className="block text-gray-700 font-medium mb-2">Sélectionner un utilisateur :</label>
            <select
              value={selectedUserId || ""}
              onChange={(e) => setSelectedUserId(e.target.value || null)}
              className="w-full pl-12 pr-10 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none transition-all duration-300"
            >
              <option value="">-- Choisir un utilisateur --</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.firstName} {user.lastName} (@{user.username})
                </option>
              ))}
            </select>
            <svg
              className="absolute left-4 top-10 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <svg
              className="absolute right-4 top-10 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Recherche et filtrage des colis */}
        {selectedUserId && (
          <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="relative w-full md:w-1/3">
              <input
                type="text"
                placeholder="Tracking, nom, username, email..."
                value={searchTermShipments}
                onChange={(e) => setSearchTermShipments(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
              />
              <svg
                className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div className="relative w-full md:w-1/3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-12 pr-10 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none transition-all duration-300"
              >
                <option value="">Toutes les catégories</option>
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <svg
                className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7m-9-4v4m0 0H7m5 0h5" />
              </svg>
            </div>
            <button
              onClick={handleDeliver}
              disabled={selectedShipmentIds.length === 0}
              className={`px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 transition-all duration-300 ${
                selectedShipmentIds.length === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:from-indigo-700 hover:to-blue-700 hover:shadow-xl"
              }`}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              Livrer ({selectedShipmentIds.length})
            </button>
          </div>
        )}

        {/* Affichage des colis */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : !selectedUserId ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-lg text-gray-500 animate-pulse">Sélectionnez un utilisateur...</p>
          </div>
        ) : filteredShipments.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-lg text-gray-500">Aucun colis disponible.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredShipments.map((shipment) => {
              const shippingRate = getShippingRate(shipment.destination);
              const cost = parseFloat(shipment.weight) * shippingRate;
              return (
                <div
                  key={shipment.id}
                  className={`bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 ${
                    selectedShipmentIds.includes(shipment.id) ? "ring-2 ring-indigo-500" : ""
                  }`}
                >
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-500 px-4 py-3 text-white rounded-t-lg flex justify-between items-center">
                    <h3 className="font-semibold text-lg">#{shipment.trackingNumber}</h3>
                    <span className="bg-green-200 text-green-800 text-xs px-2 py-1 rounded-full">Disponible</span>
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedShipmentIds.includes(shipment.id)}
                        onChange={() => handleSelectShipment(shipment.id)}
                        className="mr-2 h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <p className="text-gray-800 font-semibold">{shipment.fullName}</p>
                    </div>
                    <p className="text-sm text-gray-600 flex items-center">
                      <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      @{shipment.userName}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center">
                      <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {shipment.emailAdress}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center">
                      <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      {shipment.destination}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center">
                      <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7m-9-4v4m0 0H7m5 0h5" />
                      </svg>
                      {shipment.category}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center">
                      <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2" />
                      </svg>
                      {shipment.weight} lbs
                    </p>
                    <p className="text-sm text-gray-600 flex items-center">
                      <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2-1.343-2-3-2zm0 8c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
                      </svg>
                      Coût : ${cost.toFixed(2)} (${shippingRate}/lbs)
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <style >{`
          @keyframes slideDown {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-slide-down {
            animation: slideDown 0.3s ease-out;
          }
        `}</style>
      </div>
    </div>
  );
};

export default MarkShipmentAsDelivered;