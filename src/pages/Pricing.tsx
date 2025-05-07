import PricingCalculator from "../components/PricingCalculator";
// import { findByEmail } from "@/utils/shipmentQueries";
// import { useEffect,useState } from "react";
// interface Shipment {
//   id: number;
//   fullName: string;
//   userName: string;
//   category: string;
//   emailAdress: string;
//   trackingNumber: string;
//   weight: string;
//   status: string;
// }

const Pricing = () => {
  // const [shipments, setShipments] = useState<Shipment[]>([]);

  // // const allShipments = await findByEmail('');
  // console.log(shipments);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const data = await findByEmail("stanleywendeljoseph@gmail.com");
  //     setShipments(data);
  //     console.log(data); // Affichera directement les résultats
  //   };

  //   fetchData();
  // }, []);
  return (
    <div className="max-w-6xl mx-auto px-4 py-12" id="pricings">
      <h1 className="text-4xl font-bold text-center mb-10">Nos Tarifs</h1>

      {/* Banner */}
      <div className="bg-gray-100 rounded-lg p-8 text-center mb-12">
        <h2 className="text-2xl font-semibold text-blue-600 mb-4">
          Tarification Simple et Transparente
        </h2>
        <p className="text-lg">
          Chez Pnice Shipping, nous croyons en une tarification claire sans
          frais cachés.
        </p>
      </div>

      {/* Main pricing cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-16">
        {/* Service Fee Card */}
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-5xl font-bold text-blue-600 mb-4">10$</div>
          <h3 className="text-xl font-bold mb-3">Frais de Service</h3>
          <p className="text-gray-600 mb-6">
            Frais de traitement standard appliqués à chaque expédition
          </p>
          <hr className="my-6" />
          <ul className="text-left">
            <li className="flex items-center py-2">
              <span className="text-blue-600 mr-2">✓</span> Traitement de
              commande
            </li>
            <li className="flex items-center py-2">
              <span className="text-blue-600 mr-2">✓</span> Suivi en ligne
            </li>
            <li className="flex items-center py-2">
              <span className="text-blue-600 mr-2">✓</span> Service client
            </li>
          </ul>
        </div>

        {/* Per pound pricing Card */}
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-5xl font-bold text-blue-600 mb-4">4.5$</div>
          <h3 className="text-xl font-bold mb-3">Par Livre (lbs)</h3>
          <p className="text-gray-600 mb-6">
            Tarif standard basé sur le poids de votre colis
          </p>
          <hr className="my-6" />
          <ul className="text-left">
            <li className="flex items-center py-2">
              <span className="text-blue-600 mr-2">✓</span> Pesée précise
            </li>
            <li className="flex items-center py-2">
              <span className="text-blue-600 mr-2">✓</span> Tarification
              transparente
            </li>
            <li className="flex items-center py-2">
              <span className="text-blue-600 mr-2">✓</span> Sans frais cachés
            </li>
          </ul>
        </div>
      </div>

      {/* Special fees section */}
      <h2 className="text-2xl font-bold text-center mb-8">
        Frais Spéciaux pour Appareils Électroniques
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {/* PC */}
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-bold mb-2">Ordinateurs</h3>
          <p className="text-xl font-bold text-blue-600 mb-2">
            <a
              href="https://wa.me/50931970548"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
              >
              Contactez Nous
            </a>
            .
          </p>
          <p className="text-gray-600">
            Protection spéciale et emballage sécurisé
          </p>
        </div>

        {/* Laptop */}
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <h3 className="text-lg font-bold mb-2">Ordinateurs Portables</h3>
          <p className="text-xl font-bold text-blue-600 mb-2">+90$</p>
          <p className="text-gray-600">
            Emballage sécurisé avec protection contre les chocs
          </p>
        </div>

        {/* Phone */}
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-bold mb-2">Téléphones</h3>
          <p className="text-xl font-bold text-blue-600 mb-2">+60$</p>
          <p className="text-gray-600">
            Protection spécialisée pour appareils mobiles
          </p>
        </div>

        {/* TV */}
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-bold mb-2">Télévisions</h3>
          <p className="text-xl font-bold text-blue-600 mb-2">
          <a
              href="https://wa.me/50931970548"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
              >
              Contactez Nous
            </a>
          </p>
          <p className="text-gray-600">
            Emballage renforcé et manipulation spéciale
          </p>
        </div>
      </div>

      <PricingCalculator />

      {/* Contact section */}
      <div className="text-center">
        <h3 className="text-xl font-bold mb-3">
          Des Questions sur nos Tarifs?
        </h3>
        <p className="mb-4">
          Notre équipe est disponible pour répondre à toutes vos questions
        </p>
        <a
          target="_blank"
          href="https://wa.me/50948812652?text=Bonjour,%20je%20souhaite%20obtenir%20plus%20d%27informations%20sur%20vos%20services%20de%20livraison.%20Pouvez-vous%20m%27aider%20%3F"
          className="text-blue-600 font-bold hover:underline"
        >
          Contactez-nous
        </a>
      </div>
    </div>
  );
};

export default Pricing;
