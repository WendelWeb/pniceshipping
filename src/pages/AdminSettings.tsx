import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Settings, DollarSign, Package, Smartphone, Plus, Trash2, Save, RefreshCw } from 'lucide-react';
import {
  getShippingRates,
  getSpecialItems,
  updateShippingRates,
  updateSpecialItems,
  addSpecialItem,
  deleteSpecialItem,
  updateSpecialItem,
  ShippingRates,
  SpecialItem,
  SpecialItemsConfig,
} from '@/utils/settingsQueries';
import { useUser } from '@clerk/clerk-react';
import { toast } from 'sonner';

export default function AdminSettings() {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Shipping rates
  const [shippingRates, setShippingRates] = useState<ShippingRates>({
    serviceFee: 10,
    rateCapHaitien: 4.5,
    ratePortAuPrince: 5,
  });

  // Special items
  const [specialItems, setSpecialItems] = useState<SpecialItemsConfig>({ items: [] });
  const [showAddItem, setShowAddItem] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    price: 0,
    category: 'phone' as 'phone' | 'computer' | 'other',
  });

  // Debounce timer for auto-save
  const debounceTimers = useRef<{ [key: string]: NodeJS.Timeout }>({});

  // Load data
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const [rates, items] = await Promise.all([
        getShippingRates(),
        getSpecialItems(),
      ]);
      setShippingRates(rates);
      setSpecialItems(items);
    } catch (error) {
      console.error('Error loading settings:', error);
      toast.error('Erreur lors du chargement des paramètres');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveShippingRates = async () => {
    try {
      setSaving(true);
      const success = await updateShippingRates(shippingRates, user?.id);
      if (success) {
        toast.success('Tarifs mis à jour avec succès');
      } else {
        toast.error('Erreur lors de la mise à jour');
      }
    } catch (error) {
      console.error('Error saving shipping rates:', error);
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  // Update special item with debounced save
  const handleUpdateSpecialItemInput = useCallback((itemId: string, updates: Partial<Omit<SpecialItem, 'id'>>) => {
    // Update local state immediately for responsive UI
    setSpecialItems(prev => ({
      items: prev.items.map(item =>
        item.id === itemId ? { ...item, ...updates } : item
      )
    }));

    // Clear existing timer for this item
    if (debounceTimers.current[itemId]) {
      clearTimeout(debounceTimers.current[itemId]);
    }

    // Set new timer to save after 1 second of no typing
    debounceTimers.current[itemId] = setTimeout(async () => {
      try {
        const success = await updateSpecialItem(itemId, updates, user?.id);
        if (success) {
          // Silent success, no toast to avoid spam
          console.log('Auto-saved:', itemId);
        } else {
          toast.error('Erreur lors de la sauvegarde');
          await loadSettings(); // Reload to revert
        }
      } catch (error) {
        console.error('Error auto-saving item:', error);
        toast.error('Erreur lors de la sauvegarde');
        await loadSettings();
      }
    }, 1000);
  }, [user?.id]);

  // For category changes, save immediately (no typing involved)
  const handleUpdateSpecialItemImmediate = async (itemId: string, updates: Partial<SpecialItem>) => {
    // Update local state immediately
    setSpecialItems(prev => ({
      items: prev.items.map(item =>
        item.id === itemId ? { ...item, ...updates } : item
      )
    }));

    try {
      const success = await updateSpecialItem(itemId, updates, user?.id);
      if (success) {
        toast.success('Article mis à jour');
      } else {
        toast.error('Erreur lors de la mise à jour');
        await loadSettings();
      }
    } catch (error) {
      console.error('Error updating item:', error);
      toast.error('Erreur lors de la mise à jour');
      await loadSettings();
    }
  };

  const handleDeleteSpecialItem = async (itemId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) return;

    try {
      const success = await deleteSpecialItem(itemId, user?.id);
      if (success) {
        await loadSettings();
        toast.success('Article supprimé');
      } else {
        toast.error('Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleAddSpecialItem = async () => {
    if (!newItem.name || newItem.price < 0) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    try {
      const success = await addSpecialItem(newItem, user?.id);
      if (success) {
        await loadSettings();
        setShowAddItem(false);
        setNewItem({ name: '', price: 0, category: 'phone' });
        toast.success('Article ajouté avec succès');
      } else {
        toast.error('Erreur lors de l\'ajout');
      }
    } catch (error) {
      console.error('Error adding item:', error);
      toast.error('Erreur lors de l\'ajout');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <RefreshCw className="w-12 h-12 text-blue-500" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4 md:px-20 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
            <Settings className="w-8 h-8 text-blue-400" />
          </div>
          <div>
            <h1 className="font-bold text-3xl text-white mb-1">Paramètres</h1>
            <p className="text-gray-400 text-sm">
              Gérer les tarifs et les articles spéciaux
            </p>
          </div>
        </div>

        {/* Shipping Rates Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 shadow-2xl mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <DollarSign className="w-6 h-6 text-green-400" />
            <h2 className="font-semibold text-xl text-white">Tarifs d'Expédition</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-gray-300 font-medium mb-2">
                Frais de Service ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={shippingRates.serviceFee}
                onChange={(e) =>
                  setShippingRates({ ...shippingRates, serviceFee: parseFloat(e.target.value) })
                }
                className="w-full p-3 bg-gray-800/50 border border-gray-600/50 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 text-white"
              />
            </div>

            <div>
              <label className="block text-gray-300 font-medium mb-2">
                Cap-Haïtien ($/lbs)
              </label>
              <input
                type="number"
                step="0.01"
                value={shippingRates.rateCapHaitien}
                onChange={(e) =>
                  setShippingRates({ ...shippingRates, rateCapHaitien: parseFloat(e.target.value) })
                }
                className="w-full p-3 bg-gray-800/50 border border-gray-600/50 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 text-white"
              />
            </div>

            <div>
              <label className="block text-gray-300 font-medium mb-2">
                Port-au-Prince ($/lbs)
              </label>
              <input
                type="number"
                step="0.01"
                value={shippingRates.ratePortAuPrince}
                onChange={(e) =>
                  setShippingRates({ ...shippingRates, ratePortAuPrince: parseFloat(e.target.value) })
                }
                className="w-full p-3 bg-gray-800/50 border border-gray-600/50 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 text-white"
              />
            </div>
          </div>

          <motion.button
            onClick={handleSaveShippingRates}
            disabled={saving}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-6 px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl hover:from-green-500 hover:to-green-400 transition-all duration-200 font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Enregistrement...' : 'Enregistrer les Tarifs'}
          </motion.button>
        </motion.div>

        {/* Special Items Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 shadow-2xl"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Smartphone className="w-6 h-6 text-purple-400" />
              <h2 className="font-semibold text-xl text-white">Articles Spéciaux</h2>
            </div>
            <motion.button
              onClick={() => setShowAddItem(!showAddItem)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-lg hover:from-purple-500 hover:to-purple-400 transition-all duration-200 font-semibold flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Ajouter
            </motion.button>
          </div>

          {/* Add New Item Form */}
          {showAddItem && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-gray-800/50 border border-purple-500/30 rounded-xl p-6 mb-6"
            >
              <h3 className="font-semibold text-white mb-4">Nouvel Article</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-300 font-medium mb-2">Nom</label>
                  <input
                    type="text"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500/50 text-white"
                    placeholder="Ex: iPhone 18"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 font-medium mb-2">Prix ($)</label>
                  <input
                    type="number"
                    value={newItem.price}
                    onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) })}
                    className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500/50 text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 font-medium mb-2">Catégorie</label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value as 'phone' | 'computer' | 'other' })}
                    className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500/50 text-white"
                  >
                    <option value="phone">Téléphone</option>
                    <option value="computer">Ordinateur</option>
                    <option value="other">Autre</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <motion.button
                  onClick={handleAddSpecialItem}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors"
                >
                  Ajouter
                </motion.button>
                <motion.button
                  onClick={() => setShowAddItem(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Annuler
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Items List */}
          <div className="space-y-3">
            {specialItems.items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-gray-800/50 border border-gray-600/50 rounded-xl p-4 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 flex-1">
                  <Package className="w-5 h-5 text-purple-400" />
                  <div className="flex-1">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => handleUpdateSpecialItemInput(item.id, { name: e.target.value })}
                      className="w-full bg-transparent text-white font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/30 rounded px-2 py-1"
                      placeholder="Nom de l'article"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) => handleUpdateSpecialItemInput(item.id, { price: parseFloat(e.target.value) || 0 })}
                      className="w-24 p-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500/50 text-white"
                      step="0.01"
                    />
                    <span className="text-gray-400">$</span>
                  </div>
                  <select
                    value={item.category}
                    onChange={(e) => handleUpdateSpecialItemImmediate(item.id, { category: e.target.value as 'phone' | 'computer' | 'other' })}
                    className="p-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
                  >
                    <option value="phone">📱 Phone</option>
                    <option value="computer">💻 Computer</option>
                    <option value="other">📦 Other</option>
                  </select>
                </div>
                <motion.button
                  onClick={() => handleDeleteSpecialItem(item.id)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </motion.button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
