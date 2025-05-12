import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Shipment, StatusDates } from "@/types/shipment";
import { findById } from "@/utils/shipmentQueries";
import { getShippingRate, SERVICE_FEE, FIXED_ITEM_RATES } from "@/constants/shippingRates";
import {
  ArrowLeftIcon,
  TruckIcon,
  ClockIcon,
  CheckCircleIcon,
  UserIcon,
  PhoneIcon,
  CurrencyDollarIcon,
  InformationCircleIcon,
} from "@heroicons/react/solid";
import { MapPinIcon, MessageSquare } from "lucide-react";

const ShipmentView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mappage des catégories normalisées aux clés de FIXED_ITEM_RATES
  const categoryMapping: Record<string, string> = {
    telephone: "telephones",
    telephones: "telephones",
    téléphone: "telephones",
    téléphones: "telephones",
    ordinateurportbable: "ordinateurs_portables", // Gère la typo
    ordinateurportable: "ordinateurs_portables",
    ordinateursportables: "ordinateurs_portables",
    ordinateurportables: "ordinateurs_portables",
    starlink: "starlink",
  };

  useEffect(() => {
    const fetchShipment = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const result = await findById(parseInt(id));
        if (!result) throw new Error("Colis non trouvé");
        setShipment({
          ...result,
          statusDates: (result.statusDates as StatusDates[]) || [],
          phone: result.phone || "Non disponible",
        });
      } catch (err) {
        setError("Erreur lors de la récupération du colis");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchShipment();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (error || !shipment) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <p className="text-red-600 text-xl font-bold">{error || "Colis non trouvé"}</p>
        <button
          onClick={() => navigate("/dashboard")}
          className="mt-6 flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          Retour dans mes colis
        </button>
      </div>
    );
  }

  // Calcul des frais
  const poids = parseFloat(shipment.weight || "0");
  const rate = getShippingRate(shipment.destination || "");
  let shippingCost = 0;
  let totalCost = 0;
  let isFixedRate = false;
  let fixedRateCategory: string | undefined;

  // Normalisation de la catégorie
  const normalizedCategory = shipment.category
    ?.toLowerCase()
    .replace(/[\s-]/g, "")
    .replace("portbable", "portables")
    .replace(/[éèê]/g, "e");

  if (normalizedCategory) {
    const mappedCategory = categoryMapping[normalizedCategory] || normalizedCategory;
    if (mappedCategory in FIXED_ITEM_RATES) {
      // Item spécial : tarif fixe + frais de service
      shippingCost = FIXED_ITEM_RATES[mappedCategory];
      totalCost = shippingCost + SERVICE_FEE;
      isFixedRate = true;
      fixedRateCategory = mappedCategory
        .charAt(0)
        .toUpperCase()
        + mappedCategory.slice(1).replace("_", " ");
    } else {
      // Standard ou inconnu : tarif par livre + frais de service
      shippingCost = poids * rate;
      totalCost = shippingCost + SERVICE_FEE;
      isFixedRate = false;
    }
  } else {
    // Pas de catégorie : tarif par livre + frais de service
    shippingCost = poids * rate;
    totalCost = shippingCost + SERVICE_FEE;
    isFixedRate = false;
  }

  const getFraisExplanation = () => {
    if (isFixedRate) {
      return `Tarif fixe de $${shippingCost.toFixed(2)} pour ${fixedRateCategory} + $${SERVICE_FEE.toFixed(2)} de frais de service.`;
    }
    return `Frais calculés à $${rate.toFixed(2)}/lb pour ${poids} lbs = $${shippingCost.toFixed(2)} + $${SERVICE_FEE.toFixed(2)} de frais de service.`;
  };

  const statusSteps = ["En attente⏳", "Recu📦", "En Transit✈️", "Disponible🟢", "Livré✅"];
  const currentStepIndex = statusSteps.indexOf(shipment.status);
  const progressPercent = ((currentStepIndex + 1) / statusSteps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* En-tête */}
        <div className="bg-blue-600 p-6 sm:p-8 text-white">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <TruckIcon className="h-10 w-10 sm:h-12 sm:w-12 text-yellow-300" />
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold">
                Colis #{shipment.trackingNumber}
              </h1>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="https://wa.me/50948812652"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
              >
                <MessageSquare className="h-5 w-5" />
                Aide WhatsApp
              </a>
              <button
                onClick={() => navigate("/dashboard")}
                className="flex items-center gap-2 bg-yellow-400 text-blue-800 px-4 py-2 rounded-lg hover:bg-yellow-500 transition"
              >
                <ArrowLeftIcon className="h-5 w-5" />
                Retour
              </button>
            </div>
          </div>
          <p className="mt-2 text-sm sm:text-base opacity-80">ID unique : {shipment.id}</p>
        </div>

        {/* Contenu principal */}
        <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonne gauche : Infos détaillées */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informations principales */}
            <div className="bg-gray-50 p-4 sm:p-6 rounded-xl shadow-sm">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <MapPinIcon className="h-6 w-6 text-blue-500" />
                Tout sur ton colis
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-sm sm:text-base">
                <div>
                  <p className="text-gray-500 flex items-center gap-1">
                    <UserIcon className="h-4 w-4" /> Propriétaire
                  </p>
                  <p className="font-semibold text-gray-900">{shipment.userName || "Inconnu"}</p>
                </div>
                <div>
                  <p className="text-gray-500 flex items-center gap-1">
                    <PhoneIcon className="h-4 w-4" /> Téléphone
                  </p>
                  <p className="font-semibold text-gray-900">{shipment.phone}</p>
                </div>
                <div>
                  <p className="text-gray-500 flex items-center gap-1">
                    <TruckIcon className="h-4 w-4" /> N° Tracking
                  </p>
                  <p className="font-semibold text-gray-900">{shipment.trackingNumber}</p>
                </div>
                <div>
                  <p className="text-gray-500 flex items-center gap-1">
                    <MapPinIcon className="h-4 w-4" /> Destination
                  </p>
                  <p className="font-semibold text-gray-900">{shipment.destination || "Non spécifiée"}</p>
                </div>
                <div>
                  <p className="text-gray-500 flex items-center gap-1">
                    <ClockIcon className="h-4 w-4" /> Date estimée
                  </p>
                  <p className="font-semibold text-gray-900">{shipment.estimatedDelivery || "Pas encore connue"}</p>
                </div>
                <div>
                  <p className="text-gray-500 flex items-center gap-1">
                    <CheckCircleIcon className="h-4 w-4" /> Statut
                  </p>
                  <span className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(shipment.status)}`}>
                    {shipment.status}
                  </span>
                </div>
                <div>
                  <p className="text-gray-500 flex items-center gap-1">
                    <TruckIcon className="h-4 w-4" /> Poids
                  </p>
                  <p className="font-semibold text-gray-900">{shipment.weight} lbs</p>
                </div>
                <div>
                  <p className="text-gray-500 flex items-center gap-1">
                    <InformationCircleIcon className="h-4 w-4" /> Catégorie
                  </p>
                  <p className="font-semibold text-gray-900">{shipment.category || "Non précisée"}</p>
                </div>
              </div>
            </div>

            {/* Historique avec barre de progression */}
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <ClockIcon className="h-6 w-6 text-blue-500" />
                L'aventure de ton colis
              </h2>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
                <div
                  className="bg-blue-500 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="space-y-6">
                {shipment.statusDates.map((stage, index) => (
                  <div key={index} className="relative flex items-start">
                    <div className="flex-shrink-0 mr-4">
                      <div
                        className={`h-5 w-5 rounded-full ${
                          stage.status === "Livré✅" ? "bg-green-500" : "bg-blue-500"
                        }`}
                      />
                      {index < shipment.statusDates.length - 1 && (
                        <div className="absolute top-5 left-2.5 w-0.5 bg-blue-300 h-full" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm sm:text-base font-semibold text-gray-900">{stage.date}</p>
                      <p className="text-sm sm:text-base text-gray-700">{stage.status}</p>
                      <p className="text-xs sm:text-sm text-gray-500">{stage.location || "Lieu non précisé"}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Explication simple pour un enfant */}
            <div className="bg-yellow-50 p-4 sm:p-6 rounded-xl shadow-sm">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <InformationCircleIcon className="h-6 w-6 text-yellow-500" />
                Informations sur ton colis
              </h2>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                Salut ! Ce colis appartient à {shipment.fullName || "quelqu’un"}.  
                Son numéro de suivi est {shipment.trackingNumber}, c’est comme sa carte d’identité pour qu’on puisse le retrouver facilement.  

                📌 Statut actuel : {shipment.status} –  
                {shipment.status === "En attente⏳"
                  ? "Le client a demandé l’expédition et on attend de le recevoir."
                  : shipment.status === "Recu📦"
                  ? "On l’a bien reçu dans notre entrepôt de Miami, FL 31166. On va le peser bientôt pour calculer les frais d’envoi."
                  : shipment.status === "En Transit✈️"
                  ? "Il est en route, soit dans un camion, soit dans un avion."
                  : shipment.status === "Disponible🟢"
                  ? "Il est prêt à être récupéré."
                  : "Il est arrivé à sa destination !"}  
                📦 Poids : {shipment.weight ? `${shipment.weight} lb (${Math.round(poids)} livres environ)` : "On va le peser bientôt"}.  
                🎯 Destination : {shipment.destination || "Non spécifiée"}.  
                ⏳ Pris en charge le : {shipment.statusDates[0]?.date || "Date inconnue"}.  
                🚚 Arrivée prévue : {shipment.estimatedDelivery || "Bientôt"}.  

                💰 Frais d’expédition : ${shippingCost.toFixed(2)}  
                {isFixedRate
                  ? `(Tarif fixe pour ${fixedRateCategory})`
                  : `(Calculé à $${rate.toFixed(2)}/lb pour ${poids} lbs)`}  
                🔧 Frais de service : ${SERVICE_FEE.toFixed(2)}  
                💵 Total : ${totalCost.toFixed(2)}  

                ❓ Une question ? Envoie-nous un message sur WhatsApp :  
                <a href="https://wa.me/50931970548" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                  +509 31 97 0548
                </a>.
              </p>
            </div>
          </div>

          {/* Colonne droite : Prix et résumé */}
          <div className="space-y-6">
            {/* Breakdown du prix */}
            <div className="bg-green-50 p-4 sm:p-6 rounded-xl shadow-sm">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <CurrencyDollarIcon className="h-6 w-6 text-green-500" />
                Le prix, c’est combien ?
              </h3>
              <div className="space-y-3 text-sm sm:text-base">
                <div className="flex justify-between">
                  <p className="text-gray-600">
                    {isFixedRate ? `Tarif fixe (${fixedRateCategory})` : `Poids (${poids} lbs × $${rate}/lb)`}
                  </p>
                  <p className="font-semibold text-gray-900">${shippingCost.toFixed(2)}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-600">Frais de service</p>
                  <p className="font-semibold text-gray-900">${SERVICE_FEE.toFixed(2)}</p>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <p className="text-gray-800 font-bold">Total</p>
                  <p className="font-bold text-green-600">${totalCost.toFixed(2)}</p>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  *{getFraisExplanation()}
                </p>
              </div>
            </div>

            {/* Résumé rapide */}
            <div className="bg-blue-50 p-4 sm:p-6 rounded-xl shadow-sm">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <CheckCircleIcon className="h-6 w-6 text-blue-500" />
                En bref
              </h3>
              <ul className="space-y-2 text-sm sm:text-base text-gray-700">
                <li>📦 Colis : {shipment.trackingNumber}</li>
                <li>⚖️ Poids : {shipment.weight} lbs</li>
                <li>🏠 Destination : {shipment.destination}</li>
                <li>📅 Arrive : {shipment.estimatedDelivery || "Bientôt"}</li>
                <li>💰 Coût : ${totalCost.toFixed(2)}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const getStatusColor = (statut: string) => {
  switch (statut) {
    case "En attente⏳": return "text-orange-500 bg-red-100";
    case "Recu📦": return "text-orange-600 bg-orange-100";
    case "En Transit✈️": return "text-yellow-600 bg-yellow-100";
    case "Disponible🟢": return "text-green-600 bg-green-100";
    case "Livré✅": return "text-blue-600 bg-blue-100";
    default: return "text-gray-600 bg-gray-100";
  }
};

export default ShipmentView;