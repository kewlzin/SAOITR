import { createContext, useEffect, useState } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({});
    const [user, setUser] = useState({});

    useEffect(() => {
        const authtoken = localStorage.getItem('token')
        const userid = localStorage.getItem('id')

        if(authtoken && userid){
            setAuth(authtoken)
            setUser(userid)
        }
    })


    return (
        <AuthContext.Provider value={{ auth, setAuth, user, setUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;