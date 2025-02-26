import { useUser } from "@clerk/clerk-react";
import {
  SignInButton,
  SignedIn,
  SignedOut,
} from "@clerk/clerk-react";

const HeroSection = () => {
  const { user } = useUser();
  console.log(user?.lastName);
  console.log(user);
  const userLastName = user?.firstName;

  return (
    <>
      {user && <h2 className="absolute font-bold top-25 text-1xl left-5 md:text-2xl"><span className="text-blue-600">Bienvenue</span> {userLastName}</h2>}
      <div className="min-h-[80vh] bg-white pt-5">
        {/* Version Desktop */}
        <div className="hidden md:flex items-center justify-between max-w-7xl mx-auto px-6 py-12">
          <div className="w-1/2 pr-8">
            <h1 className="text-5xl font-bold mb-6  text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-yellow-500">
            <span className="">

              PARTENAIRE D'EXPÉDITION

            </span>
              <br />
               DE CONFIANCE
            </h1>
            <p className="text-gray-700 text-lg mb-8">
              Découvrez une fiabilité inégalée avec nos services de livraison. En tant que
              partenaire de confiance, nous privilégions des solutions d'expédition
              ponctuelles, sécurisées et fluides, vous offrant une tranquillité d'esprit.
            </p>

            <SignedOut>
              <SignInButton>
                <button className="bg-blue-600 cursor-pointer text-white px-6 py-2 border rounded-md hover:bg-white hover:border-blue-600 hover:text-blue-600 transition duration-300">
                  Se connecter
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <button className="bg-blue-600 cursor-pointer text-white px-6 py-2 border rounded-md hover:bg-white hover:border-blue-600 hover:text-blue-600 transition duration-300">
                Tableau de bord
              </button>
            </SignedIn>

            
          </div>
          <div className="w-1/2">
            <img
              src="./hero.png"
              alt="Personnel de livraison souriant"
              className="rounded-lg shadow-xl"
            />
          </div>
        </div>

        {/* Version Mobile */}
        <div className="md:hidden px-4 py-8">
          <div className="text-center mb-8">
            
            <h1 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-yellow-500">
            <span className=" ">

              PARTENAIRE D'EXPÉDITION

            </span>
              <br />
               DE CONFIANCE
            </h1>
            <p className="text-gray-700 mb-8">
              Découvrez une fiabilité inégalée avec nos services de livraison. En tant que
              partenaire de confiance, nous privilégions des solutions d'expédition
              ponctuelles, sécurisées et fluides, vous offrant une tranquillité d'esprit.
            </p>
            <SignedOut>
              <SignInButton>
                <button className="bg-blue-600 cursor-pointer text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors w-full flex items-center justify-center">
                  Se connecter
                  <svg
                    className="w-4 h-4 ml-2 translate-y-[2px]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <button className="bg-blue-600 cursor-pointer text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors w-full flex items-center justify-center">
                Mon Tableau de bord
                <svg
                  className="w-4 h-4 ml-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </button>
            </SignedIn>
          </div>
          <div className="mb-8">
            <img
              src="./hero-1.png"
              alt="Personnel de livraison avec presse-papiers"
              className="rounded-lg shadow-lg w-full"
            />
          </div>
          
        </div>
      </div>
    </>
  );
};

export default HeroSection;