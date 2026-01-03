export interface Compte {
  id: string;
  solde: number;
  dateCreation: string;
  type: "COURANT" | "EPARGNE";
}

export interface Transaction {
  id: string;
  type: "DEPOT" | "RETRAIT";
  montant: number;
  date: string;
  compte: Compte;
}
