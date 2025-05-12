import { HandIcon } from "@heroicons/react/solid"; // Nécessite l'installation de Heroicons

const ParcelTracker = () => {
  return (
    <div
      className="flex flex-col items-center p-4 w-full min-h-screen bg-cover bg-center sm:bg-[url('/tracking-image.png')]"
      style={{ backgroundImage: "url('/mobile-tracking-image.png')" }}
    >
      {/* Titre */}
      <h1 className="text-4xl font-bold mb-4 text-white bg-blue-600 bg-opacity-5 p-3 rounded">
        Suivez votre colis
      </h1>

      {/* Texte d'instruction */}
      <p className="text-sm mb-6 text-center text-white bg-gray-800 bg-opacity-5 p-3 rounded max-w-lg">
        Pour suivre votre colis sur Pnice, entrez votre numéro de suivi fourni par
        le vendeur ou la plateforme auprès de laquelle vous avez effectué votre
        achat. Nous assurons uniquement le transport de votre colis.
      </p>

      {/* Formulaire */}
      <form className="w-full max-w-lg">
        <label
          className="block text-sm font-bold mb-2 text-white bg-blue-600 bg-opacity-5 p-2 rounded"
          htmlFor="tracking-number"
        >
          Numéro de suivi*
        </label>

        {/* Conteneur pour le champ de saisie et le bouton */}
        <div className="flex flex-col md:flex-row items-center gap-4">
          <input
            id="tracking-number"
            type="text"
            className="w-full md:flex-grow p-2 border border-gray-300 rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Entrez le numéro de suivi"
          />
          <button className="w-full md:w-auto p-2 bg-blue-500 cursor-pointer text-white rounded flex items-center justify-center hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
            Suivre
            <HandIcon className="ml-2 h-5 w-5" />
          </button>
        </div>
      </form>

      {/* Hyperliens */}
      <div className="mt-4 flex flex-wrap justify-center gap-4">
        <a
          href="#guide"
          className="text-white underline bg-gray-800 bg-opacity-5 p-2 rounded hover:bg-blue-500 hover:bg-opacity-5"
        >
          Ce que vous pouvez envoyer
        </a>
        <a
          href="#guide"
          className="text-white underline bg-gray-800 bg-opacity-5 p-2 rounded hover:bg-blue-500 hover:bg-opacity-5"
        >
          Guide des tailles et poids des colis
        </a>
      </div>
    </div>
  );
};

export default ParcelTracker;