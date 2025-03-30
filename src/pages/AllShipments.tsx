import { useState, useEffect } from "react";
import { getAllShipments, deleteShipmentById } from "@/utils/shipmentQueries";
import { Package, MapPin, Barcode, User, Mail, Calendar, Clock, Search, Loader2, Trash2, AlertTriangle } from "lucide-react";
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
  const [shipmentToDelete, setShipmentToDelete] = useState<Shipment | null>(null);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Clear messages after 3 seconds
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    if (errorMessage || successMessage) {
      timeoutId = setTimeout(() => {
        setErrorMessage(null);
        setSuccessMessage(null);
      }, 3000);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [errorMessage, successMessage]);

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        setIsLoading(true);
        const data = await getAllShipments();

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
          statusDates: item.statusDates as StatusDates[] || null,
          phone: item.phone || "Non disponible",
        }));

        setShipments(formattedData);
      } catch (err) {
        console.error("Erreur lors du chargement des colis", err);
        setErrorMessage("Impossible de charger les colis. Veuillez réessayer.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchShipments();
  }, []);

  // Mise à jour de la logique de filtrage
  const filteredShipments = shipments.filter(
    (shipment) =>
      (shipment.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shipment.emailAdress.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shipment.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterStatus ? shipment.status === filterStatus : true)
  );

  // Fonction pour gérer la suppression
  const handleDelete = async (id: number) => {
    try {
      setIsDeleting(id);
      await deleteShipmentById(id);
      
      // Optimistic update
      const updatedShipments = shipments.filter((shipment) => shipment.id !== id);
      setShipments(updatedShipments);
      
      // Notification de succès
      setSuccessMessage("Le colis a été supprimé avec succès.");
      
      setShipmentToDelete(null);
    } catch (err) {
      console.error("Erreur lors de la suppression", err);
      
      // Notification d'erreur
      setErrorMessage("Impossible de supprimer le colis. Veuillez réessayer.");
    } finally {
      setIsDeleting(null);
    }
  };

  // Loader générique
  const renderLoader = () => (
    <div className="flex justify-center items-center h-full">
      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
    </div>
  );

  // Aucun résultat
  const renderNoResults = () => (
    <div className="text-center py-8 bg-gray-50 rounded-lg">
      <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
      <p className="text-gray-600 text-lg">Aucun colis trouvé</p>
      <p className="text-gray-500 text-sm mt-2">Essayez de modifier votre recherche ou filtre</p>
    </div>
  );

  // Rendu des notifications
  const renderNotification = () => {
    if (errorMessage) {
      return (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative flex items-center" role="alert">
            <AlertTriangle className="h-5 w-5 mr-2" />
            <span className="block sm:inline">{errorMessage}</span>
          </div>
        </div>
      );
    }

    if (successMessage) {
      return (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative flex items-center" role="alert">
            <Package className="h-5 w-5 mr-2" />
            <span className="block sm:inline">{successMessage}</span>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Notifications */}
      {renderNotification()}

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
            placeholder="Rechercher par nom, email ou numéro de suivi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="relative cursor-pointer">
          <select
            className="block w-full py-2 cursor-pointer pl-3 pr-8 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            disabled={isLoading}
          >
            <option  value="">📋 Tous les statuts</option>
            <option  value="Recu📦">📦 Reçu</option>
            <option  value="En Transit✈️">✈️ En Transit</option>
            <option  value="Disponible🟢">🟢 Disponible</option>
            <option  value="Livré✅">✅ Livré</option>
          </select>
        </div>
      </div>

      {/* Gestion des états de chargement et de résultat */}
      {isLoading ? (
        renderLoader()
      ) : filteredShipments.length > 0 ? (
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
                  <span>Poids: {shipment.weight} lbs</span>
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

              {/* Bouton Supprimer */}
              <div className="mt-4">
                <button
                  onClick={() => setShipmentToDelete(shipment)}
                  disabled={isDeleting === shipment.id}
                  className="flex cursor-pointer items-center justify-center bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed w-full"
                >
                  {isDeleting === shipment.id ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Suppression...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Supprimer
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        renderNoResults()
      )}

      {/* Modale de confirmation */}
      {shipmentToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center mb-4">
              <Trash2 className="h-6 w-6 text-red-500 mr-3" />
              <h2 className="text-xl font-bold text-gray-800">Confirmer la suppression</h2>
            </div>
            <p className="mb-4 text-gray-600">Êtes-vous sûr de vouloir supprimer ce colis ? Cette action est irréversible.</p>
            <div className="text-sm text-gray-700 mb-4 bg-gray-50 p-4 rounded-lg">
              <p><strong>Id :</strong> {shipmentToDelete.id}</p>
              <p><strong>Nom :</strong> {shipmentToDelete.fullName}</p>
              <p><strong>Numéro de suivi :</strong> {shipmentToDelete.trackingNumber}</p>
              <p><strong>Statut :</strong> {shipmentToDelete.status}</p>
              <p><strong>Destination :</strong> {shipmentToDelete.destination}</p>
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShipmentToDelete(null)}
                disabled={isDeleting === shipmentToDelete.id}
                className="bg-gray-200 cursor-pointer text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDelete(shipmentToDelete.id)}
                disabled={isDeleting === shipmentToDelete.id}
                className="flex items-center cursor-pointer bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting === shipmentToDelete.id ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Suppression...
                  </>
                ) : (
                  "Confirmer"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllShipments;