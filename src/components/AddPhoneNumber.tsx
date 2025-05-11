import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { db } from '../../configs/index.ts';
import { userWhatsappPhoneNumbers } from '../../configs/schema.ts';
import { eq } from 'drizzle-orm';

interface AddPhoneNumberProps {
  onPhoneAdded: () => void;
  isEditing?: boolean;
}

const AddPhoneNumber = ({ onPhoneAdded, isEditing = false }: AddPhoneNumberProps) => {
  const { user, isSignedIn } = useUser();
  const [phoneDigits, setPhoneDigits] = useState('');
  const [error, setError] = useState('');
  const [existingPhone, setExistingPhone] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Vérifier si un numéro existe déjà
  useEffect(() => {
    if (!isSignedIn || !user?.id) return;
    const fetchPhone = async () => {
      try {
        const result = await db
          .select({ phone: userWhatsappPhoneNumbers.phone })
          .from(userWhatsappPhoneNumbers)
          .where(eq(userWhatsappPhoneNumbers.ownerId, user.id));
        if (result.length > 0) {
          const phone = result[0].phone;
          setExistingPhone(phone);
          // Extraire les 8 derniers chiffres pour l'édition
          setPhoneDigits(phone.slice(-8));
        }
      } catch (err) {
        console.error('Erreur lors de la vérification du numéro:', err);
      }
    };
    fetchPhone();
  }, [user, isSignedIn]);

  const validatePhoneDigits = (digits: string) => {
    const digitsRegex = /^\d{8}$/;
    return digitsRegex.test(digits);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!validatePhoneDigits(phoneDigits)) {
      setError('Veuillez entrer exactement 8 chiffres pour le numéro.');
      return;
    }

    if (!isSignedIn || !user?.id) {
      setError('Vous devez être connecté pour enregistrer un numéro.');
      return;
    }

    const fullPhone = `+509${phoneDigits}`;
    setIsLoading(true);
    try {
      if (existingPhone) {
        // Mise à jour du numéro existant
        await db
          .update(userWhatsappPhoneNumbers)
          .set({ phone: fullPhone, updatedAt: new Date() })
          .where(eq(userWhatsappPhoneNumbers.ownerId, user.id));
        setSuccessMessage('Numéro WhatsApp mis à jour avec succès !');
      } else {
        // Enregistrement d'un nouveau numéro
        await db.insert(userWhatsappPhoneNumbers).values({
          phone: fullPhone,
          ownerId: user.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        setSuccessMessage('Numéro WhatsApp enregistré avec succès !');
      }
      setTimeout(() => {
        onPhoneAdded();
      }, 1500);
    } catch (err) {
      console.error('Erreur lors de l’enregistrement du numéro:', err);
      setError('Une erreur s’est produite. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isSignedIn) {
    return null; // La modale ne s'affiche pas si non connecté (géré par Dashboard)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          {isEditing ? 'Modifier votre numéro WhatsApp' : 'Ajouter votre numéro WhatsApp'}
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          {isEditing
            ? 'Modifiez ou confirmez votre numéro WhatsApp. Ce numéro est utilisé pour vous envoyer des messages WhatsApp et SMS automatiques concernant vos futurs colis.'
            : 'Veuillez entrer votre numéro WhatsApp pour continuer. Ce numéro est essentiel pour vous envoyer des messages WhatsApp et SMS automatiques concernant vos futurs colis.'}
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="phoneDigits" className="block text-sm font-medium text-gray-700">
              Numéro WhatsApp
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                +509
              </span>
              <input
                type="text"
                id="phoneDigits"
                value={phoneDigits}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, ''); // Autoriser seulement les chiffres
                  if (value.length <= 8) {
                    setPhoneDigits(value);
                  }
                }}
                placeholder="12345678"
                className="flex-1 block w-full px-3 py-2 border border-gray-300 rounded-none rounded-r-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                maxLength={8}
              />
            </div>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            {successMessage && <p className="mt-2 text-sm text-green-600">{successMessage}</p>}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 px-4 rounded-md text-white font-medium ${
              isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? 'Enregistrement...' : isEditing ? 'Mettre à jour' : 'Enregistrer'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPhoneNumber;