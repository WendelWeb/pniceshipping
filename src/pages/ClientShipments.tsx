import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Package, Search, ChevronDown, Calendar, MapPin, DollarSign, 
  Truck, Download, AlertCircle, Clock, CheckCircle, ArrowLeft, RefreshCw, 
} from "lucide-react";
import { findByOwnerId } from "@/utils/shipmentQueries";
import { Shipment } from "@/types/shipment"; // Import correct Shipment
import { getShippingRate, SERVICE_FEE } from "../constants/shippingRates";

// Interface pour les options de tri
interface SortOption {
  label: string;
  value: string;
  sortFn: (a: Shipment, b: Shipment) => number;
}

// Options de tri disponibles
const SORT_OPTIONS: SortOption[] = [
  { 
    label: "Numéro de suivi (A-Z)", 
    value: "tracking_asc", 
    sortFn: (a, b) => a.trackingNumber.localeCompare(b.trackingNumber) 
  },
  { 
    label: "Numéro de suivi (Z-A)", 
    value: "tracking_desc", 
    sortFn: (a, b) => b.trackingNumber.localeCompare(a.trackingNumber) 
  },
  { 
    label: "Poids (Croissant)", 
    value: "weight_asc", 
    sortFn: (a, b) => parseFloat(a.weight) - parseFloat(b.weight) 
  },
  { 
    label: "Poids (Décroissant)", 
    value: "weight_desc", 
    sortFn: (a, b) => parseFloat(b.weight) - parseFloat(a.weight) 
  },
  { 
    label: "Date estimée (Plus récente)", 
    value: "delivery_newest", 
    sortFn: (a, b) => new Date(b.estimatedDelivery).getTime() - new Date(a.estimatedDelivery).getTime() 
  },
  { 
    label: "Date estimée (Plus ancienne)", 
    value: "delivery_oldest", 
    sortFn: (a, b) => new Date(a.estimatedDelivery).getTime() - new Date(b.estimatedDelivery).getTime() 
  },
];

// Statuts avec icônes pour l'affichage
const STATUS_ICONS: Record<string, React.ReactElement> = {
  "Recu📦": <Package className="h-5 w-5 text-blue-500" />,
  "En Transit✈️": <Truck className="h-5 w-5 text-yellow-500" />,
  "Disponible🟢": <CheckCircle className="h-5 w-5 text-green-500" />,
  "Livré✅": <CheckCircle className="h-5 w-5 text-purple-500" />,
};

