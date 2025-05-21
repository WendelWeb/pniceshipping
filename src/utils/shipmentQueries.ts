import { db } from '../../configs/index.ts'; // Ajustez l'import selon votre structure
import { shipmentListing,deliveryBatch,shipmentToDelivery } from '../../configs/schema.ts'; // Ajustez l'import selon votre structure
import { eq, or, like, inArray, sql } from 'drizzle-orm';
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
export const findByOwnerId = async (ownerId: string): Promise<Shipment[]> => {
  try {
    if (!ownerId || ownerId.trim() === "") {
      return [];
    }

    const results = await db
      .select()
      .from(shipmentListing)
      .where(eq(shipmentListing.ownerId, ownerId));

    // Map results to ensure statusDates is StatusDates[]
    return results.map((item) => ({
      ...item,
      statusDates: Array.isArray(item.statusDates)
        ? item.statusDates
        : typeof item.statusDates === "string"
        ? JSON.parse(item.statusDates)
        : [],
    })) as Shipment[];
  } catch (error) {
    console.error("Erreur lors de la recherche par ownerId:", error);
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

    // Tronquer le numéro de suivi à 20 caractères pour la comparaison
    const truncatedTrackingNumber = trackingNumber.slice(0, 20);

    const results = await db
      .select()
      .from(shipmentListing)
      .where(sql`LEFT(${shipmentListing.trackingNumber}, 20) = ${truncatedTrackingNumber}`);

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




/**
 * Récupère tous les lots de livraisons avec leurs colis associés
 * @returns Liste des lots de livraisons avec détails
 */
export const getDeliveredShipments = async () => {
  try {
    const results = await db
      .select({
        deliveryBatchId: deliveryBatch.id,
        ownerId: deliveryBatch.ownerId,
        deliveryDate: deliveryBatch.deliveryDate,
        totalWeight: deliveryBatch.totalWeight,
        serviceFee: deliveryBatch.serviceFee,
        shippingCost: deliveryBatch.shippingCost,
        totalCost: deliveryBatch.totalCost,
        shipmentId: shipmentToDelivery.shipmentId,
        shipmentDetails: shipmentToDelivery.shipmentDetails,
        shipmentTrackingNumber: shipmentListing.trackingNumber,
        shipmentFullName: shipmentListing.fullName,
        shipmentUserName: shipmentListing.userName,
        shipmentEmailAdress: shipmentListing.emailAdress,
        shipmentDestination: shipmentListing.destination,
        shipmentCategory: shipmentListing.category,
      })
      .from(deliveryBatch)
      .leftJoin(shipmentToDelivery, eq(deliveryBatch.id, shipmentToDelivery.deliveryBatchId))
      .leftJoin(shipmentListing, eq(shipmentToDelivery.shipmentId, shipmentListing.id));

    // Regrouper les résultats par lot
    const batchesMap = new Map<number, any>();
    results.forEach((row) => {
      if (!batchesMap.has(row.deliveryBatchId)) {
        batchesMap.set(row.deliveryBatchId, {
          id: row.deliveryBatchId,
          ownerId: row.ownerId,
          deliveryDate: row.deliveryDate,
          totalWeight: parseFloat(row.totalWeight),
          serviceFee: row.serviceFee,
          shippingCost: row.shippingCost,
          totalCost: row.totalCost,
          shipments: [],
        });
      }
      if (row.shipmentId) {
        batchesMap.get(row.deliveryBatchId).shipments.push({
          id: row.shipmentId,
          trackingNumber: row.shipmentTrackingNumber,
          fullName: row.shipmentFullName,
          userName: row.shipmentUserName,
          emailAdress: row.shipmentEmailAdress,
          destination: row.shipmentDestination,
          category: row.shipmentCategory,
          details: row.shipmentDetails, // JSON contenant poids, coût, etc.
        });
      }
    });

    return Array.from(batchesMap.values());
  } catch (error) {
    console.error("Erreur lors de la récupération des lots de livraisons :", error);
    throw error;
  }
};