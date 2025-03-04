import { SignedOut, SignInButton, SignUpButton } from '@clerk/clerk-react';

const LoginPrompt = () => {
  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md max-w-md w-full p-8 text-center">
        {/* Icône d'alerte */}
        <svg
          className="mx-auto h-12 w-12 text-yellow-500 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v2m0 4h.01M12 4a8 8 0 100 16 8 8 0 000-16z"
          />
        </svg>

        {/* Message principal */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Connexion requise</h1>
        <p className="text-gray-600 mb-6">
          Vous devez être connecté pour accéder à cette page. Veuillez vous connecter ou créer un compte pour continuer.
        </p>

        {/* Boutons Clerk */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <SignedOut>
            <SignInButton>
              <button className="bg-blue-600 cursor-pointer text-white px-6 py-2 border rounded-md hover:bg-white hover:border-blue-600 hover:text-blue-600 transition duration-300">
                Se connecter
              </button>
            </SignInButton>
          </SignedOut>
          <SignedOut>
            <SignUpButton>
              <button className="bg-blue-600 cursor-pointer text-white px-6 py-2 border rounded-md hover:bg-white hover:border-blue-600 hover:text-blue-600 transition duration-300">
                Créer un compte
              </button>
            </SignUpButton>
          </SignedOut>
        </div>
      </div>
    </div>
  );
};

export default LoginPrompt;