// Liste des emails des administrateurs
export const adminEmails: string[] = [
    "stanleywendeljoseph@gmail.com",
    "admin2@example.com",
    "admin3@example.com",
    // Ajoutez d'autres emails d'administrateurs ici
  ];
  
  // Fonction pour vérifier si un email appartient à un administrateur
  export const isAdminEmail = (email: string): boolean => {
    return adminEmails.includes(email.toLowerCase());
  };