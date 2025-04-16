const MESSAGES = {
    PENDING: `📦 Nous accusons réception de votre demande concernant le colis portant l’identifiant *{{package_id}}. ✅ Votre requête a été enregistrée avec succès et est *en cours de traitement par notre équipe. ⏳  
  
🔎 Afin de valider votre demande, il est essentiel que le colis reçu corresponde exactement à l’identifiant fourni. Nous vous invitons à vérifier attentivement ces informations pour éviter toute erreur.  
  
🛠️ Nos agents examinent actuellement les détails de votre demande et vous tiendront informé(e) dès que cette étape sera finalisée.  
  
🙏 Merci de votre confiance envers *Pnice Shipping Services !`,
    CONFIRMED: `🎉 Bonne nouvelle ! Votre colis, identifié sous le numéro *{{package_id}}, a été validé par notre équipe logistique. ✅  
  
🚀 Il entre maintenant dans la phase de *préparation en vue de son expédition dans les meilleurs délais.  
  
📦 Nos équipes mettent tout en œuvre pour assurer un envoi rapide et conforme à nos standards de qualité. Vous serez informé(e) de l’évolution de votre colis dans une prochaine mise à jour.  
  
🙏 Merci de votre confiance envers Pnice Shipping Services !`,
    TRANSIT: `✈️ Votre colis, référencé sous l’identifiant {{package_id}}, a quitté nos entrepôts et est actuellement en transit vers sa destination. 
  
📡 Nos partenaires logistiques veillent à son acheminement avec le plus grand soin.  
  
⏳ Nous suivons de près sa progression afin d’assurer une livraison dans les délais prévus. Vous recevrez une notification dès que votre colis sera prêt à être livré ou retiré.  
  
🙏 Merci pour votre patience et votre confiance en Pnice Shipping Services.`,
    AVAILABLE: `📍 Votre colis, portant l’identifiant {{package_id}}, est désormais disponible au point de retrait sélectionné.  
  
📦 Notre équipe a assuré son acheminement dans les meilleures conditions.  
  
📞 Si vous souhaitez organiser une livraison à une autre adresse ou récupérer votre colis, n’hésitez pas à nous faire part de vos instructions rapidement.  
  
🙏 Pnice Shipping Services reste à votre service pour toute assistance complémentaire.`,
    DELIVERED: `🎊 **Votre colis, identifié sous le numéro {{package_id}}, a été livré avec succès ! ✅  
  
📦 Nous espérons que son contenu répond à vos attentes et que votre expérience avec Pnice Shipping Services a été pleinement satisfaisante.  
  
🙏 Merci de nous avoir fait confiance pour votre expédition. Nous serions ravis de vous accompagner à nouveau pour vos futurs envois.  
  
📩 N’hésitez pas à nous partager vos retours ou suggestions !`,
};
const formatMessage = (userName, packageId, status, messageBody) => {
    return `🛎 📢 Mise à jour de votre colis ${packageId}

👋 Bonjour ${userName}, 


${messageBody.replace('{{package_id}}', packageId)}

🔍 Statut actuel : ${status}

📞 *Besoin d'aide ? Contactez-nous à 📧 support@pniceshipping.com ou 📱 WhatsApp au +509 31 97 0548 | +509 48 81 2652*(Lun-Ven, 9h-17h).* 

Cordialement,  
✨ L’équipe *Pnice Shipping Services*  
🌍 [www.pniceshipping.com](https://www.pniceshipping.com)`;
};
const BASE_URL = 'https://pnice-shipping-emails.onrender.com';
const sendEmail = async (params) => {
    try {
        const response = await fetch(`${BASE_URL}/send-email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(params),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Erreur d'envoi : ${errorData.details || response.statusText}`);
        }
        console.log('✅ Email envoyé à', params.userEmail);
    }
    catch (error) {
        console.error('❌ Erreur:', error);
        throw error;
    }
};
export const sendPendingEmail = async (userName, userEmail, packageId) => {
    const message = formatMessage(userName, packageId, '📌 En attente', MESSAGES.PENDING);
    await sendEmail({ userName, userEmail, packageId, status: 'En attente', message });
};
export const sendConfirmedEmail = async (userName, userEmail, packageId) => {
    const message = formatMessage(userName, packageId, '✅ Confirmé', MESSAGES.CONFIRMED);
    await sendEmail({ userName, userEmail, packageId, status: 'Confirmé', message });
};
export const sendTransitEmail = async (userName, userEmail, packageId) => {
    const message = formatMessage(userName, packageId, '🚚 En transit', MESSAGES.TRANSIT);
    await sendEmail({ userName, userEmail, packageId, status: 'En transit', message });
};
export const sendAvailableEmail = async (userName, userEmail, packageId) => {
    const message = formatMessage(userName, packageId, '📍 Disponible', MESSAGES.AVAILABLE);
    await sendEmail({ userName, userEmail, packageId, status: 'Disponible', message });
};
export const sendDeliveredEmail = async (userName, userEmail, packageId) => {
    const message = formatMessage(userName, packageId, '🎊 Livré', MESSAGES.DELIVERED);
    await sendEmail({ userName, userEmail, packageId, status: 'Livré', message });
};
