import Button from "@/components/Button";
import { Link } from "react-router-dom";
import { useUserContext } from "@/contexts/UserContext";
import { Users, Warehouse, Clock, Package, CheckCircle,  Inbox,  Plane } from "lucide-react";


const cards = [
  { title: "Tous les utilisateurs", icon: <Users className="w-10 h-10 text-blue-500" />, link: '/admin/all-users' },
  { title: "Tous les colis", icon: <Package className="w-10 h-10 text-gray-500" />, link: '/admin/all-shipments' },
  { title: "Colis en attente", icon: <Clock className="w-10 h-10 text-orange-500" />, link: '/admin/pending-shipments' },
  { title: "Colis reçus ᴾⁿⁱᶜᵉ ᴹⁱᵃᵐⁱ, ᶠᴸ ᵂᵃʳᵉʰᵒᵘˢᵉ", icon: <Warehouse className="w-10 h-10 text-purple-500" />, link: '/admin/received-shipments' },
  { title: "En transit", icon: <Plane className="w-10 h-10 text-red-500" />, link: '/admin/transit-shipments' },
  { title: "Colis disponibles", icon: <Inbox className="w-10 h-10 text-yellow-500" />, link: '/admin/available-shipments' },
  { title: "Colis livrés", icon: <CheckCircle className="w-10 h-10 text-green-500" />, link: '/admin/delivered-shipments' },
];

const AdminPage = () => {
  const { setUser } = useUserContext();
  

  const resetUserToBlank = {
    id: "",
    imageUrl: "",
    emailAddresses: [],
    firstName: "",
    lastName: "",
    username: "",
    createdAt: "",
    lastActiveAt: "",
    phoneNumbers: [],         // Add this
  banned: false,           // Add this
  twoFactorEnabled: false
  };

  // Si l'utilisateur n'est pas connecté, afficher la page de connexion
  
  return (
    <>
      <div>
        <div className="px-10 md:px-20 py-10">
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-4xl">Admin Dashboard</h2>
            <Link to="/admin/add-shipment" onClick={() => setUser(resetUserToBlank)}>
              <Button  text="ajouter un colis" />
            </Link>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {cards.map((card, index) => (
          <Link to={card.link} key={index}>
            <div
              className="bg-white shadow-lg rounded-2xl p-6 flex items-center gap-4 hover:shadow-xl transition duration-300 cursor-pointer"
            >
              {card.icon}
              <h2 className="text-lg font-semibold text-gray-700">{card.title}</h2>
            </div>
          </Link>
        ))}
      </div>
      <TestWhatsAppButton />
    </>
  );
};

export default AdminPage;