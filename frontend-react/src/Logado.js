import { AuthProvider } from "./context/authProvider";
import axios from "./api/axios";

const { authenticated, user, logout, token} = AuthProvider();
const uid = Number(user.uid);

const Logout = () => {
    const logout = axios.post('/logout',
    JSON.stringify({ uid }),
    {
        headers: { 'authorization': `Bearer ${token}`},
    }
    ) //uid
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    }

export default Logout