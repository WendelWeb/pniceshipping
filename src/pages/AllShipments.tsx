import { useState, useEffect } from "react";
import { getAllShipments } from "@/utils/shipmentQueries";
import { Package, MapPin, Barcode, User, Mail, Calendar, Clock, Search } from "lucide-react";
import { Shipment, StatusDates } from "@/types/shipment";





const statusColors: Record<string, { bg: string; badge: string }> = {
  "Recu📦": { bg: "bg-blue-100", badge: "bg-blue-500" },
  "En Transit✈️": { bg: "bg-yellow-100", badge: "bg-yellow-500" },
  "Disponible🟢": { bg: "bg-green-100", badge: "bg-green-500" },
  "Livré✅": { bg: "bg-gray-200", badge: "bg-gray-500" },
};

// Fonction pour récupérer la date de réception
const getReceptionDate = (statusDates: StatusDates[]): string => {
  return statusDates?.length > 0 ? statusDates[0].date : "Non disponible";
};

const AllShipments = () => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const data = await getAllShipments();
        console.log(data);
  
        // Transformation des données pour correspondre au type Shipment
        const formattedData: Shipment[] = data.map((item) => ({
          id: item.id,
          ownerId: item.ownerId,
          fullName: item.fullName,
          userName: item.userName,
          category: item.category,
          emailAdress: item.emailAdress,
          trackingNumber: item.trackingNumber,
          weight: item.weight,
          status: item.status,
          destination: item.destination,
          estimatedDelivery: item.estimatedDelivery,
          statusDates: item.statusDates as StatusDates[] || null, // Assertion ou valeur par défaut
          phone: item.phone || "Non disponible", // Valeur par défaut si phone est absent
        }));
  
        setShipments(formattedData);
      } catch (err) {
        console.error("Erreur lors du chargement des colis", err);
      }
    };
  
    fetchShipments();
  }, []);
  const filteredShipments = shipments.filter(
    (shipment) =>
      (shipment.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shipment.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterStatus ? shipment.status === filterStatus : true)
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">📦 Tous les Colis</h1>

      {/* Barre de recherche et filtre */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Rechercher par nom ou numéro de suivi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="relative">
          <select
            className="block w-full py-2 pl-3 pr-8 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">📋 Tous les statuts</option>
            <option value="Recu📦">📦 Reçu</option>
            <option value="En Transit✈️">✈️ En Transit</option>
            <option value="Disponible🟢">🟢 Disponible</option>
            <option value="Livré✅">✅ Livré</option>
          </select>
        </div>
      </div>

      {filteredShipments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredShipments.map((shipment) => (
            <div
              key={shipment.id}
              className={`shadow-md rounded-lg p-6 border-l-4 transition hover:shadow-lg ${statusColors[shipment.status]?.bg} border-${statusColors[shipment.status]?.badge}`}
            >
              {/* En-tête */}
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">{shipment.fullName}</h2>
                <div
                  className={`text-white px-3 py-1 rounded-full text-xs font-semibold ${statusColors[shipment.status]?.badge}`}
                >
                  {shipment.status}
                </div>
              </div>

              {/* Infos Expéditeur */}
              <div className="text-gray-700 mt-3 text-sm">
                <div className="flex items-center mb-2">
                  <User className="h-5 w-5 text-blue-600 mr-2" />
                  <span>@{shipment.userName}</span>
                </div>
                <div className="flex items-center mb-2">
                  <Mail className="h-5 w-5 text-blue-600 mr-2" />
                  <span>{shipment.emailAdress}</span>
                </div>
                {/* <div className="flex items-center mb-2">
                  <Phone className="h-5 w-5 text-blue-600 mr-2" />
                  <span>{shipment.phone}</span>
                </div> */}
              </div>

              {/* Infos Colis */}
              <div className="text-gray-700 mt-3 text-sm">
                <div className="flex items-center mb-2">
                  <Barcode className="h-5 w-5 text-blue-600 mr-2" />
                  <span>{shipment.trackingNumber}</span>
                </div>
                <div className="flex items-center mb-2">
                  <MapPin className="h-5 w-5 text-blue-600 mr-2" />
                  <span>Destination: {shipment.destination}</span>
                </div>
                <div className="flex items-center mb-2">
                  <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                  <span>Commande reçue le: {getReceptionDate(shipment.statusDates)}</span>
                </div>
                <div className="flex items-center mb-2">
                  <Clock className="h-5 w-5 text-blue-600 mr-2" />
                  <span>Livraison estimée: {shipment.estimatedDelivery}</span>
                </div>
                <div className="flex items-center mb-2">
                  <Package className="h-5 w-5 text-blue-600 mr-2" />
                  <span>Poids: {shipment.weight}</span>
                </div>
              </div>

              {/* Historique des statuts */}
              <div className="mt-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Historique des statuts :</h3>
                <ul className="text-xs text-gray-600 space-y-1">
                 {shipment.statusDates?.map((entry, index) => (
                    <li key={index} className="flex justify-between border-b py-1">
                      <span>{entry.date} - {entry.status}</span>
                      <span className="italic">{entry.location}</span>
                    </li> 
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Aucun colis trouvé.</p>
      )}
    </div>
  );
};

export default AllShipments;
