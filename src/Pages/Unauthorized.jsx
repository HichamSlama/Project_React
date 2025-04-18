import React from 'react';

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-3xl font-bold text-red-600 mb-4">⛔ Accès refusé</h1>
      <p className="text-lg text-gray-700 max-w-md">
        Vous n'avez pas les droits nécessaires pour accéder à cette page. 
        Veuillez contacter un administrateur si vous pensez qu'il s'agit d'une erreur.
      </p>
    </div>
  );
};

export default Unauthorized;
