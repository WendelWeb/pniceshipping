import { db } from '../../configs/index.ts'; // Ajustez l'import selon votre structure
import { shipmentListing,deliveryBatch,shipmentToDelivery } from '../../configs/schema.ts'; // Ajustez l'import selon votre structure
import { eq, or, like, inArray } from 'drizzle-orm';
import { Shipment } from '@/types/shipment';
import { getShippingRate, SERVICE_FEE } from '@/constants/shippingRates.ts';
// Dans "@/utils/shipmentQueries.ts"
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


// Type definition for StatusDates
interface StatusDates {
  date: string;
  status: string;
  location: string;
}

export const updateShipmentStatus = async (
  shipmentId: number, // Changed to number to match typical database ID type
  newStatus: string, 
  location: string
) => {
  try {
    // Étape 1 : Récupérer l'enregistrement actuel du colis
    const shipments = await db
      .select()
      .from(shipmentListing)
      .where(eq(shipmentListing.id, shipmentId)); // Now uses correct type

    // Vérifier si le colis existe
    if (shipments.length === 0) {
      console.error("Colis non trouvé");
      throw new Error("Shipment not found");
    }

    const shipment = shipments[0];

    // Fonction utilitaire pour ajouter des jours
    const addDays = (date: Date, days: number): string => {
      const result = new Date(date);
      result.setDate(result.getDate() + days);
      return result.toISOString().split("T")[0];
    };

    // Étape 2 : Récupérer les statusDates actuels ou un tableau vide
    const currentStatusDates: StatusDates[] = Array.isArray(shipment.statusDates) 
      ? shipment.statusDates 
      : [];

    // Étape 3 : Créer une nouvelle entrée de statut
    const now = new Date();
    const formattedDate = now.toISOString().split("T")[0];
    const formattedTime = now.toLocaleTimeString("fr-FR", { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit', 
      hour12: false 
    });

    const newStatusEntry: StatusDates = {
      date: `${formattedDate} ${formattedTime}`,
      status: newStatus,
      location: location
    };

    // Étape 4 : Créer le nouveau tableau de status
    const newStatusDates: StatusDates[] = [
      ...currentStatusDates, 
      newStatusEntry
    ];

    // Étape 5 : Mettre à jour l'enregistrement dans la base de données
    await db
      .update(shipmentListing)
      .set({
        status: newStatus,
        statusDates: newStatusDates,
        estimatedDelivery: addDays(new Date(), 7)
      })
      .where(eq(shipmentListing.id, shipmentId));
      
    console.log("Statut du colis mis à jour avec succès");
    return newStatusEntry;

  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut :", error);
    throw error; // Re-throw to allow caller to handle
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

export const deleteShipmentById = async (shipmentId: number) => {
  try {
    // Vérifier si l'ID est valide
    if (!shipmentId || shipmentId <= 0) {
      throw new Error("L'ID du colis doit être un nombre positif.");
    }

    // Vérifier si le colis existe
    const shipments = await db
      .select()
      .from(shipmentListing)
      .where(eq(shipmentListing.id, shipmentId));

    if (shipments.length === 0) {
      console.log("Colis non trouvé.");
      return;
    }

    // Supprimer le colis
    await db
      .delete(shipmentListing)
      .where(eq(shipmentListing.id, shipmentId));

    console.log("Colis supprimé avec succès.");
  } catch (error) {
    console.error("Erreur lors de la suppression du colis :", error);
    throw error;
  }
};


export const markMultipleShipmentsAsDelivered = async (
  shipmentIds: number[],
  ownerId: string
): Promise<{ batchId: number; shippingCost: number; totalCost: number; deliveredShipments: Shipment[] }> => {
  try {
    const shipments = await db
      .select()
      .from(shipmentListing)
      .where(inArray(shipmentListing.id, shipmentIds));

    if (shipments.length !== shipmentIds.length) {
      throw new Error("Certains colis n'ont pas été trouvés.");
    }

    let totalWeight = 0;
    let shippingCost = 0;

    // Typage explicite avec cost inclus
    const deliveredShipments: (Shipment & { cost: number })[] = shipments.map((shipment) => {
      const weight = parseFloat(shipment.weight || "0");
      totalWeight += weight;

      const rate = getShippingRate(shipment.destination || "");
      const cost = weight * rate; // cost est toujours un number ici

      shippingCost += cost;

      const statusDates: StatusDates[] = Array.isArray(shipment.statusDates)
        ? (shipment.statusDates as StatusDates[])
        : [];

      return {
        id: shipment.id,
        ownerId: shipment.ownerId,
        fullName: shipment.fullName,
        userName: shipment.userName,
        category: shipment.category,
        emailAdress: shipment.emailAdress,
        trackingNumber: shipment.trackingNumber,
        weight: shipment.weight,
        status: shipment.status,
        destination: shipment.destination,
        estimatedDelivery: shipment.estimatedDelivery,
        phone: shipment.phone,
        statusDates,
        cost, // cost est garanti comme number
      };
    });

    const totalCost = shippingCost + SERVICE_FEE;

    const [newBatch] = await db
      .insert(deliveryBatch)
      .values({
        ownerId,
        totalWeight: totalWeight.toString(),
        serviceFee: SERVICE_FEE,
        shippingCost: Math.round(shippingCost),
        totalCost: Math.round(totalCost),
      })
      .returning();

    const now = new Date();
    const formattedDate = `${now.toISOString().split("T")[0]} ${now.toLocaleTimeString("fr-FR", { hour12: false })}`;

    for (const shipment of deliveredShipments) {
      const currentStatusDates: StatusDates[] = shipment.statusDates || [];
      const newStatusDates: StatusDates[] = [
        ...currentStatusDates,
        {
          date: formattedDate,
          status: "Livré✅",
          location: "Colis récupéré avec succès chez Pnice shipping services",
        },
      ];

      await db
        .update(shipmentListing)
        .set({
          status: "Livré✅",
          statusDates: newStatusDates,
        })
        .where(eq(shipmentListing.id, shipment.id));

      // shipmentDetails avec cost garanti
      const shipmentDetails: Shipment & { cost: number } = {
        ...shipment,
        status: "Livré✅",
        statusDates: newStatusDates,
        cost: shipment.cost, // cost est toujours défini ici
      };

      await db.insert(shipmentToDelivery).values({
        shipmentId: shipment.id,
        deliveryBatchId: newBatch.id,
        shipmentDetails,
      });
    }

    // Convertir en Shipment[] pour le retour (cost est optionnel dans Shipment)
    const finalDeliveredShipments: Shipment[] = deliveredShipments.map((shipment) => ({
      ...shipment,
      cost: shipment.cost, // Toujours défini, mais compatible avec cost?: number
    }));

    return {
      batchId: newBatch.id,
      shippingCost: Math.round(shippingCost),
      totalCost: Math.round(totalCost),
      deliveredShipments: finalDeliveredShipments,
    };
  } catch (error) {
    console.error("Erreur lors de la livraison multiple :", error);
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
