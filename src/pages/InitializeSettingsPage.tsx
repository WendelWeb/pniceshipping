import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { initializeSettings } from '@/utils/settingsQueries';

/**
 * Page d'initialisation des paramètres
 * À utiliser UNE FOIS pour créer les valeurs par défaut
 * Ensuite, utiliser /admin/settings pour gérer les paramètres
 */
export default function InitializeSettingsPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleInitialize = async () => {
    setStatus('loading');
    setMessage('Initialisation en cours...');

    try {
      const success = await initializeSettings();

      if (success) {
        setStatus('success');
        setMessage('Paramètres initialisés avec succès ! Vous pouvez maintenant aller sur /admin/settings');
      } else {
        setStatus('error');
        setMessage('Erreur lors de l\'initialisation. Vérifiez que la table settings existe.');
      }
    } catch (error: any) {
      setStatus('error');
      setMessage(`Erreur: ${error.message}`);
      console.error('Initialization error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 shadow-2xl max-w-2xl w-full"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
            <Settings className="w-8 h-8 text-blue-400" />
          </div>
          <div>
            <h1 className="font-bold text-3xl text-white mb-1">
              Initialiser les Paramètres
            </h1>
            <p className="text-gray-400 text-sm">
              Configuration initiale du système de tarifs dynamiques
            </p>
          </div>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6 mb-6">
          <h2 className="font-semibold text-white mb-3">ℹ️ Informations</h2>
          <ul className="text-gray-300 text-sm space-y-2">
            <li>• Cette opération doit être effectuée <strong>UNE SEULE FOIS</strong></li>
            <li>• Elle créera les valeurs par défaut pour les tarifs et articles spéciaux</li>
            <li>• Si les paramètres existent déjà, ils ne seront pas écrasés</li>
            <li>• Après initialisation, utilisez <code className="bg-gray-800 px-2 py-1 rounded">/admin/settings</code> pour gérer</li>
          </ul>
        </div>

        <div className="bg-gray-800/50 border border-gray-600/50 rounded-xl p-6 mb-6">
          <h2 className="font-semibold text-white mb-3">📋 Valeurs par défaut</h2>
          <div className="text-gray-300 text-sm space-y-3">
            <div>
              <h3 className="font-semibold text-white mb-2">Tarifs d'expédition :</h3>
              <ul className="ml-4 space-y-1">
                <li>• Frais de service : <span className="text-green-400">10$</span></li>
                <li>• Cap-Haïtien : <span className="text-green-400">4.5$ /lbs</span></li>
                <li>• Port-au-Prince : <span className="text-green-400">5$ /lbs</span></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">Articles spéciaux (12) :</h3>
              <ul className="ml-4 space-y-1">
                <li>• iPhone XR → 11 Pro Max : <span className="text-green-400">35$</span></li>
                <li>• iPhone 12 → 13 Pro Max : <span className="text-green-400">50$</span></li>
                <li>• iPhone 14 → 15 Pro Max : <span className="text-green-400">70$</span></li>
                <li>• iPhone 16 → 16 Pro Max : <span className="text-green-400">100$</span></li>
                <li>• iPhone 17 : <span className="text-green-400">130$</span></li>
                <li>• Samsung & Autres (prix à définir)</li>
                <li>• Ordinateurs : <span className="text-green-400">90$</span></li>
                <li>• Starlink : <span className="text-green-400">120$</span></li>
              </ul>
            </div>
          </div>
        </div>

        {status === 'idle' && (
          <motion.button
            onClick={handleInitialize}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl hover:from-blue-500 hover:to-blue-400 transition-all duration-200 font-semibold text-lg flex items-center justify-center gap-2"
          >
            <Settings className="w-6 h-6" />
            Initialiser les Paramètres
          </motion.button>
        )}

        {status === 'loading' && (
          <div className="bg-gray-800 rounded-xl p-6 flex items-center justify-center gap-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <RefreshCw className="w-6 h-6 text-blue-400" />
            </motion.div>
            <p className="text-gray-300">{message}</p>
          </div>
        )}

        {status === 'success' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-500/10 border border-green-500/30 rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <h3 className="font-semibold text-white">Succès !</h3>
            </div>
            <p className="text-gray-300 mb-4">{message}</p>
            <a
              href="/admin/settings"
              className="inline-block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors"
            >
              Aller aux Paramètres →
            </a>
          </motion.div>
        )}

        {status === 'error' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-500/10 border border-red-500/30 rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <AlertTriangle className="w-6 h-6 text-red-400" />
              <h3 className="font-semibold text-white">Erreur</h3>
            </div>
            <p className="text-gray-300 mb-4">{message}</p>
            <button
              onClick={() => setStatus('idle')}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Réessayer
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
