import React from "react";
import { Mail, Phone, Calendar, Lock, UserCheck, Shield, PackageSearch } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from "@/contexts/UserContext";
import { UserType } from "@/types/user";

const UserCard: React.FC<{ user: UserType }> = ({ user }) => {
  console.log(user);
  
  const { setUser } = useUserContext();
  const navigate = useNavigate();

  // Convertir la date d'inscription et la dernière activité
  const formattedCreatedAt = new Date(user.createdAt).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedLastActive = new Date(user.lastActiveAt).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:scale-105">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="bg-white rounded-full p-1">
              <img
                src={user.imageUrl}
                alt={`${user.firstName} ${user.lastName}`}
                className="h-16 w-16 rounded-full object-cover border-2 border-white"
              />
            </div>
          </div>
          <div className="ml-4 text-white">
            <h2 className="text-xl font-bold">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-blue-100">@{user.username}</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center text-gray-700">
            <Mail className="h-5 w-5 mr-2 text-blue-500" />
            <a
              href={`mailto:${user.emailAddresses[0]?.emailAddress}`}
              className="text-sm hover:underline"
            >
              {user.emailAddresses[0]?.emailAddress || "Email non disponible"}
            </a>
          </div>

          <div className="flex items-center text-gray-700">
            <Phone className="h-5 w-5 mr-2 text-blue-500" />
            <span className="text-sm">
              {user.phoneNumbers.length > 0 ? user.phoneNumbers[0] : "Téléphone non renseigné"}
            </span>
          </div>

          <div className="flex items-center text-gray-700">
            <Calendar className="h-5 w-5 mr-2 text-blue-500" />
            <span className="text-sm">Inscrit le {formattedCreatedAt}</span>
          </div>

          <div className="flex items-center text-gray-700">
            <UserCheck className="h-5 w-5 mr-2 text-green-500" />
            <span className="text-sm">Dernière activité : {formattedLastActive}</span>
          </div>

          <div className="flex items-center text-gray-700">
            <Shield className="h-5 w-5 mr-2 text-gray-500" />
            <span className="text-sm">
              {user.banned ? "Utilisateur banni" : "Compte actif"}
            </span>
          </div>

          <div className="flex items-center text-gray-700">
            <Lock className="h-5 w-5 mr-2 text-red-500" />
            <span className="text-sm">
              {user.twoFactorEnabled ? "2FA activé" : "2FA non activé"}
            </span>
          </div>
        </div>

        {/* Statistiques d'activité */}
        <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
          <h3 className="text-gray-900 text-sm font-semibold mb-2">📦 Activité Colis</h3>
          <ul className="space-y-2 text-gray-700 text-sm">
            <li className="flex justify-between border-b py-1">
              <span>Total colis :</span>
              <span className="font-bold">18</span>
            </li>
            <li className="flex justify-between border-b py-1">
              <span>📦 Reçus :</span>
              <span className="font-bold">10</span>
            </li>
            <li className="flex justify-between border-b py-1">
              <span>🟢 Disponibles :</span>
              <span className="font-bold">5</span>
            </li>
            <li className="flex justify-between border-b py-1">
              <span>✈️ En transit :</span>
              <span className="font-bold">1</span>
            </li>
            <li className="flex justify-between">
              <span>✅ Livrés :</span>
              <span className="font-bold">2</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between px-4 pb-4">
        <button
          className="text-blue-500 hover:text-blue-700 text-sm font-medium flex items-center"
          onClick={() => navigate(`/user-shipments/${user.id}`)}
        >
          <PackageSearch className="h-4 w-4 mr-2" /> Voir Les Colis
        </button>
        <Link
          to="/admin/add-shipment"
          state={{ user }}
          onClick={() => setUser(user)}
        >
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm">
            Ajouter Un Coli
          </button>
        </Link>
      </div>
    </div>
  );
};

export default UserCard;
