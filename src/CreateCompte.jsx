import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { SAVE_COMPTE } from "../graphql/mutations";
import { GET_ALL_COMPTES } from "../graphql/queries";
import { TypeCompte } from "../graphql/types";

export default function CreateCompte() {
  const [solde, setSolde] = useState("");
  const [type, setType] = useState(TypeCompte.COURANT);

  const [saveCompte, { loading }] = useMutation(SAVE_COMPTE, {
    refetchQueries: [{ query: GET_ALL_COMPTES }],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await saveCompte({
      variables: { compte: { solde: parseFloat(solde), type } },
    });
    setSolde("");
    setType(TypeCompte.COURANT);
  };

  return (
    <div className="bg-white rounded-2xl shadow p-5">
      <h2 className="text-xl font-semibold mb-4">Créer un compte</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Solde initial</label>
          <input
            type="number"
            step="0.01"
            value={solde}
            onChange={(e) => setSolde(e.target.value)}
            required
            className="w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring"
            placeholder="Ex: 1000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring"
          >
            <option value={TypeCompte.COURANT}>Courant</option>
            <option value={TypeCompte.EPARGNE}>Épargne</option>
          </select>
        </div>

        <button
          disabled={loading}
          className="w-full bg-black text-white rounded-xl py-2 font-medium hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Création..." : "Créer"}
        </button>
      </form>
    </div>
  );
}
