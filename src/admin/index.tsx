import LoginPrompt from "@/pages/LoginPrompts";
import { useUser } from "@clerk/clerk-react";
import { Navigate, Outlet } from "react-router-dom";
import { isAdminEmail } from "./adminEmails";

const IndexAdmin = () => {
  const { isSignedIn } = useUser();
  const { user } = useUser();

  if (!isSignedIn) {
    return <LoginPrompt />;
  }

  // Récupérer l'email principal de l'utilisateur
  const userEmail = user?.emailAddresses?.[0]?.emailAddress || "";

  // Vérifier si l'utilisateur est un administrateur
  if (!isAdminEmail(userEmail)) {
    return <Navigate to="/dashboard" replace />; // Rediriger vers /dashboard si non-admin
  }

  return (
    <>
      <Outlet />
    </>
  );
};

export default IndexAdmin;
