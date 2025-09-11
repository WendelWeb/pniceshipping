import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ShippingModel: React.FC = () => {
  const [hoveredField, setHoveredField] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (field: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  const glowVariants = {
    initial: { boxShadow: "0 0 0 rgba(99, 102, 241, 0)" },
    hover: { 
      boxShadow: "0 0 30px rgba(99, 102, 241, 0.3)",
      transition: { duration: 0.3 }
    }
  };

  const fieldData = [
    { label: "Votre Nom *", value: "Votre Nom", id: "name", highlight: false },
    { label: "Votre Prénom *", value: "Votre Prénom + PQ-067054", id: "firstname", highlight: true },
    { label: "Adresse *", value: "8298 Northwest 68th Street", id: "address", highlight: false },
    { label: "Appartement, Suite, etc. (optionnel)", value: "PQ-067054", id: "apt", highlight: true },
    { label: "Ville *", value: "Miami", id: "city", highlight: false },
    { label: "État *", value: "Florida", id: "state", highlight: false },
    { label: "Code Postal *", value: "33166", id: "zip", highlight: false }
  ];

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-4 md:p-8"
    >
      <motion.div 
        className="max-w-3xl mx-auto"
        variants={glowVariants}
        initial="initial"
        whileHover="hover"
      >
        {/* Glass morphism container */}
        <div className="relative backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
          {/* Animated gradient border */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-20 blur-xl animate-pulse" />
          
          <div className="relative z-10 p-8 md:p-12">
            {/* Header */}
            <motion.div 
              variants={itemVariants}
              className="text-center mb-10"
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-6 shadow-lg"
              >
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </motion.div>
              
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-3">
                Modèle d'Adresse d'Expédition
              </h2>
              <div className="h-1 w-24 bg-gradient-to-r from-indigo-500 to-purple-600 mx-auto rounded-full" />
            </motion.div>

            {/* Instructions */}
            <motion.div 
              variants={itemVariants}
              className="mb-10 p-6 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-2xl border border-indigo-500/20"
            >
              <p className="text-gray-300 leading-relaxed space-y-3">
                <span className="block">Ce modèle vous montre comment structurer correctement vos adresses d'expédition pour vos colis. Veuillez suivre ces étapes :</span>
                
                <motion.span 
                  className="flex items-start gap-3 mt-4"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <span className="flex-shrink-0 w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center text-indigo-400 font-bold">1</span>
                  <span>Assurez-vous d'inclure votre <span className="text-indigo-400 font-semibold">nom et le code unique PQ-067054</span>, car ce code est extrêmement important pour identifier et traiter votre colis correctement. Sans ce code, votre colis pourrait être <span className="text-red-400 font-semibold">retardé ou perdu.</span></span>
                </motion.span>
                
                <motion.span 
                  className="flex items-start gap-3"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <span className="flex-shrink-0 w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center text-indigo-400 font-bold">2</span>
                  <span>Copiez ce format exact dans votre formulaire d'expédition ou sur votre étiquette, en remplaçant les informations par les vôtres.</span>
                </motion.span>
                
                <motion.span 
                  className="flex items-start gap-3"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <span className="flex-shrink-0 w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center text-indigo-400 font-bold">3</span>
                  <span><span className="text-indigo-400 font-semibold">Vous devez envoyer votre colis à l'adresse indiquée dans ce modèle | 8298 Northwest 68th Street Miami Fl, 33166</span></span>
                </motion.span>
              </p>
            </motion.div>

            {/* Form fields */}
            <motion.div 
              variants={itemVariants}
              className="space-y-6"
            >
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="w-2 h-2 bg-indigo-500 rounded-full"
                />
                Adresse d'Expédition (Modèle)
              </h3>

              <div className="grid gap-4">
                {fieldData.map((field, index) => (
                  <motion.div
                    key={field.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative"
                    onMouseEnter={() => setHoveredField(field.id)}
                    onMouseLeave={() => setHoveredField(null)}
                  >
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      {field.label}
                    </label>
                    <div className="relative group">
                      <input
                        type="text"
                        value={field.value}
                        readOnly
                        className={`
                          w-full px-4 py-3 rounded-xl border transition-all duration-300
                          ${field.highlight 
                            ? 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-indigo-500/30 text-indigo-300' 
                            : 'bg-white/5 border-white/10 text-gray-300'}
                          focus:outline-none focus:border-indigo-500/50 focus:shadow-lg focus:shadow-indigo-500/20
                          ${hoveredField === field.id ? 'transform scale-[1.02] shadow-lg' : ''}
                        `}
                      />
                      
                      {/* Copy button */}
                      <AnimatePresence>
                        {hoveredField === field.id && (
                          <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            onClick={() => handleCopy(field.id, field.value)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                          >
                            {copiedField === field.id ? (
                              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            )}
                          </motion.button>
                        )}
                      </AnimatePresence>
                      
                      {/* Highlight indicator */}
                      {field.highlight && (
                        <motion.div
                          className="absolute -right-2 -top-2"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <div className="w-3 h-3 bg-indigo-500 rounded-full animate-ping absolute" />
                          <div className="w-3 h-3 bg-indigo-500 rounded-full" />
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Important note */}
            <motion.div 
              variants={itemVariants}
              className="mt-10 p-6 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-2xl border border-amber-500/20"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-start gap-3">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="flex-shrink-0"
                >
                  <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </motion.div>
                <div>
                  <p className="text-amber-300 text-sm leading-relaxed">
                    <strong className="text-amber-400">Remarque importante :</strong> Le code <code className="px-2 py-1 bg-amber-500/20 rounded text-amber-400 font-mono">PQ-067054</code> doit apparaître dans votre nom ou dans l'adresse optionnelle pour garantir le traitement de votre colis. Si vous avez des questions, contactez notre service client.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ShippingModel;