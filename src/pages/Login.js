import { useRef, useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthProvider";
import axios from "../api/axios";

const LOGIN_URL = '/auth';

function Login () {
    const { setAuth } = useContext(AuthContext);

    const userRef = useRef();
    const errRef = useRef();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = 
            await axios.post(
                LOGIN_URL, 
                JSON.stringify(
                    {email, password}), 
                    {headers: {'Content-Type': 'application/json'},
                    withCredentials: true
                });

            const authToken = response?.data?.authToken;
            setAuth({ email, password, authToken })

            setEmail('');
            setPassword('');
            setSuccess(true);            
        } catch (err) {
            if (!err?.response) {
                setErrorMessage('No Server Response');
            } else if (err.response?.status === 400) {
                setErrorMessage(err.response.errorMessages);
            }
        }

    }

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setErrorMessage();
    }, [email, password])

    return (
        <>
            {success ? (
                <div>
                    <h1>Logged in!</h1>
                </div>

            ) : (
                <div>
                    <p ref={errRef} className={errorMessage ? "errorMessage" : "none"}>{errorMessage}</p>
                    <h1>Sign In</h1>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="email">Email</label>
                        <input 
                            type="email" 
                            id="email"
                            ref={userRef}
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            required
                        />

                        <label htmlFor="password">Password</label>
                        <input 
                            type="password" 
                            id="password"
                            ref={userRef}
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            required
                        />

                        <button>Sign In</button>
                    </form>
                </div>
            )}
        </>
    )
}

export default Login;