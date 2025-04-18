import React from 'react';
import { useAuth } from '../../contexts/authContext';
import { Navigate } from 'react-router-dom';

const BudgetParrain = () => {
  const { currentUser } = useAuth();

  if (!currentUser || !['Administrateurs', 'Comptables', 'Gestionnaires'].includes(currentUser.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] p-6 text-center">
      <div>
        <h2 className="text-3xl font-bold mb-4 text-indigo-700">Gestion du Budget Parrain</h2>
        <p className="text-lg text-gray-700 max-w-xl mx-auto">
          Suivi des fonds par élève parrainé, gestion des engagements futurs et alertes en cas de manque de fonds.
        </p>
      </div>
    </div>
  );
};

export default BudgetParrain;
