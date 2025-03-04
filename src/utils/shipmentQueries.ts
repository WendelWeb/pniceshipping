import { db } from '../../configs/index.ts'; // Ajustez l'import selon votre structure
import { shipmentListing } from '../../configs/schema.ts'; // Ajustez l'import selon votre structure
import { eq, or, like } from 'drizzle-orm';
import { StatusDates } from '@/types/shipment';
/**
 * Module de requêtes pour les expéditions
 * Permet de rechercher des expéditions par différents critères
 */

/**
 * Recherche des expéditions par nom d'utilisateur
 * @param username Nom d'utilisateur à rechercher
 * @returns Liste des expéditions correspondantes
 */
export const findByUsername = async (username: string) => {
  try {
    if (!username || username.trim() === '') {
      return [];
    }

    const results = await db
      .select()
      .from(shipmentListing)
      .where(eq(shipmentListing.userName, username));

    return results;
  } catch (error) {
    console.error('Erreur lors de la recherche par nom d\'utilisateur:', error);
    throw error;
  }
};

/**
 * Recherche des expéditions par adresse email
 * @param email Adresse email à rechercher
 * @returns Liste des expéditions correspondantes
 */
export const findByEmail = async (email: string) => {
  try {
    if (!email || email.trim() === '') {
      return [];
    }

    const results = await db
      .select()
      .from(shipmentListing)
      .where(eq(shipmentListing.emailAdress, email));

    return results;
  } catch (error) {
    console.error('Erreur lors de la recherche par email:', error);
    throw error;
  }
};
export const findByOwnerId = async (ownerId: string) => {
  try {
    if (!ownerId || ownerId.trim() === '') {
      return [];
    }

    const results = await db
      .select()
      .from(shipmentListing)
      .where(eq(shipmentListing.ownerId, ownerId));

    return results;
  } catch (error) {
    console.error('Erreur lors de la recherche par email:', error);
    throw error;
  }
};

/**
 * Recherche des expéditions par numéro de suivi
 * @param trackingNumber Numéro de suivi à rechercher
 * @returns Liste des expéditions correspondantes
 */
export const findByTrackingNumber = async (trackingNumber: string) => {
  try {
    if (!trackingNumber || trackingNumber.trim() === '') {
      return [];
    }

    const results = await db
      .select()
      .from(shipmentListing)
      .where(eq(shipmentListing.trackingNumber, trackingNumber));

    return results;
  } catch (error) {
    console.error('Erreur lors de la recherche par numéro de suivi:', error);
    throw error;
  }
};

/**
 * Recherche des expéditions avec une correspondance partielle
 * sur username, email ou numéro de suivi
 * @param searchTerm Terme de recherche
 * @returns Liste des expéditions correspondantes
 */
export const searchByAnyField = async (searchTerm: string) => {
  try {
    if (!searchTerm || searchTerm.trim() === '') {
      return [];
    }

    const sanitizedTerm = searchTerm.trim();
    
    const results = await db
      .select()
      .from(shipmentListing)
      .where(
        or(
          like(shipmentListing.userName, `%${sanitizedTerm}%`),
          like(shipmentListing.emailAdress, `%${sanitizedTerm}%`),
          like(shipmentListing.trackingNumber, `%${sanitizedTerm}%`)
        )
      );

    return results;
  } catch (error) {
    console.error('Erreur lors de la recherche multi-champs:', error);
    throw error;
  }
};

/**
 * Récupère une expédition par son identifiant
 * @param id Identifiant de l'expédition
 * @returns L'expédition trouvée ou null
 */
export const findById = async (id: number) => {
  try {
    const results = await db
      .select()
      .from(shipmentListing)
      .where(eq(shipmentListing.id, id));

    return results.length > 0 ? results[0] : null;
  } catch (error) {
    console.error('Erreur lors de la récupération par ID:', error);
    throw error;
  }
};




export const getAllShipments = async () => {
  try {
    const query = db.select().from(shipmentListing);
    
    
    
    return await query;
  } catch (error) {
    console.error('Erreur lors de la récupération de toutes les expéditions:', error);
    throw error;
  }
};





// UPDATE SHIPMENT





