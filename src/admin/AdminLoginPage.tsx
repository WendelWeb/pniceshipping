import { SignInButton, SignedOut,  useUser } from "@clerk/clerk-react";
import AdminPage from "./AdminPage";

const AdminAccessPage = () => {
  const { user } = useUser();
  if (user) {
    return <AdminPage />;
  }
  return (
    <div className="min-h-screen bg-blue-600 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-white mb-6">
          Accès Administrateur
        </h2>
        <p className="text-xl text-blue-100 mb-8">
          Connectez-vous ou inscrivez-vous pour accéder à l'espace
          administrateur
        </p>
      </div>

      <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 font-bold sm:space-x-4 w-full max-w-md items-center justify-center">
        <SignedOut>
          <SignInButton>
            <button className="bg-white cursor-pointer hover: text-blue-600 px-6 py-2 border rounded-md transform   hover:scale-110 hover:bg-white hover:border-blue-600 hover:text-blue-600 transition duration-300">
              Se connecter
            </button>
          </SignInButton>
        </SignedOut>
      </div>
    </div>
  );
};

export default AdminAccessPage;
