import { useState, useEffect } from "react";
import UserCard from "../components/UserCard";
import { Search, ChevronDown, Users, Filter, TrendingUp, Sparkles, UserCheck } from "lucide-react";
import { UserType } from "@/types/user";
import { motion } from "framer-motion";

const SORT_OPTIONS = [
  { label: "Nom (A-Z)", value: "name_asc", icon: "📝" },
  { label: "Nom (Z-A)", value: "name_desc", icon: "📝" },
  { label: "Date d'inscription (Plus récent)", value: "date_newest", icon: "🆕" },
  { label: "Date d'inscription (Plus ancien)", value: "date_oldest", icon: "🕰️" },
  { label: "Dernière connexion (Plus récent)", value: "last_active_newest", icon: "⚡" },
  { label: "Dernière connexion (Plus ancien)", value: "last_active_oldest", icon: "💤" },
  { label: "Nom d'utilisateur (A-Z)", value: "username_asc", icon: "🏷️" },
  { label: "Nom d'utilisateur (Z-A)", value: "username_desc", icon: "🏷️" },
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
        console.log(err);
        
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.25, 0, 1]
      }
    }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.25, 0, 1]
      }
    }
  };

  const statsVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.25, 0, 1]
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -50, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl"
        />
      </div>

      <div className="relative container mx-auto px-6 md:px-12 lg:px-20 py-12">
        {/* Header */}
        <motion.div 
          variants={headerVariants}
          initial="hidden"
          animate="visible"
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-4">
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                repeatDelay: 4
              }}
              className="p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl backdrop-blur-sm border border-gray-700/30"
            >
              <Users className="w-8 h-8 text-blue-400" />
            </motion.div>
            
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                Gestion des Utilisateurs
              </h1>
              <p className="text-gray-400 text-lg md:text-xl mt-2">
                Gérez et visualisez tous vos utilisateurs avec style 👥
              </p>
            </div>
          </div>

          {/* Stats Overview */}
          {!loading && !error && (
            <motion.div 
              variants={statsVariants}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8"
            >
              <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <UserCheck className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-100">{users.length}</p>
                    <p className="text-sm text-gray-400">Utilisateurs totaux</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-100">{filteredUsers.length}</p>
                    <p className="text-sm text-gray-400">Résultats filtrés</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-100">
                      {users.filter(u => u.twoFactorEnabled).length}
                    </p>
                    <p className="text-sm text-gray-400">Avec 2FA activé</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Search & Sort Controls */}
        <motion.div 
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col lg:flex-row gap-6 mb-8"
        >
          {/* Search Input */}
          <div className="flex-1 relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition duration-300" />
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Search className="h-5 w-5 text-gray-400" />
                </motion.div>
              </div>
              <input
                type="text"
                className="block w-full pl-12 pr-4 py-4 bg-gray-800/80 backdrop-blur-xl border border-gray-700/50 rounded-xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                placeholder="🔍 Rechercher par nom, email ou username..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Sort Dropdown */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition duration-300" />
            <div className="relative">
              <select
                className="block w-full lg:w-80 pl-4 pr-12 py-4 bg-gray-800/80 backdrop-blur-xl border border-gray-700/50 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 appearance-none cursor-pointer"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value} className="bg-gray-800">
                    {option.icon} {option.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <motion.div
                  animate={{ rotate: [0, 180, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                </motion.div>
              </div>
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Filter className="h-4 w-4 text-purple-400" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Content Area */}
        {loading ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <motion.div
              className="relative"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-6 text-center"
            >
              <h3 className="text-xl font-semibold text-gray-100 mb-2">Chargement des utilisateurs ⚡</h3>
              <p className="text-gray-400">Veuillez patienter pendant que nous récupérons les données...</p>
            </motion.div>
          </motion.div>
        ) : error ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-500/10 border border-red-500/20 rounded-xl p-8 text-center backdrop-blur-xl"
          >
            <div className="text-red-400 text-xl mb-2">❌ Erreur de chargement</div>
            <p className="text-red-300">{error}</p>
          </motion.div>
        ) : filteredUsers.length > 0 ? (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6"
          >
            {filteredUsers.map((user, index) => (
              <motion.div
                key={user.id}
                variants={itemVariants}
                custom={index}
              >
                <UserCard user={user} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-12 text-center"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="text-6xl mb-6"
            >
              🔍
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-100 mb-3">Aucun utilisateur trouvé</h3>
            <p className="text-gray-400 text-lg mb-6">
              Essayez d'ajuster vos critères de recherche ou de modifier le filtre de tri.
            </p>
            <motion.button
              onClick={() => {
                setSearchTerm("");
                setSortOption("name_asc");
              }}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl transition-all duration-300 font-medium"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              ↻ Réinitialiser les filtres
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default UserList;