import { motion } from "framer-motion";
import { Home, Search, ArrowLeft, AlertTriangle, Compass, RefreshCw } from "lucide-react";

const NotFound = () => {
  const handleGoHome = () => {
    window.location.href = '/';
  };

  const handleGoBack = () => {
    window.history.back();
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white flex items-center justify-center p-4">
      {/* Animated background particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -inset-10 opacity-20">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-red-400 rounded-full"
              initial={{
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
              }}
              animate={{
                y: [null, -15, 15, -10],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: Math.random() * 4 + 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 3,
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          {/* 404 Number with glitch effect */}
          <motion.div
            className="relative mb-8"
            animate={{ 
              textShadow: [
                "0 0 10px rgba(239, 68, 68, 0.5)",
                "2px 2px 0px rgba(239, 68, 68, 0.8), -2px -2px 0px rgba(59, 130, 246, 0.8)",
                "0 0 10px rgba(239, 68, 68, 0.5)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <h1 className="text-8xl md:text-9xl font-black bg-gradient-to-r from-red-500 via-orange-500 to-red-600 bg-clip-text text-transparent select-none">
              404
            </h1>
          </motion.div>

          {/* Error Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, delay: 0.3, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-500/20 to-orange-500/20 backdrop-blur-xl border border-red-500/30 rounded-2xl mb-6 shadow-2xl"
          >
            <motion.div
              animate={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <AlertTriangle className="w-10 h-10 text-red-400" />
            </motion.div>
          </motion.div>

          {/* Main Title */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent"
          >
            Page introuvable 🛸
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed max-w-2xl mx-auto"
          >
            Oups ! Il semblerait que cette page ait pris des vacances prolongées. 🏖️
            <br />
            Peut-être s'est-elle perdue dans l'espace numérique ou a-t-elle décidé de devenir invisible pour échapper aux regards indiscrets.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            {/* Home Button */}
            <motion.button
              onClick={handleGoHome}
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-xl shadow-blue-500/25 min-w-48 overflow-hidden"
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.5)" 
              }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-center justify-center">
                <Home className="w-5 h-5 mr-2" />
                <span>Retour à l'accueil</span>
                <motion.div
                  className="ml-2"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  🏠
                </motion.div>
              </div>
            </motion.button>

            {/* Back Button */}
            <motion.button
              onClick={handleGoBack}
              className="group px-6 py-4 bg-gray-800/50 backdrop-blur-xl border border-gray-600/50 text-gray-200 font-medium rounded-xl hover:bg-gray-700/50 hover:border-gray-500/50 transition-all duration-300 min-w-48"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-center">
                <ArrowLeft className="w-5 h-5 mr-2" />
                <span>Page précédente</span>
              </div>
            </motion.button>
          </motion.div>

          {/* Additional Options */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto"
          >
            {[
              {
                icon: Search,
                title: "Rechercher",
                description: "Trouvez ce que vous cherchez",
                emoji: "🔍",
                action: () => window.location.href = '/search'
              },
              {
                icon: Compass,
                title: "Explorer",
                description: "Découvrez nos services",
                emoji: "🧭",
                action: () => window.location.href = '/explore'
              },
              {
                icon: RefreshCw,
                title: "Actualiser",
                description: "Recharger la page",
                emoji: "🔄",
                action: handleRefresh
              }
            ].map((option, index) => (
              <motion.div
                key={index}
                className="group bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6 hover:bg-gray-700/40 hover:border-blue-500/30 transition-all duration-300 cursor-pointer"
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={option.action}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
              >
                <motion.div
                  className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg mb-4 group-hover:from-blue-600/20 group-hover:to-purple-600/20 transition-all duration-300"
                  whileHover={{ rotate: 5, scale: 1.1 }}
                >
                  <option.icon className="w-6 h-6 text-gray-400 group-hover:text-blue-400 transition-colors duration-300" />
                </motion.div>
                <h3 className="font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors duration-300">
                  {option.title} {option.emoji}
                </h3>
                <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                  {option.description}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Fun Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.5 }}
            className="mt-12 p-6 bg-gradient-to-r from-purple-900/30 to-blue-900/30 backdrop-blur-xl border border-purple-500/20 rounded-xl"
          >
            <motion.p
              className="text-gray-300 italic"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              💡 <strong>Le saviez-vous ?</strong> Les erreurs 404 tirent leur nom du bureau 404 du CERN, 
              où se trouvait le premier serveur web au monde. Aujourd'hui, elles nous rappellent 
              que même dans le monde numérique, il arrive qu'on se perde ! ✨
            </motion.p>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating Elements */}
      <motion.div
        className="fixed top-10 left-10 opacity-20"
        animate={{ 
          rotate: 360,
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
          scale: { duration: 2, repeat: Infinity }
        }}
      >
        <div className="w-16 h-16 border-2 border-red-400 rounded-full" />
      </motion.div>

      <motion.div
        className="fixed bottom-10 right-10 opacity-20"
        animate={{ 
          rotate: -360,
          y: [0, -10, 0]
        }}
        transition={{ 
          rotate: { duration: 15, repeat: Infinity, ease: "linear" },
          y: { duration: 3, repeat: Infinity }
        }}
      >
        <div className="w-8 h-8 bg-blue-400 rounded-full" />
      </motion.div>
    </div>
  );
};

export default NotFound;