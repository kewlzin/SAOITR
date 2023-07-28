import { useRef, useState, useEffect, useContext } from 'react';
import AuthContext from "./context/authProvider";
import axios from './api/axios';
import handleLogout from "./Logout";
import { Link, useNavigate } from 'react-router-dom';

const Menu = () => {

    const navigate = useNavigate();
    return (

        <section>
            <h1>You are logged in!</h1>
            <br />
            <button ><Link to ="/changeuser">Painel de Usuário</Link></button>
            <button ><Link to ="/ocorrencias">Ver Ocorrências</Link></button>
            <button><Link to ="/addocorrencia">Adicionar Ocorrência</Link></button>
            <button onClick={handleLogout}><Link to ="/register">Logout</Link></button>
        </section>
    
    )
    
}
export default Menu