import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import LoginPrompt from "@/pages/LoginPrompts";
import { useUser } from "@clerk/clerk-react";
import { Navigate, Outlet } from "react-router-dom";
import { isAdminEmail } from "./adminEmails";
const Admin = () => {
    const { isSignedIn } = useUser();
    const { user } = useUser();
    if (!isSignedIn) {
        return _jsx(LoginPrompt, {});
    }
    // Récupérer l'email principal de l'utilisateur
    const userEmail = user?.emailAddresses?.[0]?.emailAddress || "";
    // Vérifier si l'utilisateur est un administrateur
    if (!isAdminEmail(userEmail)) {
        return _jsx(Navigate, { to: "/dashboard", replace: true }); // Rediriger vers /dashboard si non-admin
    }
    return (_jsx(_Fragment, { children: _jsx(Outlet, {}) }));
};
export default Admin;
