import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Shipment } from "@/types/shipment";
import { markMultipleShipmentsAsDelivered } from "../utils/shipmentQueries";
import { SERVICE_FEE, getShippingRate, FIXED_ITEM_RATES } from "@/constants/shippingRates";
import { sendDeliveredEmail } from "@/services/emailServices";

const ConfirmDeliveryPage = () => {
  const { state } = useLocation();
  // Ignorer totalCost de state car il pourrait contenir plusieurs frais de service
  const { selectedShipments, selectedUserId }: { selectedShipments: Shipment[]; selectedUserId: string; totalCost?: number } = state || {};
  const navigate = useNavigate();
  const [isDelivering, setIsDelivering] = useState(false);

  // Mappage des catégories normalisées aux clés de FIXED_ITEM_RATES
  const categoryMapping: Record<string, string> = {
    telephone: "telephones",
    telephones: "telephones",
    téléphone: "telephones",
    téléphones: "telephones",
    ordinateurportbable: "ordinateurs_portables",
    ordinateurportable: "ordinateurs_portables",
    ordinateursportables: "ordinateurs_portables",
    ordinateurportables: "ordinateurs_portables",
    starlink: "starlink",
  };

  if (!selectedShipments || !selectedUserId) {
    return <div className="p-6 text-center text-red-600">Erreur : Aucune donnée de livraison trouvée.</div>;
  }

  // Calcul des coûts individuels pour chaque colis (STRICTEMENT sans le frais de service)
  const totalWeight = selectedShipments.reduce((sum, s) => sum + parseFloat(s.weight || "0"), 0);
  const shipmentCosts = selectedShipments.map((shipment) => {
    const shippingRate = getShippingRate(shipment.destination);
    const poids = parseFloat(shipment.weight || "0");
    const normalizedCategory = shipment.category
      ?.toLowerCase()
      .replace(/[\s-]/g, "")
      .replace("portbable", "portables")
      .replace(/[éèê]/g, "e");
    let cost = 0;
    let isFixedRate = false;
    let fixedRateCategory: string | undefined;

    if (normalizedCategory) {
      const mappedCategory = categoryMapping[normalizedCategory] || normalizedCategory;
      if (mappedCategory in FIXED_ITEM_RATES) {
        // Tarif fixe SANS le frais de service
        cost = FIXED_ITEM_RATES[mappedCategory];
        isFixedRate = true;
        fixedRateCategory = mappedCategory
          .charAt(0)
          .toUpperCase()
          + mappedCategory.slice(1).replace("_", " ");
      } else {
        // Coût au poids SANS le frais de service
        cost = poids * shippingRate;
        isFixedRate = false;
      }
    } else {
      // Coût au poids SANS le frais de service
      cost = poids * shippingRate;
      isFixedRate = false;
    }

    // Retourner uniquement le coût d'expédition sans frais de service
    return { cost, isFixedRate, fixedRateCategory };
  });

  // Somme des coûts d'expédition individuels de tous les colis (sans frais de service)
  const shippingCost = shipmentCosts.reduce((sum, { cost }) => sum + cost, 0);
  
  // Ajouter UN SEUL frais de service au total, peu importe le nombre de colis
  const calculatedTotalCost = shippingCost + SERVICE_FEE;
  
  // Si un totalCost est fourni par l'état, nous l'ignorons car il pourrait inclure plusieurs frais de service
  // Nous utilisons toujours notre calcul avec un seul frais de service
  const finalTotalCost = calculatedTotalCost;

  const handleConfirmDelivery = async () => {
    setIsDelivering(true);
    try {
      const shipmentIds = selectedShipments.map((s) => s.id);
      
      // Nous ne pouvons pas passer directement le coût total à la fonction markMultipleShipmentsAsDelivered
      // car elle n'accepte que 2 paramètres
      const { deliveredShipments } = await markMultipleShipmentsAsDelivered(
        shipmentIds, 
        selectedUserId
      );

      // Nous devons nous assurer que le backend applique un seul frais de service
      // Si nécessaire, implémenter cette logique côté serveur

      for (const shipment of deliveredShipments) {
        await sendDeliveredEmail(shipment.fullName, shipment.emailAdress, shipment.trackingNumber);
      }

      navigate("/admin/available-shipments", { state: { success: true } });
    } catch (error) {
      console.error("Erreur lors de la confirmation:", error);
    } finally {
      setIsDelivering(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-100 to-blue-50 min-h-screen">
      <div className="max-w-5xl mx-auto p-6">
        <header className="mb-8">
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">
            Confirmer la Livraison
          </h2>
          <p className="text-gray-600 mt-2 text-lg">Vérifiez les détails avant de confirmer</p>
        </header>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Colis à livrer ({selectedShipments.length})</h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {selectedShipments.map((shipment, index) => {
              const { cost, isFixedRate, fixedRateCategory } = shipmentCosts[index];
              const shippingRate = getShippingRate(shipment.destination);

              return (
                <div key={shipment.id} className="bg-gray-50 p-4 rounded-lg shadow-sm">
                  <p className="text-lg font-semibold text-gray-800">#{shipment.trackingNumber}</p>
                  <p><strong>Nom :</strong> {shipment.fullName}</p>
                  <p><strong>Username :</strong> @{shipment.userName}</p>
                  <p><strong>Email :</strong> {shipment.emailAdress}</p>
                  <p><strong>Destination :</strong> {shipment.destination}</p>
                  <p><strong>Catégorie :</strong> {shipment.category}</p>
                  <p><strong>Poids :</strong> {shipment.weight} lbs</p>
                  <p>
                    <strong>Coût d'expédition :</strong> ${cost.toFixed(2)}{" "}
                    {isFixedRate
                      ? ` (Tarif fixe pour ${fixedRateCategory})`
                      : ` ($${shippingRate}/lb)`}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Résumé</h3>
          <p><strong>Poids total :</strong> {totalWeight.toFixed(2)} lbs</p>
          <p><strong>Coût total d'expédition :</strong> ${shippingCost.toFixed(2)}</p>
          <p><strong>Frais de service unique :</strong> ${SERVICE_FEE.toFixed(2)} (un seul pour tous les {selectedShipments.length} colis)</p>
          <p className="text-lg font-bold text-indigo-600 mt-2"><strong>Total à payer :</strong> ${finalTotalCost.toFixed(2)}</p>
          <div className="mt-6 flex gap-4">
            <button
              onClick={handleConfirmDelivery}
              disabled={isDelivering}
              className={`flex-1 cursor-pointer px-6 py-3 rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all duration-300 ${
                isDelivering
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:from-indigo-700 hover:to-blue-700 hover:shadow-xl"
              }`}
            >
              {isDelivering ? (
                <div className="animate-spin h-5 w-5 border-t-2 border-b-2 border-white rounded-full"></div>
              ) : (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              )}
              Confirmer la Livraison
            </button>
            <button
              onClick={() => navigate("/mark-delivered")}
              className="px-6 py-3 cursor-pointer rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-all duration-300"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeliveryPage;