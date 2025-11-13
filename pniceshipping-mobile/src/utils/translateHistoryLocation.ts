import { TFunction } from 'i18next';

/**
 * Translates history location from database to user's language
 * @param location - The location string from database
 * @param t - The translation function from i18next
 * @returns Translated location string
 */
export function translateHistoryLocation(location: string, t: TFunction): string {
  const cleanLocation = location.trim().toLowerCase();

  // Submitted online by user (IMPORTANT: Check this first!)
  if (cleanLocation.includes('soumise en ligne par') ||
      cleanLocation.includes('soumèt sou entènèt pa') ||
      cleanLocation.includes('enviado en línea por') ||
      cleanLocation.includes('submitted online by')) {
    // Extract the user's name from the location string
    const nameMatch = location.match(/par\s+(.+)$/i) ||
                      location.match(/pa\s+(.+)$/i) ||
                      location.match(/por\s+(.+)$/i) ||
                      location.match(/by\s+(.+)$/i);
    if (nameMatch) {
      const userName = nameMatch[1].trim();
      return t('addShipment.historyRequestLocation', { userName });
    }
    // Fallback if no name found
    return t('addShipment.historyRequestLocation', { userName: '' });
  }

  // Pending reception
  if (cleanLocation.includes('en attente de réception') ||
      cleanLocation.includes('en attente de reception') ||
      cleanLocation.includes('an atant resepsyon') ||
      cleanLocation.includes('pendiente de recepción') ||
      cleanLocation.includes('pending reception')) {
    return t('addShipment.historyPendingLocation');
  }

  // Request confirmed by admin
  if (cleanLocation.includes('requête confirmée par l\'administrateur') ||
      cleanLocation.includes('requete confirmee par l\'administrateur') ||
      cleanLocation.includes('demann konfime pa administratè') ||
      cleanLocation.includes('solicitud confirmada por el administrador') ||
      cleanLocation.includes('request confirmed by admin')) {
    return t('shipments.locationRequestConfirmed');
  }

  // Received in Miami warehouse
  if (cleanLocation.includes('confirmation de reception du colis dans notre entrepot a pnice miami') ||
      cleanLocation.includes('confirmation de reception du colis dans notre entrepot a miami') ||
      cleanLocation.includes('konfimasyon resepsyon pakè a nan depo nou pnice miami') ||
      cleanLocation.includes('confirmación de recepción del paquete en nuestro almacén pnice miami') ||
      cleanLocation.includes('pnice miami, fl warehouse') ||
      cleanLocation.includes('received in miami warehouse')) {
    return t('shipments.locationReceivedMiami');
  }

  // In transit to destination
  if (cleanLocation.includes('en route vers haiti') ||
      cleanLocation.includes('en cours de transit vers sa destination') ||
      cleanLocation.includes('pakè nan transpò pou destinasyon final') ||
      cleanLocation.includes('paquete en tránsito hacia su destino final') ||
      cleanLocation.includes('package in transit to final destination') ||
      cleanLocation.includes('in transit to destination')) {
    return t('shipments.locationInTransit');
  }

  // Available for pickup
  if (cleanLocation.includes('colis disponible au local') ||
      cleanLocation.includes('colis disponible dans notre entrepôt') ||
      cleanLocation.includes('disponible dans notre entrepôt') ||
      cleanLocation.includes('disponible dans notre entrepot') ||
      cleanLocation.includes('prêt pour la récupération') ||
      cleanLocation.includes('pret pour la recuperation') ||
      cleanLocation.includes('pakè a disponib nan depo nou') ||
      cleanLocation.includes('el paquete está disponible en nuestro almacén') ||
      cleanLocation.includes('pre pou pran') ||
      cleanLocation.includes('listo para recoger') ||
      cleanLocation.includes('available in warehouse') ||
      cleanLocation.includes('ready for pickup')) {
    return t('shipments.locationAvailable');
  }

  // Package picked up
  if (cleanLocation.includes('colis livré au local') ||
      cleanLocation.includes('colis récupéré avec succès') ||
      cleanLocation.includes('récupéré avec succès') ||
      cleanLocation.includes('recupere avec succes') ||
      cleanLocation.includes('chez pnice shipping services') ||
      cleanLocation.includes('pakè pran avèk siksè') ||
      cleanLocation.includes('paquete recogido exitosamente') ||
      cleanLocation.includes('nan pnice shipping services') ||
      cleanLocation.includes('en pnice shipping services') ||
      cleanLocation.includes('at pnice shipping services') ||
      cleanLocation.includes('picked up successfully')) {
    return t('shipments.locationPickedUp');
  }

  // Status updated (generic fallback)
  if (cleanLocation.includes('statut mis à jour') ||
      cleanLocation.includes('estati mete ajou') ||
      cleanLocation.includes('estado actualizado') ||
      cleanLocation.includes('status updated')) {
    return t('shipments.locationStatusUpdated');
  }

  // If no match found, return original location
  return location;
}
