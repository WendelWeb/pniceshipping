import { TFunction } from 'i18next';

/**
 * Translates history status from database to user's language
 * @param status - The status string from database
 * @param t - The translation function from i18next
 * @returns Translated status string
 */
export function translateHistoryStatus(status: string, t: TFunction): string {
  // Debug log
  console.log('🔍 Translating status:', status);

  // Remove emojis and extra spaces
  const cleanStatus = status.trim().toLowerCase();
  console.log('🔍 Clean status:', cleanStatus);

  // Match patterns and translate (checking lowercase for better matching)
  // Online request variations
  if (cleanStatus.includes('requête par l\'utilisateur en ligne') ||
      cleanStatus.includes('requete par l\'utilisateur en ligne') ||
      cleanStatus.includes('requête en ligne') ||
      cleanStatus.includes('requete en ligne') ||
      cleanStatus.includes('demann sou entènèt pa itilizatè') ||
      cleanStatus.includes('solicitud en línea por usuario') ||
      cleanStatus.includes('online request by user') ||
      cleanStatus.includes('online request')) {
    console.log('✅ Matched: addShipment.historyRequestStatus');
    return t('addShipment.historyRequestStatus');
  }

  // Pending reception (check this BEFORE general "en attente")
  if (cleanStatus.includes('en attente de réception') ||
      cleanStatus.includes('en attente de reception') ||
      cleanStatus.includes('an atant resepsyon') ||
      cleanStatus.includes('pendiente de recepción') ||
      cleanStatus.includes('pending reception')) {
    console.log('✅ Matched: addShipment.historyPendingStatus');
    return t('addShipment.historyPendingStatus');
  }

  // Pending status (with emoji)
  if (cleanStatus.includes('en attente⏳') ||
      cleanStatus.includes('an atant⏳') ||
      cleanStatus.includes('pendiente⏳') ||
      cleanStatus.includes('pending⏳')) {
    console.log('✅ Matched: addShipment.historyPendingStatus (with emoji)');
    return t('addShipment.historyPendingStatus');
  }

  // Pending status (general)
  if (cleanStatus.includes('en attente') ||
      cleanStatus.includes('an atant') ||
      cleanStatus.includes('pendiente') ||
      cleanStatus.includes('pending')) {
    console.log('✅ Matched: status.pending');
    return t('status.pending');
  }

  // Submitted online
  if (cleanStatus.includes('soumise en ligne par') ||
      cleanStatus.includes('submitted online by')) {
    // Extract name from "Soumise en ligne par Name"
    const nameMatch = status.match(/par\s+(.+)$/i) ||
                      status.match(/by\s+(.+)$/i);
    if (nameMatch) {
      console.log('✅ Matched: statusSubmittedOnline');
      return t('shipments.statusSubmittedOnline', { name: nameMatch[1].trim() });
    }
    return status;
  }

  // Received in Miami
  if (cleanStatus.includes('reçu à miami') ||
      cleanStatus.includes('recu a miami') ||
      cleanStatus.includes('resevwa nan miami') ||
      cleanStatus.includes('recibido en miami') ||
      cleanStatus.includes('received in miami')) {
    console.log('✅ Matched: statusReceivedMiami');
    return t('shipments.statusReceivedMiami');
  }

  // In transit
  if (cleanStatus.includes('en transit') ||
      cleanStatus.includes('nan transpò') ||
      cleanStatus.includes('en tránsito') ||
      cleanStatus.includes('in transit')) {
    console.log('✅ Matched: statusInTransit');
    return t('shipments.statusInTransit');
  }

  // Arrived in Haiti
  if (cleanStatus.includes('arrivé en haïti') ||
      cleanStatus.includes('arrive en haiti') ||
      cleanStatus.includes('rive nan ayiti') ||
      cleanStatus.includes('llegó a haití') ||
      cleanStatus.includes('arrived in haiti')) {
    console.log('✅ Matched: statusArrivedHaiti');
    return t('shipments.statusArrivedHaiti');
  }

  // Ready for pickup
  if (cleanStatus.includes('prêt pour le retrait') ||
      cleanStatus.includes('pret pour le retrait') ||
      cleanStatus.includes('pre pou pran') ||
      cleanStatus.includes('listo para recoger') ||
      cleanStatus.includes('ready for pickup') ||
      cleanStatus.includes('disponible')) {
    console.log('✅ Matched: statusReadyPickup');
    return t('shipments.statusReadyPickup');
  }

  // Delivered
  if (cleanStatus.includes('livré') ||
      cleanStatus.includes('livre') ||
      cleanStatus.includes('entregado') ||
      cleanStatus.includes('delivered')) {
    console.log('✅ Matched: statusDelivered');
    return t('shipments.statusDelivered');
  }

  // Received (Recu)
  if (cleanStatus.includes('reçu') ||
      cleanStatus.includes('recu') ||
      cleanStatus.includes('resevwa') ||
      cleanStatus.includes('recibido') ||
      cleanStatus.includes('received')) {
    console.log('✅ Matched: filterReceived');
    return t('shipments.filterReceived');
  }

  // If no match found, return original status
  console.log('❌ No match found, returning original');
  return status;
}
