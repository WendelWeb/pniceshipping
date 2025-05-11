
enum ShipmentStatus {
  CONFIRMED = 'Recu📦',
  TRANSIT = 'En Transit✈️',
  AVAILABLE = 'Disponible🟢',
  DELIVERED = 'Livré✅',
}

// Interface pour les paramètres d'email
interface EmailParams {
  userName: string;
  userEmail: string;
  packageId: string;
  status: string; // Changé de ShipmentStatus à string pour accepter n'importe quel statut
  message: string;
  htmlMessage?: string;
}

// Constantes pour les messages, organisées par statut avec un message par défaut
const MESSAGES: Record<ShipmentStatus | 'DEFAULT', { text: string; html: string }> = {
  [ShipmentStatus.CONFIRMED]: {
    text: `🎉 Bonne nouvelle ! Votre colis {{package_id}} a été validé par notre équipe logistique. ✅

🚀 Il entre maintenant dans la phase de préparation en vue de son expédition dans les meilleurs délais.

📦 Nos équipes mettent tout en œuvre pour assurer un envoi rapide et conforme à nos standards de qualité. Vous serez informé(e) de l’évolution de votre colis dans une prochaine mise à jour.

🙏 Merci de votre confiance envers Pnice Shipping Services !`,
    html: `
      <h1>Mise à jour de votre colis</h1>
      <p>🎉 Bonne nouvelle ! Votre colis <strong>{{package_id}}</strong> a été validé par notre équipe logistique. ✅</p>
      <p>🚀 Il entre maintenant dans la phase de préparation pour une expédition rapide.</p>
      <p>📦 Nos équipes assurent un envoi conforme à nos standards de qualité. Vous recevrez une mise à jour bientôt.</p>
      <p>🙏 Merci de votre confiance envers <strong>Pnice Shipping Services</strong> !</p>
    `,
  },
  [ShipmentStatus.TRANSIT]: {
    text: `✈️ Votre colis {{package_id}} a quitté nos entrepôts et est actuellement en transit vers sa destination.

📡 Nos partenaires logistiques veillent à son acheminement avec le plus grand soin.

⏳ Nous suivons de près sa progression afin d’assurer une livraison dans les délais prévus. Vous recevrez une notification dès que votre colis sera prêt à être livré ou retiré.

🙏 Merci pour votre patience et votre confiance en Pnice Shipping Services.`,
    html: `
      <h1>Mise à jour de votre colis</h1>
      <p>✈️ Votre colis <strong>{{package_id}}</strong> a quitté nos entrepôts et est en transit vers sa destination.</p>
      <p>📡 Nos partenaires logistiques veillent à son acheminement avec soin.</p>
      <p>⏳ Nous suivons sa progression pour assurer une livraison dans les délais. Vous serez notifié(e) bientôt.</p>
      <p>🙏 Merci pour votre patience et votre confiance en <strong>Pnice Shipping Services</strong>.</p>
    `,
  },
  [ShipmentStatus.AVAILABLE]: {
    text: `📍 Votre colis {{package_id}} est désormais disponible au point de retrait sélectionné.

📦 Notre équipe a assuré son acheminement dans les meilleures conditions.

📞 Si vous souhaitez organiser une livraison à une autre adresse ou récupérer votre colis, n’hésitez pas à nous faire part de vos instructions rapidement.

🙏 Pnice Shipping Services reste à votre service pour toute assistance complémentaire.`,
    html: `
      <h1>Mise à jour de votre colis</h1>
      <p>📍 Votre colis <strong>{{package_id}}</strong> est disponible au point de retrait sélectionné.</p>
      <p>📦 Il a été acheminé dans les meilleures conditions par notre équipe.</p>
      <p>📞 Pour organiser une livraison ou récupérer votre colis, contactez-nous rapidement.</p>
      <p>🙏 <strong>Pnice Shipping Services</strong> reste à votre service.</p>
    `,
  },
  [ShipmentStatus.DELIVERED]: {
    text: `🎊 Votre colis {{package_id}} a été livré avec succès ! ✅

📦 Nous espérons que son contenu répond à vos attentes et que votre expérience avec Pnice Shipping Services a été pleinement satisfaisante.

🙏 Merci de nous avoir fait confiance pour votre expédition. Nous serions ravis de vous accompagner à nouveau pour vos futurs envois.

📩 N’hésitez pas à nous partager vos retours ou suggestions !`,
    html: `
      <h1>Mise à jour de votre colis</h1>
      <p>🎊 Votre colis <strong>{{package_id}}</strong> a été livré avec succès ! ✅</p>
      <p>📦 Nous espérons que tout est à votre satisfaction.</p>
      <p>🙏 Merci de nous avoir fait confiance. Nous serions ravis de vous accompagner à nouveau.</p>
      <p>📩 Partagez vos retours ou suggestions à <a href="mailto:notifications@pniceshipping.com.com">notifications@pniceshipping.com</a>.</p>
    `,
  },
  DEFAULT: {
    text: `📢 Mise à jour concernant votre colis {{package_id}}.

🔍 Son statut a été mis à jour à : {{status}}.

📦 Nous vous tiendrons informé(e) des prochaines étapes. Merci de votre confiance envers Pnice Shipping Services !

🙏 Pour toute question, contactez-nous à notifications@pniceshipping.com.`,
    html: `
      <h1>Mise à jour de votre colis</h1>
      <p>📢 Mise à jour concernant votre colis <strong>{{package_id}}</strong>.</p>
      <p>🔍 Son statut a été mis à jour à : <strong>{{status}}</strong>.</p>
      <p>📦 Nous vous tiendrons informé(e) des prochaines étapes.</p>
      <p>🙏 Merci de votre confiance envers <strong>Pnice Shipping Services</strong>.</p>
    `,
  },
};

