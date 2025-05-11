import { Shipment, StatusDates } from "@/types/shipment";
import { findByOwnerId } from "@/utils/shipmentQueries";
import { useEffect, useState } from "react";
import AddShipmentByUser from "./AddShipmentByUser.tsx";
import { useUser } from "@clerk/clerk-react";
import LoginPrompt from "./LoginPrompts.tsx";
import { getShippingRate, SERVICE_FEE, FIXED_ITEM_RATES } from "@/constants/shippingRates";
import { useNavigate } from "react-router-dom";
import { eq } from "drizzle-orm";
import { userWhatsappPhoneNumbers } from "../../configs/schema.ts";
import { db } from "../../configs/index.ts";
import AddPhoneNumber from "@/components/AddPhoneNumber.tsx";

interface Colis {
  tracking: string;
  poids: number;
  frais: number;
  isFixedRate: boolean;
  fixedRateCategory?: string;
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
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("tous");
  const [selectedColis, setSelectedColis] = useState<Colis | null>(null);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [asToRefreshShipments, setAsToRefreshShipments] = useState<boolean>(false);
  const [hasPhoneNumber, setHasPhoneNumber] = useState<boolean | null>(null);
  const [isEditingPhone, setIsEditingPhone] = useState(false);

  // Vérifier si l'utilisateur a un numéro WhatsApp
  useEffect(() => {
    if (!isSignedIn || !user?.id) return;
    const checkPhoneNumber = async () => {
      try {
        const result = await db
          .select({ id: userWhatsappPhoneNumbers.id })
          .from(userWhatsappPhoneNumbers)
          .where(eq(userWhatsappPhoneNumbers.ownerId, user.id));
        setHasPhoneNumber(result.length > 0);
      } catch (err) {
        console.error("Erreur lors de la vérification du numéro:", err);
        setHasPhoneNumber(false);
      }
    };
    checkPhoneNumber();
  }, [user, isSignedIn]);

