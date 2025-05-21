import { HandIcon } from "@heroicons/react/solid";
import { Truck, Info, Package } from "lucide-react";

const HaitiShippingInfo = () => {
  return (
    <div
      className="flex flex-col items-center p-2 md:p-4 w-full min-h-screen bg-cover bg-center sm:bg-[url('/tracking-image.png')]"
      style={{ backgroundImage: "url('/mobile-tracking-image.png')" }}
    >
      {/* En-tête avec image responsive */}
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden mb-6 md:mb-8">
        <div className="relative">
          {/* Image pour mobile */}
          <div className="md:hidden">
            <div 
              className="h-32 bg-cover bg-center" 
              style={{ backgroundImage: "url('/mobile-tracking-image.png')" }}
            >
              <div className="absolute inset-0 bg-blue-900 bg-opacity-70 flex flex-col items-center justify-center px-4">
                <h1 className="text-2xl font-bold text-white text-center">
                  Expédition vers Haïti
                </h1>
                <p className="text-sm text-blue-100 mt-1 text-center">
                  Livraison rapide avec notifications par e-mail
                </p>
              </div>
            </div>
          </div>
          
          {/* Image pour desktop */}
          <div className="hidden md:block">
            <div 
              className="h-40 bg-cover bg-center" 
              style={{ backgroundImage: "url('/tracking-image.png')" }}
            >
              <div className="absolute inset-0 bg-blue-900 bg-opacity-70 flex flex-col items-center justify-center">
                <h1 className="text-4xl font-bold text-white text-center px-4">
                  Votre expédition vers Haïti en temps réel
                </h1>
                <p className="text-lg text-blue-100 mt-2">
                  Livraison fiable avec notifications à chaque étape
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-4 md:p-6">
          <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6 text-center bg-gray-800 bg-opacity-50 p-3 rounded">
            Une fois votre colis reçu dans notre entrepôt, il est envoyé à l'aéroport le soir même ou le lendemain soir. Ensuite, il sera disponible en Haïti dans un délai de 3 à 5 jours. Vous recevrez des e-mails à chaque étape du processus pour suivre l'avancement de votre colis.
          </p>
        </div>
      </div>

      

      {/* FAQ avec image responsive */}
      <div className="hidden md:block">
        <img 
          src="/tracking-image.png" 
          alt="Support client" 
          className="w-auto rounded" 
        />
      </div>
      <div className="md:hidden">
        <img 
          src="/mobile-tracking-image.png" 
          alt="Support client" 
          className="w-auto rounded" 
        />
      </div>
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden mb-6 md:mb-8">
        <div className="bg-gray-50 p-3 md:p-4 border-b flex justify-between items-center">
          <h2 className="text-lg md:text-xl font-bold text-gray-800">Questions fréquentes</h2>
        </div>
        
        <div className="p-4 md:p-6">
          <div className="space-y-3 md:space-y-4">
            <div className="border-b pb-3 md:pb-4">
              <h3 className="font-medium text-gray-800 mb-1 md:mb-2 text-sm md:text-base">Quand mon colis arrivera-t-il en Haïti ?</h3>
              <p className="text-gray-600 text-xs md:text-sm">Une fois reçu dans notre entrepôt, votre colis est envoyé à l'aéroport le soir même ou le lendemain soir. Il arrivera en Haïti dans les 3 à 5 jours suivants.</p>
            </div>
            
            <div className="border-b pb-3 md:pb-4">
              <h3 className="font-medium text-gray-800 mb-1 md:mb-2 text-sm md:text-base">Recevrai-je des notifications sur l'avancement de mon colis ?</h3>
              <p className="text-gray-600 text-xs md:text-sm">Oui, vous recevrez des e-mails à chaque étape du processus : réception à l'entrepôt, départ pour l'aéroport, et arrivée en Haïti.</p>
            </div>
            
            <div className="border-b pb-3 md:pb-4">
              <h3 className="font-medium text-gray-800 mb-1 md:mb-2 text-sm md:text-base">Que faire si mon colis est retardé ?</h3>
              <p className="text-gray-600 text-xs md:text-sm">Si votre colis est retardé, contactez notre service client pour plus d'informations.</p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-800 mb-1 md:mb-2 text-sm md:text-base">Les colis sont-ils assurés ?</h3>
              <p className="text-gray-600 text-xs md:text-sm">Tous nos envois incluent une assurance de base. Une assurance premium est disponible pour une couverture supplémentaire.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bouton d'assistance */}
      <div className="fixed bottom-4 right-4 z-50">
        <button className="bg-blue-600 text-white p-2 md:p-3 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200">
          <HandIcon className="h-5 w-5 md:h-6 md:w-6" />
        </button>
      </div>
    </div>
  );
};

export default HaitiShippingInfo;