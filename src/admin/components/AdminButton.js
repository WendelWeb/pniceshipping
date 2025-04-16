import { jsx as _jsx } from "react/jsx-runtime";
import { useUser } from "@clerk/clerk-react";
import { isAdminEmail } from "../adminEmails"; // Assurez-vous que le chemin correspond à votre structure
import { Link } from "react-router-dom";
import Button from "@/components/Button"; // Votre composant Button personnalisé
const AdminButton = () => {
    const { user, isSignedIn } = useUser();
    // Si l'utilisateur n'est pas connecté, ne rien afficher
    if (!isSignedIn) {
        return null;
    }
    // Récupérer l'email principal de l'utilisateur
    const userEmail = user?.emailAddresses?.[0]?.emailAddress || "";
    // Vérifier si l'utilisateur est un administrateur
    const isAdmin = isAdminEmail(userEmail);
    // Retourner le bouton uniquement si l'utilisateur est admin
    if (isAdmin) {
        return (_jsx(Link, { to: "/admin/dashboard", children: _jsx(Button, { text: "Admin" }) }));
    }
    // Sinon, ne rien retourner
    return null;
};
export default AdminButton;
