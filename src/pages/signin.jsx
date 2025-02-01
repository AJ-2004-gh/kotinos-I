import { auth, googleprovider } from '../config/firebase';
import { useState, useEffect } from "react";
import { signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import bg from '../assets/signin_bg.jpg';
import googlepic from '../assets/Googlepic.png';
import { collection, doc, setDoc, getDoc } from 'firebase/firestore';
import { toast, ToastContainer } from 'react-toastify';
import { useUser } from '../components/UserContext';
import { database } from '../config/firebase';

const Signin = () => {
    const navigate = useNavigate();
    const { setUserDetails } = useUser();
    const [username, setUsername] = useState('');
    const [selectedOption, setSelectedOption] = useState('');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                navigate("/profile");
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    const signInWithGoogle = async () => {
        if (!username || !selectedOption) {
            toast.warning("Please enter a username and select a role.", {
                autoClose: 500,
            });
            return;
        }

        try {
            await signInWithPopup(auth, googleprovider);
            await addUser();
            navigate("/profile");
        } catch (error) {
            console.error("Error signing in with Google:", error.message);
            alert("Error signing in with Google. Please try again.");
        }
    };

    const handleOption = (event) => {
        setSelectedOption(event.target.value);
    };

    const addUser = async () => {
        const userRef = collection(database, "users");
        const userDocRef = doc(userRef, auth.currentUser.uid);
    
        try {
            const docSnap = await getDoc(userDocRef);
            if (!docSnap.exists()) {
                await setDoc(userDocRef, {
                    username: username,
                    role: selectedOption,
                    email: auth.currentUser.email,
                });
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <style>
                {`
                    .bg-image{
                        height: 100vh;
                        position:absolute;
                        background-image: url(${bg});
                        background-repeat: no-repeat;
                        background-size: cover;
                        filter: blur(4px);
                    }
                `}
            </style>
            <div className="bg-image w-full"></div>
            <div>
                <ToastContainer autoClose={500} position='top-middle' />
            </div>
            <div className="relative z-10 shadow-2xl left flex items-center justify-center md:text-6xl text-3xl text-center bg-white">
                <h1 className='russo  w-full m-0 p-5 pt-6'>KOTINOS</h1>
            </div>
            <div className="signin-head w-full text-center relative z-20">
                <h2 className='lexend text-5xl mt-10 mb-3'>Sign In</h2>
            </div>
            <div className="flex justify-center relative z-20 items-center">
                <div className='md:w-1/3 bg-white mt-10 md:mt-4 p-10 rounded-lg shadow-2xl'>
                    <h2>User name</h2>
                    <input type="text" placeholder="Enter your username" value={username} onChange={(e) => setUsername(e.target.value)} />
                    <h2>Which of these best describes you?</h2>
                    <div>
                        <label>
                            <input type="radio" value='user' checked={selectedOption === 'user'} onChange={handleOption} />
                            A general user exploring the app
                        </label>
                    </div>
                    <div>
                        <label>
                            <input type="radio" value='athlete' checked={selectedOption === 'athlete'} onChange={handleOption} />
                            An athlete aiming to advance your career
                        </label>
                    </div>
                    <div>
                        <label>
                            <input type="radio" value='organization' checked={selectedOption === 'organization'} onChange={handleOption} />
                            An organization finding athletes and hosting events
                        </label>
                    </div>
                    <div>
                        <label>
                            <input type="radio" value='coach' checked={selectedOption === 'coach'} onChange={handleOption} />
                            A coach aiming to train talented athletes
                        </label>
                    </div>
                    <div className="buttons flex flex-col justify-center items-center p-5 mt-10">
                        <button className='text-white bg-black russo w-full rounded-full py-1 text-l md:w-3/4 flex justify-center items-center gap-2 hover:scale-105 transition-all' onClick={signInWithGoogle}><img className='w-10' src={googlepic} />  Sign in with Google</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signin;