// Configuration de base
const BASE_URL = 'https://pnice-shipping-emails.onrender.com';
const REQUEST_TIMEOUT = 5000; // Timeout de 5 secondes
const MAX_RETRIES = 3; // Nombre maximum de tentatives
const RETRY_DELAY = 1000; // Délai initial entre les tentatives (ms)

// Validation des entrées
const validateEmailParams = (params: EmailParams): void => {
  if (!params.userEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(params.userEmail)) {
    throw new Error('Adresse email invalide');
  }
  if (!params.userName || params.userName.trim() === '') {
    throw new Error('Nom d’utilisateur requis');
  }
  if (!params.packageId || params.packageId.trim() === '') {
    throw new Error('Identifiant du colis requis');
  }
};

// Formatage des messages (texte et HTML)
const formatMessage = (
  userName: string,
  packageId: string,
  status: string,
  message: { text: string; html: string }
): { text: string; html: string } => {
  const text = `🛎 📢 Mise à jour de votre colis ${packageId}

👋 Bonjour ${userName},

${message.text.replace('{{package_id}}', packageId).replace('{{status}}', status)}

🔍 Statut actuel : ${status}

📞 Besoin d'aide ? Contactez-nous à notifications@pniceshipping.com ou WhatsApp au +509 31 97 0548 | +509 48 81 2652 (Lun-Ven, 9h-17h).

Cordialement,
✨ L’équipe Pnice Shipping Services
🌍 www.pniceshipping.com`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #1a73e8;">Mise à jour de votre colis ${packageId}</h1>
      <p style="font-size: 16px;">👋 Bonjour ${userName},</p>
      ${message.html.replace('{{package_id}}', packageId).replace('{{status}}', status)}
      <p style="font-size: 16px;"><strong>Statut actuel :</strong> ${status}</p>
      <p style="font-size: 14px;">
        📞 <strong>Besoin d'aide ?</strong> Contactez-nous à 
        <a href="mailto:notifications@pniceshipping.com">notifications@pniceshipping.com</a> ou via WhatsApp au 
        <a href="https://wa.me/+50931970548">+509 31 97 0548</a> | 
        <a href="https://wa.me/+50948812652">+509 48 81 2652</a> (Lun-Ven, 9h-17h).
      </p>
      <p style="font-size: 14px; color: #555;">
        Cordialement,<br>
        ✨ L’équipe <strong>Pnice Shipping Services</strong><br>
        <a href="https://www.pniceshipping.com">www.pniceshipping.com</a>
      </p>
    </div>
  `;

  return { text, html };
};

// Envoi d'email avec réessai
const sendEmail = async (params: EmailParams, attempt = 1): Promise<void> => {
  validateEmailParams(params);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    const response = await fetch(`${BASE_URL}/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...params,
        htmlMessage: params.htmlMessage,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Erreur d'envoi : ${errorData.details || response.statusText}`);
    }

    console.log('✅ Email envoyé à', params.userEmail);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(`❌ Tentative ${attempt} échouée :`, error.message);
    if (attempt < MAX_RETRIES) {
      const delay = RETRY_DELAY * Math.pow(2, attempt - 1); // Backoff exponentiel
      await new Promise((resolve) => setTimeout(resolve, delay));
      return sendEmail(params, attempt + 1);
    }
    throw error;
  }
};

// Fonction générique pour envoyer un email selon le statut
/**
 * Envoie un email basé sur le statut du colis
 * @param status Statut du colis
 * @param userName Nom du destinataire
 * @param userEmail Email du destinataire
 * @param packageId Identifiant du colis
 */
export const sendStatusEmail = async (
  status: string,
  userName: string,
  userEmail: string,
  packageId: string
): Promise<void> => {
  const message = MESSAGES[status as ShipmentStatus] || MESSAGES.DEFAULT;
  const { text, html } = formatMessage(userName, packageId, status, message);
  await sendEmail({
    userName,
    userEmail,
    packageId,
    status,
    message: text,
    htmlMessage: html,
  });
};

// Fonctions spécifiques pour chaque statut
export const sendConfirmedEmail = (userName: string, userEmail: string, packageId: string): Promise<void> =>
  sendStatusEmail(ShipmentStatus.CONFIRMED, userName, userEmail, packageId);

export const sendTransitEmail = (userName: string, userEmail: string, packageId: string): Promise<void> =>
  sendStatusEmail(ShipmentStatus.TRANSIT, userName, userEmail, packageId);

export const sendAvailableEmail = (userName: string, userEmail: string, packageId: string): Promise<void> =>
  sendStatusEmail(ShipmentStatus.AVAILABLE, userName, userEmail, packageId);

export const sendDeliveredEmail = (userName: string, userEmail: string, packageId: string): Promise<void> =>
  sendStatusEmail(ShipmentStatus.DELIVERED, userName, userEmail, packageId);

// Export des utilitaires pour réutilisation
export { ShipmentStatus, MESSAGES };
