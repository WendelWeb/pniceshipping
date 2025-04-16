import "./app.css";
import { BrowserRouter, useRoutes } from "react-router-dom";
import Navbar from "./components/Navbar";
// import { getAllShipments } from "./utils/shipmentQueries";
// import { useEffect } from "react";
import { UserProvider } from "./contexts/UserContext";
import { routes } from "./router/routes"; // Importation des routes
import Footer from "./components/Footer";

// Composant pour rendre les routes
const RouteRenderer = () => {
  return useRoutes(routes);
};

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

  return (
    <BrowserRouter>
      <UserProvider>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <main className="container py-8 pt-20">
            <RouteRenderer /> {/* Utilisation du composant pour rendre les routes */}
          </main>
          <Footer />
        </div>
      </UserProvider>
    </BrowserRouter>
  );
};

export default App;