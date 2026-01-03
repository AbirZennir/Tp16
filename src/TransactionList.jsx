import React, { useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_ALL_TRANSACTIONS, GET_COMPTE_TRANSACTIONS } from "../graphql/queries";

export default function TransactionList({ selectedCompteId }) {
  const [mode, setMode] = useState(selectedCompteId ? "BY_COMPTE" : "ALL");

  React.useEffect(() => {
    if (selectedCompteId) setMode("BY_COMPTE");
  }, [selectedCompteId]);

  const query = mode === "ALL" ? GET_ALL_TRANSACTIONS : GET_COMPTE_TRANSACTIONS;
  const variables = mode === "ALL" ? undefined : { id: selectedCompteId };

  const { loading, error, data, refetch } = useQuery(query, {
    variables,
    skip: mode === "BY_COMPTE" && !selectedCompteId,
  });

  const items = useMemo(() => {
    if (!data) return [];
    return mode === "ALL" ? data.allTransactions : data.compteTransactions;
  }, [data, mode]);

  if (loading) return <p className="text-sm">Chargement transactions...</p>;
  if (error) return <p className="text-sm text-red-600">Erreur : {error.message}</p>;

  return (
    <div className="bg-white rounded-2xl shadow p-5">
      <div className="flex items-center justify-between mb-4 gap-3">
        <h2 className="text-xl font-semibold">Transactions</h2>

        <div className="flex gap-2">
          <button
            onClick={() => setMode("ALL")}
            className={`px-3 py-2 rounded-xl text-sm border ${mode === "ALL" ? "bg-gray-100" : ""}`}
          >
            Toutes
          </button>
          <button
            onClick={() => setMode("BY_COMPTE")}
            className={`px-3 py-2 rounded-xl text-sm border ${mode === "BY_COMPTE" ? "bg-gray-100" : ""}`}
            disabled={!selectedCompteId}
            title={!selectedCompteId ? "Sélectionne un compte" : ""}
          >
            Par compte
          </button>
          <button
            onClick={() => refetch()}
            className="px-3 py-2 rounded-xl text-sm border hover:bg-gray-50"
          >
            Rafraîchir
          </button>
        </div>
      </div>

      {mode === "BY_COMPTE" && !selectedCompteId ? (
        <p className="text-sm text-gray-600">Sélectionne un compte pour voir son historique.</p>
      ) : (
        <div className="space-y-3">
          {items.map((t) => (
            <div key={t.id} className="border rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div className="font-medium">Transaction #{t.id}</div>
                <div className="text-sm px-2 py-1 rounded-full border">{t.type}</div>
              </div>
              <div className="mt-2 text-sm text-gray-700">
                <div>Montant: <span className="font-semibold">{t.montant}</span></div>
                <div>Date: {new Date(t.date).toLocaleString()}</div>
                <div>Compte: #{t.compte?.id}</div>
              </div>
            </div>
          ))}

          {items.length === 0 && (
            <p className="text-sm text-gray-500">Aucune transaction.</p>
          )}
        </div>
      )}
    </div>
  );
}
