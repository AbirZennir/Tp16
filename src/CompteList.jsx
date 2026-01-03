import React, { useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_ALL_COMPTES, GET_COMPTE_BY_TYPE } from "../graphql/queries";
import { TypeCompte } from "../graphql/types";

export default function CompteList({ onSelectCompte }) {
  const [filterType, setFilterType] = useState("ALL");

  const queryToUse = filterType === "ALL" ? GET_ALL_COMPTES : GET_COMPTE_BY_TYPE;
  const variables = filterType === "ALL" ? undefined : { type: filterType };

  const { loading, error, data, refetch } = useQuery(queryToUse, { variables });

  const comptes = useMemo(() => {
    if (!data) return [];
    return filterType === "ALL" ? data.allComptes : data.findCompteByType;
  }, [data, filterType]);

  if (loading) return <p className="text-sm">Chargement...</p>;
  if (error) return <p className="text-sm text-red-600">Erreur : {error.message}</p>;

  return (
    <div className="bg-white rounded-2xl shadow p-5">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h2 className="text-xl font-semibold">Comptes</h2>

        <div className="flex gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="border rounded-xl px-3 py-2 text-sm"
          >
            <option value="ALL">Tous</option>
            <option value={TypeCompte.COURANT}>Courant</option>
            <option value={TypeCompte.EPARGNE}>Épargne</option>
          </select>

          <button
            onClick={() => refetch()}
            className="border rounded-xl px-3 py-2 text-sm hover:bg-gray-50"
          >
            Rafraîchir
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {comptes.map((c) => (
          <button
            key={c.id}
            onClick={() => onSelectCompte?.(c.id)}
            className="w-full text-left border rounded-2xl p-4 hover:bg-gray-50"
          >
            <div className="flex items-center justify-between">
              <div className="font-medium">Compte #{c.id}</div>
              <div className="text-sm px-2 py-1 rounded-full border">{c.type}</div>
            </div>
            <div className="mt-2 text-sm text-gray-700">
              <div>Solde: <span className="font-semibold">{c.solde}</span></div>
              <div>Date: {new Date(c.dateCreation).toLocaleDateString()}</div>
            </div>
          </button>
        ))}

        {comptes.length === 0 && (
          <p className="text-sm text-gray-500">Aucun compte.</p>
        )}
      </div>
    </div>
  );
}
