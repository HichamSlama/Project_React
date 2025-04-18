import React, { useContext, useState, useEffect } from "react";
import { auth, db } from "../../firebase/firebase";
import { GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [isEmailUser, setIsEmailUser] = useState(false);
  const [isGoogleUser, setIsGoogleUser] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, initializeUser);
    return unsubscribe;
  }, []);

  async function initializeUser(user) {
    if (user) {
      try {
        // 🔥 On récupère aussi les infos depuis Firestore (ex : rôle)
        const userDocRef = doc(db, "users", user.uid);
        const userSnapshot = await getDoc(userDocRef);

        const userData = userSnapshot.exists() ? userSnapshot.data() : {};

        setCurrentUser({
          uid: user.uid,
          email: user.email,
          role: userData.role || null, // 👈 rôle depuis Firestore
          ...userData
        });

        const isEmail = user.providerData.some(
          (provider) => provider.providerId === "password"
        );
        setIsEmailUser(isEmail);

        const isGoogle = user.providerData.some(
          (provider) => provider.providerId === GoogleAuthProvider.PROVIDER_ID
        );
        setIsGoogleUser(isGoogle);

        setUserLoggedIn(true);
      } catch (error) {
        console.error("Erreur lors du chargement des données utilisateur :", error);
        setCurrentUser(null);
        setUserLoggedIn(false);
      }
    } else {
      setCurrentUser(null);
      setUserLoggedIn(false);
    }

    setLoading(false);
  }

  const value = {
    userLoggedIn,
    isEmailUser,
    isGoogleUser,
    currentUser, // 👈 contient maintenant .role
    setCurrentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
