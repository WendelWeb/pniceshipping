// Ajouter ou mettre à jour le type Colis pour inclure la propriété category
export type Colis = {
  tracking: string;
  poids: number;
  frais: number;
  destination: string;
  statut: string;
  dateCreation: string;
  dateEstimee: string;
  expediteur: string;
  description: string;
  historique: { statut: string; date: string; lieu: string; }[];
  id: string; // Assurez-vous que c'est bien un string
  category: string;
};
