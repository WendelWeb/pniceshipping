import { useState } from "react";

export default function PricingCalculator() {
  const [weight, setWeight] = useState(1);
  const [itemType, setItemType] = useState("standard");
  const [destination, setDestination] = useState("cap-haitien");
  // Tarifs spéciaux pour les appareils électroniques
  const specialRates: Record<string, { price: number; description: string }>= {
    ordinateurs_portables: { price: 30, description: "Emballage sécurisé avec protection contre les chocs" },
    telephones: { price: 20, description: "Protection spécialisée pour appareils mobiles" },
    televisions: { price: 40, description: "Emballage renforcé et manipulation spéciale" },
    starlink: {price: 20, description: "Frais Douane Supplementaire pour kit Starlink"}
  };

  // Tarifs de base selon la destination
  const getBaseRates = () => {
    if (destination === "port-au-prince") {
      return {
        serviceFee: 15,
        perLbsRate: 5
      };
    } else {
      return {
        serviceFee: 10,
        perLbsRate: 4.5
      };
    }
  };

  const { serviceFee, perLbsRate } = getBaseRates();
  
  // Frais supplémentaires pour le type d'article sélectionné
  const specialFee = itemType !== "standard" ? specialRates[itemType]?.price || 0 : 0;
  
  // Calcul du coût total
  const weightCost = weight * perLbsRate;
  const totalCost = serviceFee + weightCost + specialFee;

  // Obtenir un devis
 

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow" id="calculator">
      {/* En-tête */}
      <div className="flex items-center mb-8">
        <div className="bg-blue-600 p-2 rounded-lg mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold">Pnice Shipping</h1>
      </div>

      {/* Calculateur de tarif */}
      <div className="  rounded-lg  mb-8">
        <h2 className="text-2xl font-bold text-center mb-4">Calculez Votre Tarif</h2>
        <p className="text-center mb-8">Utilisez notre calculateur de tarif pour obtenir une estimation précise de vos frais d'expédition</p>

        <div className="mb-6">
          <label className="block mb-2 ">Destination</label>
          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full p-3 rounded  text-gray-800 border border-2 border-blue-600"
            
          >
            <option value="cap-haitien">Cap-Haïtien</option>
            <option value="port-au-prince">Port-au-Prince</option>
          </select>
          <div className="mt-2 text-sm">
            {destination === "port-au-prince" ? 
              "Port-au-Prince: $15 frais de service, $5/lbs" : 
              "Cap-Haïtien: $10 frais de service, $4.5/lbs"}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block mb-2">Poids (lbs)</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="w-full p-3 rounded text-gray-800 border border-2 border-blue-600"
              placeholder="Poids en livres"
              min="1"
              step="0.1"
            />
          </div>
          <div>
            <label className="block mb-2">Type d'objet</label>
            <select
              value={itemType}
              onChange={(e) => setItemType(e.target.value)}
              className="w-full p-3 rounded text-gray-800 border border-2 border-blue-600"
            >
              <option value="standard">Standard</option>
              {Object.keys(specialRates).map((key) => (
                <option key={key} value={key} >
                  {key.replace("_", " ").charAt(0).toUpperCase() + key.replace("_", " ").slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-white text-gray-800 p-4 rounded mb-6">
          <h3 className="font-bold mb-2">Estimation des coûts:</h3>
          <div className="grid grid-cols-2 gap-2">
            <div>Frais de service:</div>
            <div className="text-right">${serviceFee.toFixed(2)}</div>
            <div>Frais par poids ({weight} lbs):</div>
            <div className="text-right">${weightCost.toFixed(2)}</div>
            {specialFee > 0 && (
              <>
                <div>Frais spéciaux ({itemType.replace("_", " ")}):</div>
                <div className="text-right">${specialFee.toFixed(2)}</div>
              </>
            )}
            <div className="font-bold text-blue-600">Total:</div>
            <div className="text-right font-bold text-blue-600">${totalCost.toFixed(2)}</div>
          </div>
        </div>

        
      </div>

      
    </div>
  );
}