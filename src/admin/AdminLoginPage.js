import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { SignInButton, SignedOut, useUser } from "@clerk/clerk-react";
import AdminPage from "./AdminPage";
const AdminAccessPage = () => {
    const { user } = useUser();
    if (user) {
        return _jsx(AdminPage, {});
    }
    return (_jsxs("div", { className: "min-h-screen bg-blue-600 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8", children: [_jsxs("div", { className: "text-center", children: [_jsx("h2", { className: "text-3xl font-extrabold text-white mb-6", children: "Acc\u00E8s Administrateur" }), _jsx("p", { className: "text-xl text-blue-100 mb-8", children: "Connectez-vous ou inscrivez-vous pour acc\u00E9der \u00E0 l'espace administrateur" })] }), _jsx("div", { className: "flex flex-col space-y-4 sm:flex-row sm:space-y-0 font-bold sm:space-x-4 w-full max-w-md items-center justify-center", children: _jsx(SignedOut, { children: _jsx(SignInButton, { children: _jsx("button", { className: "bg-white cursor-pointer hover: text-blue-600 px-6 py-2 border rounded-md transform   hover:scale-110 hover:bg-white hover:border-blue-600 hover:text-blue-600 transition duration-300", children: "Se connecter" }) }) }) })] }));
};
export default AdminAccessPage;
