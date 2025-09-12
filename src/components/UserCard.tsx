import React, { useState, useEffect } from "react";
import { Mail, Phone, Calendar, Lock, UserCheck, Shield, PackageSearch, Plus, Activity, TrendingUp, Sparkles, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useUserContext } from "@/contexts/UserContext";
import { UserType } from "@/types/user";
import { findByOwnerId } from "@/utils/shipmentQueries";
import { Shipment } from "@/types/shipment";
import { motion } from "framer-motion";

const UserCard: React.FC<{ user: UserType }> = ({ user }) => {
  const { setUser } = useUserContext();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Formater les dates
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

  // Charger les colis via l'API
  useEffect(() => {
    const fetchShipments = async () => {
      try {
        setLoading(true);
        const data = await findByOwnerId(user.id);
        setShipments(data);
        setError(null);
      } catch (err) {
        setError("Erreur lors du chargement des colis");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchShipments();
  }, [user.id]);

  // Calculer les statistiques des colis
  const totalShipments = shipments.length;
  const receivedShipments = shipments.filter((s) => s.status === "Recu📦").length;
  const transitShipments = shipments.filter((s) => s.status === "En Transit✈️").length;
  const availableShipments = shipments.filter((s) => s.status === "Disponible🟢").length;
  const deliveredShipments = shipments.filter((s) => s.status === "Livré✅").length;

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.25, 0, 1]
      }
    }
  };

  const statsVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const statItemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ 
        scale: 1.02,
        y: -5,
        transition: { duration: 0.2 }
      }}
      className="group relative"
    >
      {/* Glow Effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-emerald-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
      
      <div className="relative bg-gray-800/90 backdrop-blur-xl border border-gray-700/50 rounded-2xl overflow-hidden shadow-xl group-hover:shadow-2xl transition-all duration-300">
        
        {/* Header avec Avatar et Infos Principales */}
        <div className="relative bg-gradient-to-br from-slate-800 via-gray-800 to-slate-900 px-6 py-6">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5" />
          
          <div className="relative flex items-center gap-4">
            <motion.div 
              className="relative"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              {/* Avatar Glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur opacity-20" />
              
              <div className="relative">
                {user.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="h-16 w-16 rounded-full object-cover border-2 border-gray-600 shadow-lg"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center border-2 border-gray-600 shadow-lg">
                    <User className="w-8 h-8 text-white" />
                  </div>
                )}
                
                {/* Online Status */}
                <motion.div 
                  className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-gray-800 shadow-sm"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            </motion.div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-bold text-gray-100 truncate">
                  {user.firstName} {user.lastName}
                </h2>
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 5 }}
                >
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                </motion.div>
              </div>
              <p className="text-gray-400 text-sm mb-2">@{user.username}</p>
              
              {/* Quick Stats */}
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1 text-blue-400">
                  <Activity className="w-3 h-3" />
                  <span>{totalShipments} colis</span>
                </div>
                {user.twoFactorEnabled && (
                  <div className="flex items-center gap-1 text-green-400">
                    <Shield className="w-3 h-3" />
                    <span>2FA</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Contenu Principal */}
        <div className="p-6 space-y-6">
          
          {/* Informations Contact */}
          <motion.div 
            className="space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
              <User className="w-4 h-4" />
              Informations 👤
            </h3>
            
            <div className="grid grid-cols-1 gap-3">
              <motion.div 
                className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors duration-200"
                whileHover={{ x: 2 }}
              >
                <Mail className="h-4 w-4 text-blue-400 flex-shrink-0" />
                <a
                  href={`mailto:${user.emailAddresses[0]?.emailAddress}`}
                  className="text-sm text-gray-300 hover:text-blue-400 transition-colors truncate"
                >
                  {user.emailAddresses[0]?.emailAddress || "Email non disponible"}
                </a>
              </motion.div>

              <motion.div 
                className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg"
                whileHover={{ x: 2 }}
              >
                <Phone className="h-4 w-4 text-green-400 flex-shrink-0" />
                <span className="text-sm text-gray-300">
                  {user.phoneNumbers.length > 0 ? user.phoneNumbers[0] : "📱 Non renseigné"}
                </span>
              </motion.div>

              <motion.div 
                className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg"
                whileHover={{ x: 2 }}
              >
                <Calendar className="h-4 w-4 text-purple-400 flex-shrink-0" />
                <span className="text-sm text-gray-300">Inscrit le {formattedCreatedAt}</span>
              </motion.div>

              <motion.div 
                className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg"
                whileHover={{ x: 2 }}
              >
                <UserCheck className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                <span className="text-sm text-gray-300">Dernière activité : {formattedLastActive}</span>
              </motion.div>

              <div className="grid grid-cols-2 gap-3">
                <motion.div 
                  className="flex items-center gap-2 p-3 bg-gray-700/30 rounded-lg"
                  whileHover={{ x: 2 }}
                >
                  <Shield className={`h-4 w-4 flex-shrink-0 ${user.banned ? 'text-red-400' : 'text-green-400'}`} />
                  <span className={`text-xs ${user.banned ? 'text-red-300' : 'text-green-300'}`}>
                    {user.banned ? "🚫 Banni" : "✅ Actif"}
                  </span>
                </motion.div>

                <motion.div 
                  className="flex items-center gap-2 p-3 bg-gray-700/30 rounded-lg"
                  whileHover={{ x: 2 }}
                >
                  <Lock className={`h-4 w-4 flex-shrink-0 ${user.twoFactorEnabled ? 'text-green-400' : 'text-gray-400'}`} />
                  <span className={`text-xs ${user.twoFactorEnabled ? 'text-green-300' : 'text-gray-400'}`}>
                    {user.twoFactorEnabled ? "🔐 2FA" : "🔓 No 2FA"}
                  </span>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Statistiques Colis */}
          <motion.div 
            className="relative bg-gradient-to-br from-gray-700/20 to-gray-800/20 backdrop-blur-sm p-4 rounded-xl border border-gray-600/30"
            variants={statsVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-semibold text-gray-300">Activité Colis 📊</h3>
            </div>
            
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <motion.div
                  className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <span className="ml-2 text-sm text-gray-400">Chargement...</span>
              </div>
            ) : error ? (
              <p className="text-sm text-red-400 py-2">{error}</p>
            ) : (
              <motion.div className="space-y-3" variants={statsVariants}>
                {[
                  { label: "Total colis", value: totalShipments, color: "text-blue-400", bg: "bg-blue-500/10" },
                  { label: "Reçus 📦", value: receivedShipments, color: "text-purple-400", bg: "bg-purple-500/10" },
                  { label: "Disponibles 🟢", value: availableShipments, color: "text-green-400", bg: "bg-green-500/10" },
                  { label: "En Transit ✈️", value: transitShipments, color: "text-amber-400", bg: "bg-amber-500/10" },
                  { label: "Livrés ✅", value: deliveredShipments, color: "text-emerald-400", bg: "bg-emerald-500/10" },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    variants={statItemVariants}
                    className={`flex justify-between items-center p-2 rounded-lg ${stat.bg} hover:bg-opacity-20 transition-colors duration-200`}
                  >
                    <span className="text-sm text-gray-300">{stat.label}</span>
                    <motion.span 
                      className={`font-bold text-sm ${stat.color}`}
                      whileHover={{ scale: 1.1 }}
                    >
                      {stat.value}
                    </motion.span>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Actions Footer */}
        <div className="px-6 pb-6">
          <div className="flex gap-3">
            <Link to={`/client-shipments/${user.id}`} className="flex-1">
              <motion.button
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-700/50 hover:bg-gray-700/70 text-gray-300 hover:text-white rounded-xl transition-all duration-200 text-sm font-medium group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  whileHover={{ rotate: 15 }}
                  transition={{ duration: 0.2 }}
                >
                  <PackageSearch className="h-4 w-4" />
                </motion.div>
                Voir les Colis
              </motion.button>
            </Link>
            
            <Link
              to="/admin/add-shipment"
              state={{ user }}
              onClick={() => setUser(user)}
            >
              <motion.button 
                className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl transition-all duration-200 text-sm font-medium shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  whileHover={{ rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  <Plus className="h-4 w-4" />
                </motion.div>
                Ajouter Coli
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default UserCard;