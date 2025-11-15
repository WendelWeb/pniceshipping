import "./app.css";
// import { BrowserRouter, useRoutes } from "react-router-dom";
// import Navbar from "./components/Navbar";
// import { getAllShipments } from "./utils/shipmentQueries";
// import { useEffect } from "react";
// import { UserProvider } from "./contexts/UserContext";
// import { SettingsProvider } from "./contexts/SettingsContext";
// import { routes } from "./router/routes"; // Importation des routes
import AccountSuspended from "./pages/AccountSuspended";

// 🚫 SITE BLOQUÉ - n8n Account Suspended
// Pour débloquer le site, décommenter le code ci-dessous et commenter la ligne AccountSuspended

// // Composant pour rendre les routes
// const RouteRenderer = () => {
//   return useRoutes(routes);
// };

const App: React.FC = () => {
  // useEffect(() => {
  //   const fetchShipments = async () => {
  //     try {
  //       const response = await getAllShipments();
  //       if (response.length === 0) {
  //         console.log("No shipments found");
  //       }
  //       console.log(response);
  //     } catch (err) {
  //       console.log(err);
  //       alert(err);
  //     }
  //   };

  //   fetchShipments();
  // }, []);

  // 🚫 SITE BLOQUÉ - Affichage de la page de suspension uniquement
  return <AccountSuspended />;

  // Pour débloquer le site, commenter la ligne ci-dessus et décommenter le code ci-dessous:
  // return (
  //   <BrowserRouter>
  //     <UserProvider>
  //       <SettingsProvider autoRefreshInterval={30000}>
  //         <div className="min-h-screen bg-gray-100">
  //           <Navbar />
  //           <main className="container py-8 pt-20">
  //             <RouteRenderer /> {/* Utilisation du composant pour rendre les routes */}
  //           </main>
  //         </div>
  //       </SettingsProvider>
  //     </UserProvider>
  //   </BrowserRouter>
  // );
};

export default App;