const ClientShipments: React.FC = () => {
  const { id: userId } = useParams<{ userId: string }>(); 
  const navigate = useNavigate();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [userName, setUserName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortOption, setSortOption] = useState<string>("tracking_asc");
  const [expandedShipment, setExpandedShipment] = useState<number | null>(null);

  // Valider userId et charger les colis
  useEffect(() => {
    const fetchShipments = async () => {
      if (!userId || userId.trim() === "") {
        console.warn("userId is undefined or empty");
        setError("ID utilisateur manquant ou invalide. Veuillez revenir à la liste des utilisateurs.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log("Fetching shipments for userId:", userId);
        const data = await findByOwnerId(userId);
        console.log("API response:", data);

        if (!Array.isArray(data)) {
          throw new Error("La réponse de la base de données n'est pas un tableau de colis.");
        }

        setShipments(data); // TS2345 fixed by using correct Shipment
        setUserName(data.length > 0 ? data[0].fullName : "Utilisateur inconnu");
        setError(null);
      } catch (err: any) {
        console.error("Error fetching shipments:", err);
        const errorMessage = err.message.includes("Failed to fetch")
          ? "Impossible de se connecter au serveur. Veuillez vérifier votre connexion ou réessayer plus tard."
          : err.message || "Erreur lors du chargement des colis. Veuillez réessayer.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchShipments();
  }, [userId]);

  // Calculer le coût d'un colis
  const calculateCost = (shipment: Shipment): number => {
    const weight = parseFloat(shipment.weight) || 0;
    const rate = getShippingRate(shipment.destination);
    return SERVICE_FEE + weight * rate;
  };

  // Calculer les statistiques des colis
  const shipmentStats = useMemo(() => ({
    total: shipments.length,
    received: shipments.filter((s) => s.status === "Recu📦").length,
    inTransit: shipments.filter((s) => s.status === "En Transit✈️").length,
    available: shipments.filter((s) => s.status === "Disponible🟢").length,
    delivered: shipments.filter((s) => s.status === "Livré✅").length,
    totalCost: shipments.reduce((sum, s) => sum + calculateCost(s), 0).toFixed(2),
  }), [shipments]);

  // Filtrer et trier les colis
  const filteredShipments = useMemo(() => {
    const filtered = shipments.filter((shipment) =>
      [shipment.trackingNumber, shipment.fullName, shipment.destination]
        .some((field) => field.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const sortFn = SORT_OPTIONS.find((opt) => opt.value === sortOption)?.sortFn;
    return sortFn ? [...filtered].sort(sortFn) : filtered;
  }, [shipments, searchTerm, sortOption]);

  // Exporter les colis en CSV
  const exportToCSV = () => {
    const headers = ["Numéro de suivi", "Poids", "Statut", "Destination", "Coût", "Date estimée"];
    const rows = filteredShipments.map((s) => [
      s.trackingNumber,
      s.weight,
      s.status,
      s.destination,
      calculateCost(s).toFixed(2),
      new Date(s.estimatedDelivery).toLocaleDateString("fr-FR"),
    ]);
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `colis_${userName || userId || "unknown"}.csv`; // Fix TS2304
    link.click();
  };

  // Rafraîchir les données
  const refreshShipments = async () => {
    if (!userId) return; // Fix TS2304
    try {
      setLoading(true);
      const data = await findByOwnerId(userId); // Fix TS2304
      if (!Array.isArray(data)) {
        throw new Error("La réponse de la base de données n'est pas un tableau de colis.");
      }
      setShipments(data); // TS2345 fixed by using correct Shipment
      setUserName(data.length > 0 ? data[0].fullName : "Utilisateur inconnu");
      setError(null);
    } catch (err: any) {
      setError(err.message || "Erreur lors du rafraîchissement des colis.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      {/* En-tête */}
      <div className="mb-8">
        <button
          className="flex items-center text-blue-600 hover:text-blue-800 mb-4 transition"
          onClick={() => navigate("/admin/all-users")}
        >
          <ArrowLeft className="h-5 w-5 mr-2" /> Retour à la liste des utilisateurs
        </button>
        <h1 className="text-3xl font-bold text-blue-600 mb-2 flex items-center">
          <Package className="h-8 w-8 mr-2" />
          <span className="relative group">
            Colis de {userName || "Chargement..."}
            {userId && (
              <span className="absolute left-0 -bottom-8 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2">
                ID: {userId}
              </span>
            )}
          </span>
        </h1>
        <p className="text-gray-600">Visualisez et gérez les colis associés à cet utilisateur.</p>
      </div>

      {/* Résumé des statistiques */}
      {!loading && !error && shipments.length > 0 && (
        <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm flex items-center">
            <Package className="h-6 w-6 text-blue-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Total colis</p>
              <p className="text-lg font-bold">{shipmentStats.total}</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm flex items-center">
            <Package className="h-6 w-6 text-blue-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Reçus</p>
              <p className="text-lg font-bold">{shipmentStats.received}</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm flex items-center">
            <Truck className="h-6 w-6 text-yellow-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600">En transit</p>
              <p className="text-lg font-bold">{shipmentStats.inTransit}</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm flex items-center">
            <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Disponibles</p>
              <p className="text-lg font-bold">{shipmentStats.available}</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm flex items-center">
            <CheckCircle className="h-6 w-6 text-purple-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Livrés</p>
              <p className="text-lg font-bold">{shipmentStats.delivered}</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm flex items-center">
            <DollarSign className="h-6 w-6 text-green-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Coût total</p>
              <p className="text-lg font-bold">{shipmentStats.totalCost} $</p>
            </div>
          </div>
        </div>
      )}

      {/* Barre de recherche et tri */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full md:w-2/3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Rechercher par numéro de suivi, nom ou destination..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative w-full md:w-1/3">
          <select
            className="w-full py-2 pl-3 pr-10 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* Boutons d'action */}
      <div className="mb-6 flex gap-4">
        <button
          className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          onClick={exportToCSV}
          disabled={shipments.length === 0 || !!error}
        >
          <Download className="h-5 w-5 mr-2" /> Exporter en CSV
        </button>
        <button
          className="flex items-center bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          onClick={refreshShipments}
          disabled={loading || !userId}
        >
          <RefreshCw className={`h-5 w-5 mr-2 ${loading ? "animate-spin" : ""}`} /> Rafraîchir
        </button>
      </div>

      {/* Liste des colis */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white p-4 rounded-lg shadow-md animate-pulse">
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <div className="h-6 bg-gray-200 rounded"></div>
                <div className="h-6 bg-gray-200 rounded"></div>
                <div className="h-6 bg-gray-200 rounded"></div>
                <div className="h-6 bg-gray-200 rounded"></div>
                <div className="h-6 bg-gray-200 rounded"></div>
                <div className="h-6 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center text-red-500 flex items-center justify-center p-8 bg-white rounded-lg shadow-md">
          <AlertCircle className="h-6 w-6 mr-2" /> {error}
        </div>
      ) : filteredShipments.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 font-semibold text-gray-700 border-b">
            <div className="flex items-center">Numéro de suivi</div>
            <div className="flex items-center">Poids</div>
            <div className="flex items-center">Statut</div>
            <div className="flex items-center">Destination</div>
            <div className="flex items-center">Coût</div>
            <div className="flex items-center">Date estimée</div>
          </div>
          {filteredShipments.map((shipment) => (
            <div key={shipment.id} className="border-b last:border-b-0">
              <div
                className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 hover:bg-gray-50 cursor-pointer transition"
                onClick={() => setExpandedShipment(expandedShipment === shipment.id ? null : shipment.id)}
              >
                <div className="flex items-center font-medium text-blue-600">
                  {shipment.trackingNumber}
                </div>
                <div className="flex items-center">
                  {shipment.weight} lbs
                </div>
                <div className="flex items-center">
                  {STATUS_ICONS[shipment.status] || <Package className="h-5 w-5" />}
                  <span className="ml-2">{shipment.status}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-gray-500" />
                  {shipment.destination}
                </div>
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-green-500" />
                  {calculateCost(shipment).toFixed(2)} $
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-gray-500" />
                  {new Date(shipment.estimatedDelivery).toLocaleDateString("fr-FR")}
                </div>
              </div>
              {/* Chronologie des statuts */}
              {expandedShipment === shipment.id && (
                <div className="p-4 bg-gray-100">
                  <h4 className="font-semibold text-gray-700 mb-2">Historique des statuts</h4>
                  <div className="space-y-4">
                    {shipment.statusDates.map((status, index) => (
                      <div key={index} className="flex items-start">
                        <div className="flex-shrink-0">
                          <Clock className="h-5 w-5 text-blue-500" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900">
                            {status.status} - {new Date(status.date).toLocaleDateString("fr-FR")}
                          </p>
                          <p className="text-sm text-gray-500">{status.location}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-100 rounded-lg p-8 text-center">
          <h3 className="mt-2 text-lg font-medium text-gray-900">Aucun colis trouvé</h3>
          <p className="mt-1 text-gray-500">
            {userName ? `${userName} n'a aucun colis` : "Cet utilisateur n'a aucun colis"} ou aucun ne correspond à votre recherche.
          </p>
        </div>
      )}
    </div>
  );
};

export default ClientShipments;