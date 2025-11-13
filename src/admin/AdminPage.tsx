import Button from "@/components/Button";
import { Link } from "react-router-dom";
import { useUserContext } from "@/contexts/UserContext";
import { Users, Warehouse, Clock, Package, CheckCircle, Inbox, Plane, Plus, Sparkles, Settings } from "lucide-react";
import { motion } from "framer-motion";

const cards = [
  { 
    title: "Tous les utilisateurs", 
    icon: <Users className="w-10 h-10 text-blue-400" />, 
    link: '/admin/all-users',
    gradient: "from-blue-500/20 to-cyan-500/20",
    glowColor: "shadow-blue-500/20"
  },
  { 
    title: "Tous les colis", 
    icon: <Package className="w-10 h-10 text-purple-400" />, 
    link: '/admin/all-shipments',
    gradient: "from-purple-500/20 to-pink-500/20",
    glowColor: "shadow-purple-500/20"
  },
  { 
    title: "Colis en attente ⏳", 
    icon: <Clock className="w-10 h-10 text-amber-400" />, 
    link: '/admin/pending-shipments',
    gradient: "from-amber-500/20 to-orange-500/20",
    glowColor: "shadow-amber-500/20"
  },
  { 
    title: "Colis reçus 🏢", 
    subtitle: "ᴾⁿⁱᶜᵉ ᴹⁱᵃᵐⁱ, ᶠᴸ ᵂᵃʳᵉʰᵒᵘˢᵉ",
    icon: <Warehouse className="w-10 h-10 text-indigo-400" />, 
    link: '/admin/received-shipments',
    gradient: "from-indigo-500/20 to-purple-500/20",
    glowColor: "shadow-indigo-500/20"
  },
  { 
    title: "En transit ✈️", 
    icon: <Plane className="w-10 h-10 text-emerald-400" />, 
    link: '/admin/transit-shipments',
    gradient: "from-emerald-500/20 to-teal-500/20",
    glowColor: "shadow-emerald-500/20"
  },
  { 
    title: "Colis disponibles 📦", 
    icon: <Inbox className="w-10 h-10 text-yellow-400" />, 
    link: '/admin/available-shipments',
    gradient: "from-yellow-500/20 to-amber-500/20",
    glowColor: "shadow-yellow-500/20"
  },
  {
    title: "Colis livrés ✅",
    icon: <CheckCircle className="w-10 h-10 text-green-400" />,
    link: '/admin/delivered-shipments',
    gradient: "from-green-500/20 to-emerald-500/20",
    glowColor: "shadow-green-500/20"
  },
  {
    title: "Paramètres ⚙️",
    icon: <Settings className="w-10 h-10 text-cyan-400" />,
    link: '/admin/settings',
    gradient: "from-cyan-500/20 to-blue-500/20",
    glowColor: "shadow-cyan-500/20"
  },
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
    phoneNumbers: [],
    banned: false,
    twoFactorEnabled: false
  };

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

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.25, 0, 1]
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.25, 0, 1] }}
        className="relative"
      >
        {/* Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-emerald-500/5 blur-3xl" />
        
        <div className="relative px-6 md:px-12 lg:px-20 py-12 md:py-16">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6">
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="space-y-3"
            >
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3
                  }}
                >
                  <Sparkles className="w-8 h-8 text-purple-400" />
                </motion.div>
                <h1 className="font-bold text-4xl md:text-5xl lg:text-6xl bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
              </div>
              <p className="text-gray-400 text-lg md:text-xl max-w-2xl">
                Gérez votre plateforme logistique avec style et efficacité 🚀
              </p>
            </motion.div>
            
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link 
                to="/admin/add-shipment" 
                onClick={() => setUser(resetUserToBlank)}
                className="group"
              >
                <div className="relative">
                  {/* Glow effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-300" />
                  
                  <div className="relative flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-6 py-3 rounded-xl transition-all duration-300 shadow-lg">
                    <motion.div
                      whileHover={{ rotate: 90 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Plus className="w-5 h-5" />
                    </motion.div>
                    <Button text="Ajouter un colis" />
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Cards Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="px-6 md:px-12 lg:px-20 pb-20"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ 
                scale: 1.02,
                y: -5,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
              className="group"
            >
              <Link to={card.link}>
                <div className="relative h-full">
                  {/* Card Background with Glow */}
                  <div className={`absolute -inset-0.5 bg-gradient-to-r ${card.gradient} rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500`} />
                  
                  <div className="relative h-full bg-gray-800/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 transition-all duration-300 group-hover:border-gray-600/50 group-hover:shadow-2xl">
                    {/* Icon Container */}
                    <div className="flex items-start justify-between mb-4">
                      <motion.div
                        whileHover={{ 
                          scale: 1.1,
                          rotate: [0, -5, 5, 0]
                        }}
                        transition={{ duration: 0.3 }}
                        className="p-3 bg-gray-700/50 rounded-xl group-hover:bg-gray-700/70 transition-colors duration-300"
                      >
                        {card.icon}
                      </motion.div>
                      
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        whileHover={{ opacity: 1, scale: 1 }}
                        className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
                      />
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-gray-100 group-hover:text-white transition-colors duration-300 leading-tight">
                        {card.title}
                      </h3>
                      
                      {card.subtitle && (
                        <p className="text-xs text-gray-500 font-mono tracking-wider">
                          {card.subtitle}
                        </p>
                      )}
                    </div>

                    {/* Bottom Accent Line */}
                    <motion.div
                      className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${card.gradient.replace(/\/20/g, '')} rounded-b-2xl`}
                      initial={{ width: 0 }}
                      whileHover={{ width: '100%' }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"
        />
      </div>
    </div>
  );
};

export default AdminPage;