  // Récupérer les colis
  useEffect(() => {
    if (!isSignedIn || !user?.id || !hasPhoneNumber) return;
    setAsToRefreshShipments(false);
    const fetchUserShipments = async () => {
      try {
        const response = await findByOwnerId(user.id);
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
  }, [user, isSignedIn, asToRefreshShipments, hasPhoneNumber]);

  const colis = shipments.map((shipment: Shipment) => {
    const dateCreation =
      shipment.statusDates?.find((statusDate) => statusDate.status === "Recu📦")?.date || "Non spécifiée";
    const poids = shipment.weight ? parseFloat(shipment.weight) : 0;
    const rate = getShippingRate(shipment.destination);
    let frais = 0;
    let isFixedRate = false;
    let fixedRateCategory: string | undefined;

    const normalizedCategory = shipment.category
      ?.toLowerCase()
      .replace(/[\s-]/g, "")
      .replace("portbable", "portables")
      .replace(/[éèê]/g, "e");

    if (normalizedCategory) {
      const mappedCategory = {
        telephone: "telephones",
        telephones: "telephones",
        téléphone: "telephones",
        téléphones: "telephones",
        ordinateurportbable: "ordinateurs_portables",
        ordinateurportable: "ordinateurs_portables",
        ordinateursportables: "ordinateurs_portables",
        ordinateurportables: "ordinateurs_portables",
        starlink: "starlink",
      }[normalizedCategory] || normalizedCategory;
      if (mappedCategory in FIXED_ITEM_RATES) {
        frais = FIXED_ITEM_RATES[mappedCategory] + SERVICE_FEE;
        isFixedRate = true;
        fixedRateCategory = mappedCategory
          .charAt(0)
          .toUpperCase()
          + mappedCategory.slice(1).replace("_", " ");
      } else if (normalizedCategory === "standard") {
        frais = poids * rate + SERVICE_FEE;
        isFixedRate = false;
      } else {
        frais = poids * rate + SERVICE_FEE;
        isFixedRate = false;
      }
    } else {
      frais = poids * rate + SERVICE_FEE;
      isFixedRate = false;
    }

    return {
      tracking: shipment.trackingNumber ?? "Inconnu",
      poids,
      frais,
      isFixedRate,
      fixedRateCategory,
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
      id: shipment.id.toString(),
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
    navigate(`/shipment/${colis.id}`);
  };

  const closeColisDetails = () => {
    setSelectedColis(null);
  };

  const getFraisExplanation = (colis: Colis) => {
    if (colis.isFixedRate) {
      const baseFrais = colis.frais - SERVICE_FEE;
      return (
        <>
          <p className="font-medium text-sm">
            ${colis.frais.toFixed(2)} (Tarif fixe pour {colis.fixedRateCategory})
          </p>
          <p className="text-xs text-gray-400">
            *Tarif fixe de ${baseFrais.toFixed(2)} + ${SERVICE_FEE.toFixed(2)} de frais de service. Un seul frais de service si plusieurs colis sont récupérés ensemble.
          </p>
        </>
      );
    }
    const baseFrais = colis.frais - SERVICE_FEE;
    return (
      <>
        <p className="font-medium text-sm">${colis.frais.toFixed(2)}</p>
        <p className="text-xs text-gray-400">
          *Frais calculés à ${getShippingRate(colis.destination).toFixed(2)}/lbs pour {colis.poids} lbs = ${baseFrais.toFixed(2)} + ${SERVICE_FEE.toFixed(2)} de frais de service. Un seul frais de service si plusieurs colis.
        </p>
      </>
    );
  };

  if (!isSignedIn) {
    return <LoginPrompt />;
  }

  return (
    <div className="relative min-h-screen bg-gray-50">
      <div className={`${hasPhoneNumber === false || isEditingPhone ? 'blur-sm transition-all duration-300' : ''}`}>
        <div className="flex flex-col min-h-screen">
          <div className="flex justify-end p-3 sm:p-4">
            <button
              onClick={() => setIsEditingPhone(true)}
              className="text-blue-600 hover:text-blue-900 text-sm font-medium transition-colors duration-200"
            >
              Modifier le numéro WhatsApp
            </button>
          </div>
          <AddShipmentByUser setRefreshShipments={setAsToRefreshShipments} />
          <main className="flex-grow max-w-7xl mx-auto px-1 sm:px-6 lg:px-8 py-6">
            {!selectedColis ? (
              <>
                <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">
                  Tableau de bord
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6">
                  {[
                    { label: 'Total', value: stats.total, tab: 'tous', color: 'bg-blue-500' },
                    { label: 'Reçu', value: stats.recu, tab: 'recu', color: 'bg-blue-500' },
                    { label: 'En transit', value: stats.transit, tab: 'transit', color: 'bg-yellow-500' },
                    { label: 'Disponibles', value: stats.disponible, tab: 'disponible', color: 'bg-green-500' },
                    { label: 'Livrés', value: stats.livré, tab: 'livré', color: 'bg-blue-500' },
                  ].map((stat) => (
                    <div
                      key={stat.tab}
                      className="bg-white rounded-lg shadow p-3 sm:p-4 md:p-6 cursor-pointer hover:shadow-md transition-shadow duration-200"
                      onClick={() => setActiveTab(stat.tab)}
                    >
                      <div className="flex items-center">
                        <div className={`flex-shrink-0 ${stat.color} rounded-md p-2 sm:p-3`}>
                          <svg className="h-4 w-4 sm:h-5 md:h-6 sm:w-5 md:w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            {stat.tab === 'tous' ? (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            ) : stat.tab === 'recu' ? (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12l-8 4-8-4m16 0V8a2 2 0 00-1-1.73L13 3.27a2 2 0 00-2 0L5 6.27A2 2 0 004 8v4m16 0l-8 4-8-4" />
                            ) : stat.tab === 'transit' ? (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            ) : stat.tab === 'disponible' ? (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            ) : (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            )}
                          </svg>
                        </div>
                        <div className="ml-2 sm:ml-3 md:ml-4">
                          <h3 className="text-xs sm:text-sm font-medium text-gray-500">{stat.label}</h3>
                          <p className="text-base sm:text-lg md:text-2xl font-semibold text-gray-900">{stat.value}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="hidden md:block mb-4 sm:mb-6">
                  <div className="border-b border-gray-200">
                    <nav className="flex -mb-px space-x-4 sm:space-x-6">
                      {['tous', 'recu', 'transit', 'disponible', 'livré'].map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className={`py-3 px-2 sm:px-3 border-b-2 font-medium text-xs sm:text-sm transition-colors duration-200 ${
                            activeTab === tab
                              ? 'border-blue-500 text-blue-600'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          {tab === 'tous' ? 'Tous les colis' : tab === 'recu' ? 'Reçu' : tab === 'transit' ? 'En transit' : tab === 'disponible' ? 'Disponibles' : 'Livrés'}
                        </button>
                      ))}
                    </nav>
                  </div>
                </div>
                <div className="md:hidden mb-4">
                  <label htmlFor="filter" className="sr-only">
                    Filtrer les colis
                  </label>
                  <select
                    id="filter"
                    value={activeTab}
                    onChange={(e) => setActiveTab(e.target.value)}
                    className="w-full rounded-md border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="tous">Tous les colis</option>
                    <option value="recu">Reçu</option>
                    <option value="transit">En transit</option>
                    <option value="disponible">Disponibles</option>
                    <option value="livré">Livrés</option>
                  </select>
                </div>
                <div className="hidden md:block bg-white shadow-md rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N° Tracking</th>
                          <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Poids (lbs)</th>
                          <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
                          <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                          <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frais ($)</th>
                          <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {getFilteredColis().map((colis) => (
                          <tr key={colis.id} className="hover:bg-gray-50 cursor-pointer transition-colors duration-200" onClick={() => handleColisClick(colis)}>
                            <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm text-gray-500">{colis.tracking}</td>
                            <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm text-gray-500">{colis.poids} lbs</td>
                            <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm text-gray-500">{colis.destination}</td>
                            <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(colis.statut)}`}>
                                {colis.statut}
                              </span>
                            </td>
                            <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm text-gray-500">{getFraisExplanation(colis)}</td>
                            <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                className="text-blue-600 hover:text-blue-900 transition-colors duration-200"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleColisClick(colis);
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
                <div className="md:hidden space-y-3 sm:space-y-4">
                  {getFilteredColis().map((colis) => (
                    <div
                      key={colis.id}
                      className="bg-white rounded-lg shadow overflow-hidden cursor-pointer hover:shadow-md transition-shadow duration-200"
                      onClick={() => handleColisClick(colis)}
                    >
                      <div className="px-1 py-4 sm:px-4 sm:py-5">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1">{colis.tracking}</h3>
                            <p className="text-xs sm:text-sm text-gray-600">{colis.description}</p>
                          </div>
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(colis.statut)}`}>
                            {colis.statut}
                          </span>
                        </div>
                        <div className="mt-3 sm:mt-4 grid grid-cols-2 gap-3 text-xs sm:text-sm">
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
                            {getFraisExplanation(colis)}
                          </div>
                        </div>
                        <div className="mt-3 sm:mt-4 flex justify-end">
                          <button
                            className="text-blue-600 text-xs sm:text-sm font-medium hover:text-blue-900 transition-colors duration-200"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleColisClick(colis);
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
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-3 py-4 sm:px-4 sm:py-5 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h3 className="text-base sm:text-lg font-medium text-gray-900">Détails du colis {selectedColis.tracking}</h3>
                    <button
                      className="p-1 sm:p-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
                      onClick={closeColisDetails}
                    >
                      <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="px-3 py-4 sm:px-4 sm:py-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                    <div className="sm:col-span-2">
                      <div className="bg-gray-50 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6">
                        <h4 className="text-xs sm:text-sm font-medium text-gray-500 mb-3 sm:mb-4">Informations du colis</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                          <div>
                            <p className="text-xs text-gray-500">N° Tracking</p>
                            <p className="text-xs sm:text-sm font-medium">{selectedColis.tracking}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Statut</p>
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(selectedColis.statut)}`}>
                              {selectedColis.statut}
                            </span>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Date de création</p>
                            <p className="text-xs sm:text-sm font-medium">{selectedColis.dateCreation}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Date estimée de livraison</p>
                            <p className="text-xs sm:text-sm font-medium">{selectedColis.dateEstimee}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Destination</p>
                            <p className="text-xs sm:text-sm font-medium">{selectedColis.destination}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Expéditeur</p>
                            <p className="text-xs sm:text-sm font-medium">{selectedColis.expediteur}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Poids</p>
                            <p className="text-xs sm:text-sm font-medium">{selectedColis.poids} lbs</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Frais</p>
                            {getFraisExplanation(selectedColis)}
                          </div>
                          <div className="col-span-1 sm:col-span-2">
                            <p className="text-xs text-gray-500">Description</p>
                            <p className="text-xs sm:text-sm font-medium">{selectedColis.description}</p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-medium text-gray-500 mb-3 sm:mb-4">Suivi du colis</h4>
                        <div className="space-y-4 sm:space-y-6">
                          {selectedColis.historique.map((evenement, index) => (
                            <div key={index} className="relative flex items-start">
                              <div className="flex items-center h-full mr-3 sm:mr-4">
                                <div className="flex-shrink-0 h-3 w-3 sm:h-4 sm:w-4 rounded-full bg-blue-500"></div>
                                {index < selectedColis.historique.length - 1 && (
                                  <div className="ml-1.5 sm:ml-2 w-0.5 bg-blue-200 h-full absolute top-3 sm:top-4"></div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-xs sm:text-sm font-medium text-gray-900">{evenement.date}</div>
                                <div className="text-xs sm:text-sm text-gray-500">{evenement.statut}</div>
                                <div className="text-xs sm:text-sm text-gray-500">{evenement.lieu}</div>
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
      </div>
      {hasPhoneNumber === null && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-xl w-full max-w-xs sm:max-w-sm">
            <p className="text-sm sm:text-base text-gray-600">Chargement...</p>
          </div>
        </div>
      )}
      {(hasPhoneNumber === false || isEditingPhone) && (
        <AddPhoneNumber
          onPhoneAdded={() => {
            setHasPhoneNumber(true);
            setIsEditingPhone(false);
          }}
          isEditing={isEditingPhone}
        />
      )}
    </div>
  );
};

export default Dashboard;