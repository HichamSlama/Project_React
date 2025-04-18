import React from 'react';
import { useAuth } from '../../contexts/authContext';
import { Navigate } from 'react-router-dom';

const BudgetGeneral = () => {
  const { currentUser } = useAuth();

  if (!currentUser || (currentUser.role !== 'Administrateurs' && currentUser.role !== 'Comptables')) {
    return <Navigate to="/unauthorized" replace />;
  }

  const sousBudgets = [
    { categorie: "Éducation", pourcentage: 30, montant: 9000 },
    { categorie: "Santé", pourcentage: 20, montant: 6000 },
    { categorie: "Logement", pourcentage: 25, montant: 7500 },
    { categorie: "Loisirs", pourcentage: 10, montant: 3000 },
    { categorie: "Autres", pourcentage: 15, montant: 4500 },
  ];

  const budgetTotal = sousBudgets.reduce((sum, item) => sum + item.montant, 0);

  return (
    <div className="min-h-[calc(100vh-64px)] pt-20 px-6 flex flex-col items-center bg-white">
      <h2 className="text-3xl font-bold mb-6 text-indigo-700">Gestion du Budget Général</h2>
      <p className="text-gray-600 mb-6 text-center max-w-2xl">
        Répartition actuelle des fonds globaux dans différentes catégories.
      </p>

      <table className="table-auto border-collapse w-full max-w-3xl shadow-md">
        <thead>
          <tr className="bg-indigo-600 text-white">
            <th className="px-4 py-2 text-left">Catégorie</th>
            <th className="px-4 py-2 text-center">%</th>
            <th className="px-4 py-2 text-right">Montant (MAD)</th>
          </tr>
        </thead>
        <tbody>
          {sousBudgets.map((item, index) => (
            <tr key={index} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2">{item.categorie}</td>
              <td className="px-4 py-2 text-center">{item.pourcentage}%</td>
              <td className="px-4 py-2 text-right">{item.montant.toLocaleString()}</td>
            </tr>
          ))}
          <tr className="font-bold bg-gray-100">
            <td className="px-4 py-2">Total</td>
            <td className="px-4 py-2 text-center">100%</td>
            <td className="px-4 py-2 text-right">{budgetTotal.toLocaleString()}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default BudgetGeneral;
