import { useState, useEffect } from "react";
import UserCard from "../components/UserCard";
import { SearchIcon, ChevronDown } from "lucide-react";
import { UserType } from "@/types/user";



const SORT_OPTIONS = [
  { label: "Nom (A-Z)", value: "name_asc" },
  { label: "Nom (Z-A)", value: "name_desc" },
  { label: "Date d'inscription (Plus récent)", value: "date_newest" },
  { label: "Date d'inscription (Plus ancien)", value: "date_oldest" },
  { label: "Dernière connexion (Plus récent)", value: "last_active_newest" },
  { label: "Dernière connexion (Plus ancien)", value: "last_active_oldest" },
  { label: "Nom d'utilisateur (A-Z)", value: "username_asc" },
  { label: "Nom d'utilisateur (Z-A)", value: "username_desc" },
];

const UserList = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortOption, setSortOption] = useState<string>("name_asc");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          "https://pniceshippingbackend-2.onrender.com/api/users"
        );
        if (!response.ok) {
          throw new Error("Échec de la récupération des utilisateurs");
        }
        const data = await response.json();
        setUsers(data.data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Fonction de tri
  const sortUsers = (users: UserType[]) => {
    return [...users].sort((a, b) => {
      switch (sortOption) {
        case "name_asc":
          return a.firstName.localeCompare(b.firstName);
        case "name_desc":
          return b.firstName.localeCompare(a.firstName);
        case "date_newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "date_oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "last_active_newest":
          return new Date(b.lastActiveAt).getTime() - new Date(a.lastActiveAt).getTime();
        case "last_active_oldest":
          return new Date(a.lastActiveAt).getTime() - new Date(b.lastActiveAt).getTime();
        case "username_asc":
          return a.username.localeCompare(b.username);
        case "username_desc":
          return b.username.localeCompare(a.username);
        default:
          return 0;
      }
    });
  };

  const filteredUsers = sortUsers(
    users.filter((user) =>
      [user.firstName, user.lastName, user.username, ...user.emailAddresses.map(e => e.emailAddress)]
        .some(field => field.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-blue-600 mb-2">Gestion des Utilisateurs</h1>
        <p className="text-gray-600">Gérez et visualisez tous vos utilisateurs.</p>
      </div>

      {/* Search Bar & Sorting */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-2/3">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Rechercher par nom, email ou username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Sort Dropdown */}
        <div className="relative w-full md:w-1/3">
          <select
            className="block w-full py-2 pl-3 pr-10 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <ChevronDown className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* User List */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : filteredUsers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      ) : (
        <div className="bg-gray-100 rounded-lg p-8 text-center">
          <h3 className="mt-2 text-lg font-medium text-gray-900">Aucun utilisateur trouvé</h3>
          <p className="mt-1 text-gray-500">Essayez d'ajuster vos critères de recherche.</p>
        </div>
      )}
    </div>
  );
};

export default UserList;
