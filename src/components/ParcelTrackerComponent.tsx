import { useState, useEffect } from "react";
import { Search, RefreshCw, Truck, Info, Package, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { findByTrackingNumber } from "@/utils/shipmentQueries";

interface ShipmentData {
  id: number;
  ownerId: string;
  fullName: string;
  userName: string;
  category: string;
  emailAdress: string;
  trackingNumber: string;
  weight: string;
  status: string;
  destination: string;
  estimatedDelivery: string;
  phone: string | null;
  statusDates: { status: string; date: string; location: string }[];
}

const ParcelTracker = () => {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [shipmentData, setShipmentData] = useState<ShipmentData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    // Récupérer les recherches récentes du localStorage
    const savedSearches = localStorage.getItem("recentTrackingSearches");
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  const saveToRecentSearches = (number: string) => {
    // Utiliser les 20 premiers caractères pour les recherches récentes
    const truncatedNumber = number.slice(0, 20);
    const updatedSearches = [
      truncatedNumber,
      ...recentSearches.filter(item => item !== truncatedNumber)
    ].slice(0, 5);
    
    setRecentSearches(updatedSearches);
    localStorage.setItem("recentTrackingSearches", JSON.stringify(updatedSearches));
  };

  const trackParcel = async (number: string) => {
    // Tronquer le numéro de suivi à 20 caractères
    const truncatedTrackingNumber = number.slice(0, 20);

    if (!truncatedTrackingNumber.trim()) {
      setError("Veuillez entrer un numéro de suivi.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setShipmentData(null);
      
      const results = await findByTrackingNumber(truncatedTrackingNumber) as ShipmentData[];
      
      if (results && results.length > 0) {
        setShipmentData(results[0]);
        saveToRecentSearches(truncatedTrackingNumber);
      } else {
        setError("Aucun colis trouvé avec ce numéro de suivi.");
      }
    } catch (err) {
      console.error("Erreur lors du suivi du colis:", err);
      setError("Une erreur est survenue lors de la recherche du colis. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    trackParcel(trackingNumber);
  };

  const handleSelectRecent = (number: string) => {
    // Tronquer le numéro sélectionné à 20 caractères
    const truncatedNumber = number.slice(0, 20);
    setTrackingNumber(truncatedNumber);
    trackParcel(truncatedNumber);
    setShowSuggestions(false);
  };

  const renderStatusIcon = (status: string) => {
    if (!status) return <Info className="h-6 w-6 text-gray-500" />;
    
    if (status.includes("Livré") || status.includes("✅")) 
      return <CheckCircle className="h-6 w-6 text-green-500" />;
    
    if (status.includes("En attente") || status.includes("⏳")) 
      return <Clock className="h-6 w-6 text-amber-500" />;
    
    if (status.includes("Transit") || status.includes("🚚")) 
      return <Truck className="h-6 w-6 text-blue-500" />;
    
    if (status.includes("Problème") || status.includes("⚠️")) 
      return <AlertCircle className="h-6 w-6 text-red-500" />;
    
    return <Package className="h-6 w-6 text-gray-500" />;
  };

  return (
    <div className="flex flex-col items-center p-2 md:p-4 w-full min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* En-tête avec image responsive */}
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden mb-6 md:mb-8">
        <div className="relative">
          {/* Image pour mobile */}
          <div className="md:hidden">
            <div 
              className="h-32 bg-cover bg-center" 
              style={{ backgroundImage: "url('/shipping-banner-mobile.jpg')" }}
            >
              <div className="absolute inset-0 bg-blue-900 bg-opacity-70 flex flex-col items-center justify-center px-4">
                <h1 className="text-2xl font-bold text-white text-center">
                  Suivez votre colis
                </h1>
                <p className="text-sm text-blue-100 mt-1 text-center">
                  Suivi rapide et sécurisé
                </p>
              </div>
            </div>
          </div>
          
          {/* Image pour desktop */}
          <div className="hidden md:block">
            <div 
              className="h-40 bg-cover bg-center" 
              style={{ backgroundImage: "url('/shipping-banner-desktop.jpg')" }}
            >
              <div className="absolute inset-0 bg-blue-900 bg-opacity-70 flex flex-col items-center justify-center">
                <h1 className="text-4xl font-bold text-white text-center px-4">
                  Suivez votre colis en temps réel
                </h1>
                <p className="text-lg text-blue-100 mt-2">
                  Service de livraison fiable et transparent
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-4 md:p-6">
          <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6 text-center">
            Pour suivre votre colis sur Pnice, entrez votre numéro de suivi fourni par
            le vendeur ou la plateforme auprès de laquelle vous avez effectué votre
            achat. Nous assurons uniquement le transport de votre colis.
          </p>
          
          {/* Formulaire de recherche */}
          <form onSubmit={handleSubmit} className="w-full">
            <div className="relative">
              <label
                className="block text-sm font-medium mb-2 text-gray-700"
                htmlFor="tracking-number"
              >
                Numéro de suivi*
              </label>
              
              <div className="flex items-center">
                <div className="relative flex-grow">
                  <input
                    id="tracking-number"
                    type="text"
                    className="w-full p-2 md:p-3 border border-gray-300 rounded-l-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base"
                    placeholder="Entrez le numéro de suivi"
                    value={trackingNumber}
                    onChange={(e) => {
                      // Limiter l'entrée à 20 caractères
                      const truncatedValue = e.target.value.slice(0, 20);
                      setTrackingNumber(truncatedValue);
                      setShowSuggestions(truncatedValue.length > 0);
                    }}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    onFocus={() => setShowSuggestions(trackingNumber.length > 0)}
                    maxLength={20} // Limiter l'entrée à 20 caractères dans l'interface
                  />
                  
                  {/* Suggestions de recherches récentes */}
                  {showSuggestions && recentSearches.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                      <div className="p-2 text-xs text-gray-500 border-b">Recherches récentes</div>
                      {recentSearches.map((number, index) => (
                        <div
                          key={index}
                          className="p-2 hover:bg-gray-100 cursor-pointer flex items-center"
                          onClick={() => handleSelectRecent(number)}
                        >
                          <Clock className="h-4 w-4 mr-2 text-gray-400" />
                          <span>{number}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <button 
                  type="submit"
                  disabled={loading}
                  className="p-2 md:p-3 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 flex items-center justify-center text-sm md:text-base min-w-16 md:min-w-24"
                >
                  {loading ? (
                    <RefreshCw className="h-4 w-4 md:h-5 md:w-5 animate-spin" />
                  ) : (
                    <>
                      <span className="md:inline">Suivre</span>
                      <Search className="ml-1 h-4 w-4 md:h-5 md:w-5" />
                    </>
                  )}
                </button>
              </div>
              
              {error && (
                <div className="mt-2 text-xs md:text-sm text-red-600">
                  <AlertCircle className="inline-block h-3 w-3 md:h-4 md:w-4 mr-1" />
                  {error}
                </div>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Résultats de recherche */}
      {shipmentData && (
        <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden mb-6 md:mb-8 transition-all duration-300">
          <div className="bg-blue-600 p-3 md:p-4 text-white">
            <h2 className="text-lg md:text-xl font-bold flex items-center">
              <Package className="mr-2 h-5 w-5 md:h-6 md:w-6" />
              Informations sur le colis
            </h2>
            <p className="text-sm md:text-base text-blue-100">
              Numéro de suivi: <span className="font-mono font-medium">{shipmentData.trackingNumber}</span>
            </p>
          </div>
          
          <div className="p-4 md:p-6">
            {/* Informations générales */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
              <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                <h3 className="text-base md:text-lg font-medium text-gray-800 mb-2 md:mb-3">Détails du colis</h3>
                <ul className="space-y-2 md:space-y-3 text-sm md:text-base">
                  <li className="flex justify-between">
                    <span className="text-gray-600">Catégorie:</span>
                    <span className="font-medium">{shipmentData.category || "Non spécifié"}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Poids:</span>
                    <span className="font-medium">{shipmentData.weight ? `${shipmentData.weight} kg` : "Non spécifié"}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Destination:</span>
                    <span className="font-medium">{shipmentData.destination || "Non spécifié"}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Livraison estimée:</span>
                    <span className="font-medium">{shipmentData.estimatedDelivery ? new Date(shipmentData.estimatedDelivery).toLocaleDateString() : "Non spécifié"}</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                <h3 className="text-base md:text-lg font-medium text-gray-800 mb-2 md:mb-3">Statut actuel</h3>
                <div className="flex items-center mb-3 md:mb-4">
                  {renderStatusIcon(shipmentData.status)}
                  <span className="ml-2 text-base md:text-lg font-medium">
                    {shipmentData.status || "Statut inconnu"}
                  </span>
                </div>
                
                <div className="text-xs md:text-sm text-gray-500">
                  <p>Dernière mise à jour: {shipmentData.statusDates && shipmentData.statusDates.length > 0 
                    ? shipmentData.statusDates[shipmentData.statusDates.length - 1].date 
                    : "Non disponible"}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Suivi d'historique */}
            <div className="mb-4 md:mb-6">
              <h3 className="text-base md:text-lg font-medium text-gray-800 mb-3 md:mb-4 flex items-center">
                <Clock className="mr-2 h-4 w-4 md:h-5 md:w-5 text-blue-600" />
                Historique de suivi
              </h3>
              
              {shipmentData.statusDates && shipmentData.statusDates.length > 0 ? (
                <div className="relative">
                  {/* Ligne verticale pour la timeline */}
                  <div className="absolute left-2 md:left-2.5 top-0 h-full w-0.5 bg-gray-200"></div>
                  
                  <ul className="space-y-4 md:space-y-6">
                    {[...shipmentData.statusDates].reverse().map((statusItem, index) => (
                      <li key={index} className="ml-5 md:ml-6 relative">
                        {/* Point de la timeline */}
                        <div className="absolute -left-5 md:-left-6 mt-1.5 h-4 w-4 md:h-5 md:w-5 rounded-full border-2 border-blue-600 bg-white"></div>
                        
                        <div className="bg-gray-50 p-2 md:p-3 rounded-lg">
                          <div className="flex justify-between items-start">
                            <span className="font-medium text-gray-800 text-sm md:text-base">{statusItem.status}</span>
                            <span className="text-xs md:text-sm text-gray-500">{statusItem.date}</span>
                          </div>
                          <p className="text-xs md:text-sm text-gray-600 mt-1">{statusItem.location}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="p-3 md:p-4 bg-gray-50 rounded-lg text-center text-xs md:text-sm text-gray-500">
                  Aucun historique de statut disponible pour ce colis.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Liens et informations complémentaires */}
      <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
        <div className="bg-white p-3 md:p-5 rounded-lg shadow-md flex flex-col items-center text-center hover:shadow-lg transition-shadow duration-200">
          <div className="bg-blue-100 p-2 md:p-3 rounded-full mb-2 md:mb-3">
            <Package className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
          </div>
          <h3 className="font-medium text-gray-800 mb-1 md:mb-2 text-sm md:text-base">Ce que vous pouvez envoyer</h3>
          <p className="text-gray-600 text-xs md:text-sm mb-2 md:mb-3">Découvrez les types de colis que nous acceptons pour l'expédition.</p>
          <a href="/guide/shipping-items" className="text-blue-600 hover:underline text-xs md:text-sm font-medium">
            En savoir plus
          </a>
        </div>
        
        <div className="bg-white p-3 md:p-5 rounded-lg shadow-md flex flex-col items-center text-center hover:shadow-lg transition-shadow duration-200">
          <div className="bg-green-100 p-2 md:p-3 rounded-full mb-2 md:mb-3">
            <Info className="h-5 w-5 md:h-6 md:w-6 text-green-600" />
          </div>
          <h3 className="font-medium text-gray-800 mb-1 md:mb-2 text-sm md:text-base">Guide des tailles et poids</h3>
          <p className="text-gray-600 text-xs md:text-sm mb-2 md:mb-3">Consultez notre guide pour préparer correctement vos colis.</p>
          <a href="/guide/size-weight" className="text-blue-600 hover:underline text-xs md:text-sm font-medium">
            Voir le guide
          </a>
        </div>
        
        <div className="bg-white p-3 md:p-5 rounded-lg shadow-md flex flex-col items-center text-center hover:shadow-lg transition-shadow duration-200 sm:col-span-2 md:col-span-1">
          <div className="bg-amber-100 p-2 md:p-3 rounded-full mb-2 md:mb-3">
            <Truck className="h-5 w-5 md:h-6 md:w-6 text-amber-600" />
          </div>
          <h3 className="font-medium text-gray-800 mb-1 md:mb-2 text-sm md:text-base">Zones de livraison</h3>
          <p className="text-gray-600 text-xs md:text-sm mb-2 md:mb-3">Vérifiez les régions desservies et les délais estimés.</p>
          <a href="/delivery-zones" className="text-blue-600 hover:underline text-xs md:text-sm font-medium">
            Consulter les zones
          </a>
        </div>
      </div>

      {/* FAQ avec image responsive */}
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden mb-6 md:mb-8">
        <div className="bg-gray-50 p-3 md:p-4 border-b flex justify-between items-center">
          <h2 className="text-lg md:text-xl font-bold text-gray-800">Questions fréquentes</h2>
        </div>
        
        <div className="p-4 md:p-6">
          <div className="space-y-3 md:space-y-4">
            <div className="border-b pb-3 md:pb-4">
              <h3 className="font-medium text-gray-800 mb-1 md:mb-2 text-sm md:text-base">Combien de temps prend une livraison standard ?</h3>
              <p className="text-gray-600 text-xs md:text-sm">La durée de livraison standard est généralement de 3 à 5 jours ouvrables, selon la destination. Des options d'expédition express sont également disponibles.</p>
            </div>
            
            <div className="border-b pb-3 md:pb-4">
              <h3 className="font-medium text-gray-800 mb-1 md:mb-2 text-sm md:text-base">Que faire si mon colis est retardé ?</h3>
              <p className="text-gray-600 text-xs md:text-sm">Si vous constatez un retard dans la livraison de votre colis, vous pouvez contacter notre service client avec votre numéro de suivi pour obtenir plus d'informations.</p>
            </div>
            
            <div className="border-b pb-3 md:pb-4">
              <h3 className="font-medium text-gray-800 mb-1 md:mb-2 text-sm md:text-base">Comment modifier l'adresse de livraison d'un colis ?</h3>
              <p className="text-gray-600 text-xs md:text-sm">Pour modifier l'adresse de livraison d'un colis déjà expédié, veuillez contacter notre service client dès que possible. Des frais supplémentaires peuvent s'appliquer.</p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-800 mb-1 md:mb-2 text-sm md:text-base">Les colis sont-ils assurés ?</h3>
              <p className="text-gray-600 text-xs md:text-sm">Tous nos envois incluent une assurance de base. Pour une couverture supplémentaire, vous pouvez souscrire à notre assurance premium lors de l'expédition.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bouton d'assistance - taille ajustée pour mobile */}
      <div className="fixed bottom-4 right-4 z-50">
        <button className="bg-blue-600 text-white p-2 md:p-3 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ParcelTracker;