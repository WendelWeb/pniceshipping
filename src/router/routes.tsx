import Admin from "../admin/Admin.tsx"; // ou "@/admin/index" selon le fichier réel
import AdminPage from "@/admin/AdminPage";
import AddShipment from "@/admin/add-shipment/AddShipment";
import ShipmentView from "@/components/ShipmentView.tsx";
import AboutPage from "@/pages/About";
import AllShipments from "@/pages/AllShipments";
import ConfirmDeliveryPage from "@/pages/ConfirmDeliveryPage.tsx";
import Dashboard from "@/pages/Dashboard";
import Home from "@/pages/Home";
import MarkShipmentAsAvailable from "@/pages/MarkShipmentAsAvailable";
import MarkShipmentAsConfirmed from "@/pages/MarkShipmentAsConfirmed";
import MarkShipmentAsDelivered from "@/pages/MarkShipmentAsDelivered";
import MarkShipmentAsTransit from "@/pages/MarkShipmentAsTransit";
import NotFound from "@/pages/NotFound";
import Pricing from "@/pages/Pricing";
import UserList from "@/pages/UserList";
import { RouteObject } from "react-router-dom";

// Définition des routes sous forme de tableau d'objets RouteObject
export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/about",
    element: <AboutPage />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/shipment/:id",
    element: <ShipmentView />, // Nouvelle route pour la vue du colis
  },
  
  {
    path: "/pricing",
    element: <Pricing />,
  },
  {
    path: "/admin",
    element: <Admin />,
    children: [
      {
        path: "dashboard",
        element: <AdminPage />,
        children:[
          {
            path:'add-shipment',
            element: <AddShipment />
          }
        ]
      },
      {
        path: "add-shipment",
        element: <AddShipment />,
      },
      {
        path: "all-users",
        element: <UserList />,
      },
      {
        path: "all-shipments",
        element: <AllShipments />,
      },
      {
        path: "pending-shipments",
        element: <MarkShipmentAsConfirmed />,
      },
      {
        path: "received-shipments",
        element: <MarkShipmentAsTransit />,
      },
      {
        path: "transit-shipments",
        element: <MarkShipmentAsAvailable />,
      },
      {
        path: "available-shipments",
        element: <MarkShipmentAsDelivered />,
      },
      {
        path: "confirm-delivery",
        element: <ConfirmDeliveryPage />,
      },
      
     
      
    ],
  },

  {
    path: "*",
    element: <NotFound />,
  },
];
