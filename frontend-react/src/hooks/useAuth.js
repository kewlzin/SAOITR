import { useContext, useDebugValue } from "react";
import AuthContext from "../context/authProvider";

const useAuth = () => {
    const context = useContext(AuthContext);
    return context;
}

export default useAuth;