import React, { useState } from 'react'
import { Navigate, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../contexts/authContext'
import { doCreateUserWithEmailAndPassword } from '../../../firebase/auth'
import { db } from '../../../firebase/firebase'
import { doc, setDoc } from 'firebase/firestore'
import { sendEmailVerification } from 'firebase/auth'
import { doSignInWithGoogle } from '../../../firebase/auth'

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
    const [isSigningIn, setIsSigningIn] = useState(false);

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

    const onGoogleSignIn = (e) => {
            e.preventDefault()
            if (!isSigningIn) {
                setIsSigningIn(true)
                doSignInWithGoogle().catch(err => {
                    setIsSigningIn(false)
                })
            }
        }

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
                    <div className='flex flex-row text-center w-full'>
                        <div className='border-b-2 mb-2.5 mr-2 w-full'></div><div className='text-sm font-bold w-fit'>OU</div><div className='border-b-2 mb-2.5 ml-2 w-full'></div>
                    </div>
                    <button
                        disabled={isSigningIn}
                        onClick={(e) => { onGoogleSignIn(e) }}
                        className={`w-full flex items-center justify-center gap-x-3 py-2.5 border rounded-lg text-sm font-medium  ${isSigningIn ? 'cursor-not-allowed' : 'hover:bg-gray-100 transition duration-300 active:bg-gray-100'}`}>
                        <svg className="w-5 h-5" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clipPath="url(#clip0_17_40)">
                                <path d="M47.532 24.5528C47.532 22.9214 47.3997 21.2811 47.1175 19.6761H24.48V28.9181H37.4434C36.9055 31.8988 35.177 34.5356 32.6461 36.2111V42.2078H40.3801C44.9217 38.0278 47.532 31.8547 47.532 24.5528Z" fill="#4285F4" />
                                <path d="M24.48 48.0016C30.9529 48.0016 36.4116 45.8764 40.3888 42.2078L32.6549 36.2111C30.5031 37.675 27.7252 38.5039 24.4888 38.5039C18.2275 38.5039 12.9187 34.2798 11.0139 28.6006H3.03296V34.7825C7.10718 42.8868 15.4056 48.0016 24.48 48.0016Z" fill="#34A853" />
                                <path d="M11.0051 28.6006C9.99973 25.6199 9.99973 22.3922 11.0051 19.4115V13.2296H3.03298C-0.371021 20.0112 -0.371021 28.0009 3.03298 34.7825L11.0051 28.6006Z" fill="#FBBC04" />
                                <path d="M24.48 9.49932C27.9016 9.44641 31.2086 10.7339 33.6866 13.0973L40.5387 6.24523C36.2 2.17101 30.4414 -0.068932 24.48 0.00161733C15.4055 0.00161733 7.10718 5.11644 3.03296 13.2296L11.005 19.4115C12.901 13.7235 18.2187 9.49932 24.48 9.49932Z" fill="#EA4335" />
                            </g>
                            <defs>
                                <clipPath id="clip0_17_40">
                                    <rect width="48" height="48" fill="white" />
                                </clipPath>
                            </defs>
                        </svg>
                        {isSigningIn ? 'Signing In...' : 'Continue with Google'}
                    </button>
                </div>
            </main>
        </>
    )
}

export default Register
