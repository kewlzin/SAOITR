import { useRef, useState, useEffect, useContext } from 'react';
import AuthContext from "./context/authProvider";
import Auth from './hooks/useAuth';
import axios from './api/axios';
import md5 from 'md5';
import handleLogout from "./Logout";
import { useNavigate } from 'react-router-dom';
const LOGIN_URL = '/login';

const Login = () => {

    const { setAuth } = useContext(AuthContext);
    const userRef = useRef();
    const errRef = useRef();

    const [email, setEmail] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [email, pwd])

    const handleSubmit = async (e) => {
        e.preventDefault();
        const hashpwd = md5(pwd);
        try {
            const response = await axios.post(LOGIN_URL,
                JSON.stringify({ email: email,password: hashpwd }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    
                }
            );
            console.log(JSON.stringify(response?.data));
            console.log(hashpwd);
            //console.log(JSON.stringify(response));
            const accessToken = response?.data?.token;
            const uid = response?.data?.id;
            //setAuth({ email, pwd, uid, accessToken });
            setEmail('');
            setPwd('');
            setSuccess(true);
            localStorage.setItem('token', accessToken);
            console.log(localStorage.getItem('token'))
            localStorage.setItem('id', uid);
            setAuth(accessToken, uid)
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login Failed');
            }
            errRef.current.focus();
        }
    }


    // const handleLogout = async (e) => {
    //     const id = parseInt(localStorage.getItem('id'));
    //     const token = localStorage.getItem('token')
    //     e.preventDefault();
    //     try {
    //         const response = await axios.post('/logout',
    //         { id: id},
    //         {
    //             headers: { 'Content-Type': 'application/json', 'authorization': `Bearer ${token}`},
    //         }
    //         );
    //         console.log(id)
    //     } catch (err){
    //         console.log('erro', err);
    //         setErrMsg('Erro no logout');
    //     }
    // }
    const navigate = useNavigate()

    return (
        <>
            {success ? (
                <section>
                    <h1>You are logged in!</h1>
                    <br />
                    <p> 
                        <button onClick={navigate("/menu")} href='/menu'>Ir ao menu</button>
                    </p>
                </section>
            ) : (
                <section>
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    <h1>Login</h1>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            id="username"
                            ref={userRef}
                            autoComplete="off"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            required
                        />

                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            onChange={(e) => setPwd(e.target.value)}
                            value={pwd}
                            required
                        />
                        <button>Enter</button>
                    </form>
                    <p>
                        Não tem uma conta?<br />
                        <span className="line">
                            {/*put router link here*/}
                            <a href="/">Registre-se</a>
                        </span>
                    </p>
                </section>
            )}
        </>
    )
}

export default Login