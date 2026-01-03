import React from "react";
import { useQuery } from "@apollo/client";
import { GET_COMPTE_BY_ID } from "../graphql/queries";

export default function CompteDetails({ compteId }) {
  const { loading, error, data } = useQuery(GET_COMPTE_BY_ID, {
    variables: { id: compteId },
    skip: !compteId,
  });

  if (!compteId) {
    return (
      <div className="bg-white rounded-2xl shadow p-5">
        <p className="text-sm text-gray-600">Sélectionne un compte pour voir les détails.</p>
      </div>
    );
  }

  if (loading) return <p className="text-sm">Chargement détails...</p>;
  if (error) return <p className="text-sm text-red-600">Erreur : {error.message}</p>;

  const c = data.compteById;

  return (
    <div className="bg-white rounded-2xl shadow p-5">
      <h2 className="text-xl font-semibold mb-3">Détails du compte</h2>
      <div className="space-y-2 text-sm">
        <div><span className="text-gray-500">ID:</span> {c.id}</div>
        <div><span className="text-gray-500">Type:</span> {c.type}</div>
        <div><span className="text-gray-500">Solde:</span> <span className="font-semibold">{c.solde}</span></div>
        <div><span className="text-gray-500">Créé le:</span> {new Date(c.dateCreation).toLocaleString()}</div>
      </div>
    </div>
  );
}
