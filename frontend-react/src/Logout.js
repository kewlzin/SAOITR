import { useRef, useState, useEffect, useContext } from 'react';
import AuthContext from "./context/authProvider";
import axios from './api/axios';

const handleLogout = async (e) => {
    const id = parseInt(localStorage.getItem('id'));
    const token = localStorage.getItem('token')
    e.preventDefault();
    try {
        const response = await axios.post('/logout',
        { id: id},
        {
            headers: { 'Content-Type': 'application/json', 'authorization': `Bearer ${token}`},
        }
        );
        console.log(id)
        localStorage.removeItem('token')
        localStorage.removeItem('id')
    } catch (err){
        console.log('erro', err);
        //setErrMsg('Erro no logout');
    }
}

export default handleLogout