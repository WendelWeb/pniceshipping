import { HandIcon } from "@heroicons/react/solid"; // Nécessite l'installation de Heroicons

const ParcelTracker = () => {
  return (
    <div className="flex flex-col items-center p-4 max-w-md mx-auto">
      {/* Titre */}
      <h1 className="text-4xl font-bold mb-4">Suivez votre colis</h1>

      {/* Texte d'instruction */}
      <p className="text-sm text-gray-500 mb-6 text-center">
        Pour suivre votre colis sur Pnice, entrez votre numéro de suivi fourni
        par le vendeur ou la plateforme auprès de laquelle vous avez effectué
        votre achat. Nous assurons uniquement le transport de votre colis.
      </p>

      {/* Formulaire */}
      <form className="w-full">
        <label
          className="block text-sm font-bold mb-2"
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
      <div className="mt-6 flex flex-wrap justify-center gap-4">
        <a href="#guide" className="text-black underline hover:text-blue-500">
          Ce que vous pouvez envoyer
        </a>
        <a href="#guide" className="text-black underline hover:text-blue-500">
          Guide des tailles et poids des colis
        </a>
      </div>
    </div>
  );
};

export default ParcelTracker;