export const updateShipmentStatus = async (trackingNumber: string, newStatus:string, location: string) => {
  try {
    // Étape 1 : Récupérer l'enregistrement actuel du colis
    const shipments = await db
      .select()
      .from(shipmentListing)
      .where(eq(shipmentListing.trackingNumber, trackingNumber))

    // Vérifier si le colis existe
    if (shipments.length ===0) {
      console.log("Colis non trouvé");
      return;
    }
    const shipment = shipments[0];

    // Étape 2 : Récupérer les statusDates actuels ou un objet vide s'il n'existe pas
    const currentStatusDates: StatusDates[] = (shipment.statusDates as StatusDates[] | undefined) || [];
const now = new Date();
const formattedDate = now.toISOString().split("T")[0];
const formattedTime = now.toLocaleTimeString("fr-FR", { hour12: false });
const newStatusDates: StatusDates[] = [
  ...currentStatusDates, // Conserver toutes les entrées existantes
  {
    date: `${formattedDate} ${formattedTime}`,
    status: newStatus,
    location: location
  }
];

    // Étape 4 : Mettre à jour l'enregistrement dans la base de données
    await db
      .update(shipmentListing)
      .set({
        status: newStatus, // Nouveau statut
        statusDates: newStatusDates,
        estimatedDelivery: addDays(new Date(), 7) // Nouvel objet statusDates mis à jour
      })
      .where(eq(shipmentListing.trackingNumber, trackingNumber));
      function addDays(date: Date, days: number): string {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result.toISOString().split("T")[0];
      }
      
    console.log("Statut du colis mis à jour avec succès");
  } catch (error) {
    console.log("Erreur lors de la mise à jour du statut :", error);
  }
};

export const getPendingShipments = async () => {
  try {
    const results = await db
      .select()
      .from(shipmentListing)
      .where(eq(shipmentListing.status, "En attente⏳"));

    return results;
  } catch (error) {
    console.error("Erreur lors de la récupération des colis en attente :", error);
    throw error;
  }
};

export const updateShipmentWeight = async (trackingNumber: string, newWeight: number) => {
  try {
    // Vérifier si le numéro de suivi est valide
    if (!trackingNumber.trim()) {
      throw new Error("Le numéro de suivi est requis.");
    }

    // Vérifier si le poids est valide
    if (newWeight <= 0) {
      throw new Error("Le poids doit être un nombre positif.");
    }

    // Vérifier si le colis existe
    const shipments = await db
      .select()
      .from(shipmentListing)
      .where(eq(shipmentListing.trackingNumber, trackingNumber));

    if (shipments.length === 0) {
      console.log("Colis non trouvé.");
      return;
    }

    // Mettre à jour le poids du colis
    await db
      .update(shipmentListing)
      .set({ weight: newWeight.toString() })
      .where(eq(shipmentListing.trackingNumber, trackingNumber));

    console.log("Poids du colis mis à jour avec succès.");
  } catch (error) {
    console.error("Erreur lors de la mise à jour du poids :", error);
    throw error;
  }
};

// export const confirmAndUpdateUserShipment = async (
//   trackingNumber: string,
//   newStatus: string,
//   newWeight: string
// ) => {
//   try {
//     // Vérifier si le numéro de suivi est valide
//     if (!trackingNumber.trim()) {
//       throw new Error("Le numéro de suivi est requis.");
//     }

//     // Vérifier si le poids est valide
//     // if (newWeight <= 0) {
//     //   throw new Error("Le poids doit être un nombre positif.");
//     // }

//     // Étape 1 : Récupérer l'enregistrement actuel du colis
//     const shipments = await db
//       .select()
//       .from(shipmentListing)
//       .where(eq(shipmentListing.trackingNumber, trackingNumber));

//     // Vérifier si le colis existe
//     if (shipments.length === 0) {
//       console.log("Colis non trouvé.");
//       return;
//     }
//     const shipment = shipments[0];

//     // Étape 2 : Récupérer les statusDates actuels ou un tableau vide
//     const currentStatusDates = shipment.statusDates || [];
    
//     // Étape 3 : Ajouter le nouveau statut avec la date et l'heure actuelles
//     const now = new Date();
//     const formattedDate = now.toISOString().split("T")[0]; // Format YYYY-MM-DD
//     const formattedTime = now.toLocaleTimeString("fr-FR", { hour12: false }); // Format HH:mm:ss
    
//     const newStatusDates = [
//       {
//         date: currentStatusDates[0].date,
//         status: currentStatusDates[0].status,
//         location: currentStatusDates[0].location
//        },
//       {
//         date: `${formattedDate} ${formattedTime}`,
//         status: newStatus,
//         location: "Pnice Miami, FL Warehouse",
//       },
//     ];

//     // Étape 4 : Mettre à jour l'enregistrement dans la base de données
//     await db
//       .update(shipmentListing)
//       .set({
//         status: newStatus,
//         statusDates: newStatusDates,
//         weight: newWeight ,
//         estimatedDelivery: addDays(new Date(), 7),
//       })
//       .where(eq(shipmentListing.trackingNumber, trackingNumber));

//     console.log("Statut et poids du colis mis à jour avec succès.");
//   } catch (error) {
//     console.error("Erreur lors de la mise à jour du colis :", error);
//     throw error;
//   }
// };

// function addDays(date: Date, days: number): string {
//   const result = new Date(date);
//   result.setDate(result.getDate() + days);
//   return result.toISOString().split("T")[0];
// }
