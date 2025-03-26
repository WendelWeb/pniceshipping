// src/components/Dashboard.tsx
import { Shipment, StatusDates } from "@/types/shipment";
import { findByOwnerId } from "@/utils/shipmentQueries";
import { useEffect, useState } from "react";
import AddShipmentByUser from "./AddShipmentByUser.tsx";
import { useUser } from "@clerk/clerk-react";
import LoginPrompt from "./LoginPrompts.tsx";
import { getShippingRate, SERVICE_FEE } from "@/constants/shippingRates";
import { useNavigate } from "react-router-dom";

interface Colis {
  tracking: string;
  poids: number;
  frais: number;
  destination: string;
  statut: string;
  dateCreation: string;
  dateEstimee: string;
  expediteur: string;
  description: string;
  historique: { date: string; statut: string; lieu: string }[];
  id?: string;
}

const Dashboard = () => {
  const { user, isSignedIn } = useUser();
  const navigate = useNavigate(); // Ajout pour la redirection
  const [activeTab, setActiveTab] = useState("tous");
  const [selectedColis, setSelectedColis] = useState<Colis | null>(null);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [asToRefreshShipments, setAsToRefreshSipments] = useState<boolean>(false);

  useEffect(() => {
    if (!isSignedIn || !user?.id) return;
    setAsToRefreshSipments(false);
    const fetchUserShipments = async () => {
      try {
        const response = await findByOwnerId(user.id);
        console.log(response);

        const formattedShipments: Shipment[] = response.map((item) => ({
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
          statusDates: (item.statusDates as StatusDates[]) || null,
          phone: item.phone || "Non disponible",
        }));

        setShipments(formattedShipments);
      } catch (err) {
        console.error("Erreur lors de la récupération des colis:", err);
        alert("Erreur lors du chargement des colis. Rafraîchissez votre page.");
      }
    };

    fetchUserShipments();
  }, [user, isSignedIn, asToRefreshShipments]);

  const colis = shipments.map((shipment: Shipment) => {
    const dateCreation =
      shipment.statusDates?.find((statusDate) => statusDate.status === "Recu📦")?.date || "Non spécifiée";

    const poids = shipment.weight ? parseFloat(shipment.weight) : 0;
    const rate = getShippingRate(shipment.destination);
    const frais = poids * rate;

    return {
      tracking: shipment.trackingNumber ?? "Inconnu",
      poids,
      frais,
      destination: shipment.destination ?? "Non spécifiée",
      statut: shipment.status ?? "Statut inconnu",
      dateCreation,
      dateEstimee: shipment.estimatedDelivery ?? "Non estimée",
      expediteur: shipment.userName ?? "Inconnu",
      description: shipment.category ?? "Non spécifiée",
      historique: Array.isArray(shipment.statusDates)
        ? shipment.statusDates.map((stage: StatusDates) => ({
            statut: stage.status ?? "Inconnu",
            date: stage.date ?? "Non spécifiée",
            lieu: stage.location ?? "Non spécifié",
          }))
        : [],
      id: shipment.id.toString(), // Utilisation de l'ID pour la redirection
    };
  });

  const getFilteredColis = () => {
    switch (activeTab) {
      case "recu":
        return colis.filter((c) => c.statut === "Recu📦");
      case "transit":
        return colis.filter((c) => c.statut === "En Transit✈️");
      case "disponible":
        return colis.filter((c) => c.statut === "Disponible🟢");
      case "livré":
        return colis.filter((c) => c.statut === "Livré✅");
      default:
        return colis;
    }
  };

  const stats = {
    total: colis.length,
    recu: colis.filter((c) => c.statut === "Recu📦").length,
    transit: colis.filter((c) => c.statut === "En Transit✈️").length,
    disponible: colis.filter((c) => c.statut === "Disponible🟢").length,
    livré: colis.filter((c) => c.statut === "Livré✅").length,
  };

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case "En attente⏳":
        return "text-orange-500 bg-red-100";
      case "Recu📦":
        return "text-orange-600 bg-orange-100";
      case "En Transit✈️":
        return "text-yellow-600 bg-yellow-100";
      case "Disponible🟢":
        return "text-green-600 bg-green-100";
      case "Livré✅":
        return "text-blue-600 bg-blue-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const handleColisClick = (colis: Colis) => {
    navigate(`/shipment/${colis.id}`); // Redirection vers ShipmentView avec l'ID
  };

  const closeColisDetails = () => {
    setSelectedColis(null);
  };

  if (!isSignedIn) {
    return <LoginPrompt />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <AddShipmentByUser setRefreshShipments={setAsToRefreshSipments} />
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {!selectedColis ? (
          <>
            <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-6">
              Tableau de bord
            </h2>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 mb-6">
              <div
                className="bg-white rounded-lg shadow p-4 md:p-6"
                onClick={() => setActiveTab("tous")}
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-500 rounded-md p-2 md:p-3">
                    <svg
                      className="h-5 w-5 md:h-6 md:w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                      />
                    </svg>
                  </div>
                  <div className="ml-3 md:ml-4">
                    <h3 className="text-xs md:text-sm font-medium text-gray-500">
                      Total
                    </h3>
                    <p className="text-lg md:text-2xl font-semibold text-gray-900">
                      {stats.total}
                    </p>
                  </div>
                </div>
              </div>
              <div
                className="bg-white rounded-lg shadow p-4 md:p-6"
                onClick={() => setActiveTab("recu")}
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-500 rounded-md p-2 md:p-3">
                    <svg
                      className="h-5 w-5 md:h-6 md:w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 12l-8 4-8-4m16 0V8a2 2 0 00-1-1.73L13 3.27a2 2 0 00-2 0L5 6.27A2 2 0 004 8v4m16 0l-8 4-8-4"
                      />
                    </svg>
                  </div>
                  <div className="ml-3 md:ml-4">
                    <h3 className="text-xs md:text-sm font-medium text-gray-500">
                      Reçu
                    </h3>
                    <p className="text-lg md:text-2xl font-semibold text-gray-900">
                      {stats.recu}
                    </p>
                  </div>
                </div>
              </div>
              <div
                className="bg-white rounded-lg shadow p-4 md:p-6"
                onClick={() => setActiveTab("transit")}
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-yellow-500 rounded-md p-2 md:p-3">
                    <svg
                      className="h-5 w-5 md:h-6 md:w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="ml-3 md:ml-4">
                    <h3 className="text-xs md:text-sm font-medium text-gray-500">
                      En transit
                    </h3>
                    <p className="text-lg md:text-2xl font-semibold text-gray-900">
                      {stats.transit}
                    </p>
                  </div>
                </div>
              </div>
              <div
                className="bg-white rounded-lg shadow p-4 md:p-6"
                onClick={() => setActiveTab("disponible")}
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-500 rounded-md p-2 md:p-3">
                    <svg
                      className="h-5 w-5 md:h-6 md:w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div className="ml-3 md:ml-4">
                    <h3 className="text-xs md:text-sm font-medium text-gray-500">
                      Disponibles
                    </h3>
                    <p className="text-lg md:text-2xl font-semibold text-gray-900">
                      {stats.disponible}
                    </p>
                  </div>
                </div>
              </div>
              <div
                className="bg-white rounded-lg shadow p-4 md:p-6"
                onClick={() => setActiveTab("livré")}
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-500 rounded-md p-2 md:p-3">
                    <svg
                      className="h-5 w-5 md:h-6 md:w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="ml-3 md:ml-4">
                    <h3 className="text-xs md:text-sm font-medium text-gray-500">
                      Livrés
                    </h3>
                    <p className="text-lg md:text-2xl font-semibold text-gray-900">
                      {stats.livré}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs - Desktop */}
            <div className="hidden md:block mb-6">
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px">
                  <button
                    onClick={() => setActiveTab("tous")}
                    className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === "tous"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Tous les colis
                  </button>
                  <button
                    onClick={() => setActiveTab("recu")}
                    className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === "recu"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Reçu
                  </button>
                  <button
                    onClick={() => setActiveTab("transit")}
                    className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === "transit"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    En transit
                  </button>
                  <button
                    onClick={() => setActiveTab("disponible")}
                    className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === "disponible"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Disponibles
                  </button>
                  <button
                    onClick={() => setActiveTab("livré")}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === "livré"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Livrés
                  </button>
                </nav>
              </div>
            </div>

            {/* Mobile filter indicator */}
            <div className="md:hidden mb-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-700">
                  Filtre actuel:{" "}
                  {activeTab === "tous"
                    ? "Tous les colis"
                    : activeTab === "recu"
                    ? "Reçu"
                    : activeTab === "transit"
                    ? "En transit"
                    : activeTab === "disponible"
                    ? "Disponibles"
                    : "Livrés"}
                </h3>
              </div>
            </div>

            {/* Table - Desktop */}
            <div className="hidden md:block bg-white shadow-md rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        N° Tracking
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Poids (lbs)
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Destination
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Statut
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Frais ($)
                        <p className="text-[10px] font-normal text-gray-400">
                          *Un seul frais de service de ${SERVICE_FEE} est appliqué si plusieurs colis sont récupérés ensemble
                        </p>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {getFilteredColis().map((colis) => (
                      <tr
                        key={colis.id}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleColisClick(colis)} // Redirection ici
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {colis.tracking}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {colis.poids} lbs
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {colis.destination}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                              colis.statut
                            )}`}
                          >
                            {colis.statut}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${colis.frais.toFixed(2)} +10$ services
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            className="text-blue-600 hover:text-blue-900"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleColisClick(colis); // Redirection ici aussi
                            }}
                          >
                            Détails
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Cards - Mobile */}
            <div className="md:hidden space-y-4">
              {getFilteredColis().map((colis) => (
                <div
                  key={colis.id}
                  className="bg-white rounded-lg shadow overflow-hidden cursor-pointer"
                  onClick={() => handleColisClick(colis)} // Redirection ici
                >
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">
                          {colis.tracking}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {colis.description}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                          colis.statut
                        )}`}
                      >
                        {colis.statut}
                      </span>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Destination</p>
                        <p className="font-medium">{colis.destination}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">N° Tracking</p>
                        <p className="font-medium">{colis.tracking}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Poids</p>
                        <p className="font-medium">{colis.poids} lbs</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Frais</p>
                        <p className="font-medium">${colis.frais.toFixed(2)} +10$ services</p>
                        <p className="text-xs text-gray-400">
                          *Un seul frais de service de ${SERVICE_FEE} si plusieurs colis
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button
                        className="text-blue-600 text-sm font-medium"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleColisClick(colis); // Redirection ici aussi
                        }}
                      >
                        Voir les détails →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          // Vue détaillée d'un colis (inchangée sauf redirection supprimée)
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Détails du colis {selectedColis.tracking}
                </h3>
                <button
                  className="p-2 rounded-md hover:bg-gray-100"
                  onClick={closeColisDetails}
                >
                  <svg
                    className="h-5 w-5 text-gray-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                <div className="col-span-2">
                  {/* Informations principales */}
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <h4 className="text-sm font-medium text-gray-500 mb-4">
                      Informations du colis
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">N° Tracking</p>
                        <p className="text-sm font-medium">
                          {selectedColis.tracking}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Statut</p>
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                            selectedColis.statut
                          )}`}
                        >
                          {selectedColis.statut}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Date de création</p>
                        <p className="text-sm font-medium">
                          {selectedColis.dateCreation}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">
                          Date estimée de livraison
                        </p>
                        <p className="text-sm font-medium">
                          {selectedColis.dateEstimee}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Destination</p>
                        <p className="text-sm font-medium">
                          {selectedColis.destination}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Expéditeur</p>
                        <p className="text-sm font-medium">
                          {selectedColis.expediteur}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Poids</p>
                        <p className="text-sm font-medium">
                          {selectedColis.poids} lbs
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Frais</p>
                        <p className="text-sm font-medium">
                          ${selectedColis.frais.toFixed(2)} +10$ services
                        </p>
                        <p className="text-xs text-gray-400">
                          *Un seul frais de service de ${SERVICE_FEE} si plusieurs colis
                        </p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-xs text-gray-500">Description</p>
                        <p className="text-sm font-medium">
                          {selectedColis.description}
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Historique du colis */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-4">
                      Suivi du colis
                    </h4>
                    <div className="space-y-6">
                      {selectedColis.historique.map((evenement, index) => (
                        <div key={index} className="relative flex items-start">
                          <div className="flex items-center h-full mr-4">
                            <div className="flex-shrink-0 h-4 w-4 rounded-full bg-blue-500"></div>
                            {index < selectedColis.historique.length - 1 && (
                              <div className="ml-2 w-0.5 bg-blue-200 h-full absolute top-4 bottom-0"></div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900">
                              {evenement.date}
                            </div>
                            <div className="text-sm text-gray-500">
                              {evenement.statut}
                            </div>
                            <div className="text-sm text-gray-500">
                              {evenement.lieu}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;