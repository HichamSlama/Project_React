import React, { useState } from 'react'
import { Navigate, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../contexts/authContext'
import { doCreateUserWithEmailAndPassword } from '../../../firebase/auth'
import { db } from '../../../firebase/firebase'
import { doc, setDoc } from 'firebase/firestore'
import { sendEmailVerification } from 'firebase/auth'

const Register = () => {
    const navigate = useNavigate()

    const [role, setRole] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isRegistering, setIsRegistering] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const { userLoggedIn } = useAuth()

    const onSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setErrorMessage("Les mots de passe ne correspondent pas.");
            return;
        }

        if (!role) {
            setErrorMessage("Veuillez choisir un rôle.");
            return;
        }

        try {
            setIsRegistering(true);
            const userCredential = await doCreateUserWithEmailAndPassword(email, password);
            const user = userCredential.user;

            // Envoyer l’email de vérification
            await sendEmailVerification(user);

            // Stocker les infos dans Firestore
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                email,
                firstName,
                lastName,
                role,
                createdAt: new Date()
            });

            alert("Un email de confirmation a été envoyé. Veuillez vérifier votre boîte mail.");
            navigate("/login");
        } catch (error) {
            console.error("Erreur d'inscription :", error);
            setErrorMessage(error.message);
        } finally {
            setIsRegistering(false);
        }
    };

    return (
        <>
            {userLoggedIn && (<Navigate to={'/home'} replace={true} />)}

            <main className="w-full h-screen flex items-center justify-center">
                <div className="w-96 text-gray-600 space-y-5 p-4 shadow-xl border rounded-xl">
                    <div className="text-center mb-6">
                        <div className="mt-2">
                            <h3 className="text-gray-800 text-xl font-semibold sm:text-2xl">
                                Créer un nouveau compte
                            </h3>
                        </div>
                    </div>

                    <form onSubmit={onSubmit} className="space-y-4">

                        <div>
                            <label className="text-sm font-bold">Prénom</label>
                            <input
                                type="text"
                                required
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="w-full mt-2 px-3 py-2 border rounded-lg outline-none"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-bold">Nom</label>
                            <input
                                type="text"
                                required
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="w-full mt-2 px-3 py-2 border rounded-lg outline-none"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-bold">Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full mt-2 px-3 py-2 border rounded-lg outline-none"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-bold">Rôle</label>
                            <select
                                type="role"
                                required
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="w-full mt-2 px-3 py-2 border rounded-lg outline-none"
                            >
                                <option value="" disabled>Choisir un rôle</option>
                                <option value="Administrateurs">Administrateurs</option>
                                <option value="Comptables">Comptables</option>
                                <option value="Gestionnaires">Gestionnaires</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-sm font-bold">Mot de passe</label>
                            <input
                                type="password"
                                required
                                disabled={isRegistering}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full mt-2 px-3 py-2 border rounded-lg outline-none"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-bold">Confirmer le mot de passe</label>
                            <input
                                type="password"
                                required
                                disabled={isRegistering}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full mt-2 px-3 py-2 border rounded-lg outline-none"
                            />
                        </div>

                        {errorMessage && (
                            <div className="text-red-600 font-bold">{errorMessage}</div>
                        )}

                        <button
                            type="submit"
                            disabled={isRegistering}
                            className={`w-full px-4 py-2 text-white font-medium rounded-lg ${
                                isRegistering
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-indigo-600 hover:bg-indigo-700 transition duration-300'
                            }`}
                        >
                            {isRegistering ? 'Inscription en cours...' : 'S’inscrire'}
                        </button>

                        <div className="text-sm text-center">
                            Vous avez déjà un compte ?{' '}
                            <Link to={'/login'} className="font-bold hover:underline">
                                Se connecter
                            </Link>
                        </div>
                    </form>
                </div>
            </main>
        </>
    )
}

export default Register
