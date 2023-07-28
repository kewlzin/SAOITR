import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import axios from './api/axios';
import { Link } from "react-router-dom";
import dayjs from "dayjs";

const OCCURRENCES_URL = '/occurrences'

const occurrenceTypes = [
    { id: 1, label: "Atropelamento" },
    { id: 2, label: "Deslizamento" },
    { id: 3, label: "Colisão frontal" },
    { id: 4, label: "Capotagem" },
    { id: 5, label: "Saída de pista" },
    { id: 6, label: "Batida em objeto fixo" },
    { id: 7, label: "Veículo avariado" },
    { id: 8, label: "Colisão com motocicletas" },
    { id: 9, label: "Colisão no mesmo sentido ou transversal" },
    { id: 10, label: "Construção" }
  ];

const userId = parseInt(localStorage.getItem('id'));
const Add = () => {
    const [ocorrencia, setocorrencia] = useState({
        registered_at: "",
        local:"",
        occurrence_type: null,
        km:null,
        user_id: parseInt(localStorage.getItem('id'))
    });

    const [success, setSuccess] = useState(false);
    const token = localStorage.getItem('token')

    const handleChange = (e) => {
        //setocorrencia(prev=>({...prev, [e.target.name]: e.target.value}))
        let value = e.target.value.trim();
        if (e.target.name === "registered_at") {
            const date = new Date(e.target.value);
            // const formattedDate = dayjs(e.target.value).toISOString();
            let datefix = new Date(date.valueOf() - date.getTimezoneOffset() * 60000);
            const formattedDate = datefix.toISOString();
            console.log("formated date:",formattedDate);
            setocorrencia(prev => ({ ...prev, registered_at: formattedDate }));
        }
        if (e.target.name === "occurrence_type" || e.target.name === "km") {
            value = value.trim();
            if (/^\d+$/.test(value)) {
              value = parseInt(value);
              setocorrencia(prev => ({ ...prev, [e.target.name]: value }));
            } else {
              value = null; 
              setocorrencia(prev => ({ ...prev, [e.target.name]: value }));// Definir como null apenas se não for um número válido
            }
          }
        
          if (e.target.name === "local") {
            value = value.toString();
            setocorrencia(prev => ({ ...prev, [e.target.name]: value }));
          }
        
          
            //setocorrencia(prev => ({ ...prev, [e.target.name]: e.target.value }));
        
    }

    const handleClick = async e => {
        e.preventDefault()
        try{
            const res = await axios.post(OCCURRENCES_URL, ocorrencia,
                 {
                    headers: { 'Content-Type': 'application/json', 'authorization': `Bearer ${token}`},
                 }
                );
                console.log(token)
                if (res.status === 201) {
                    setSuccess(true);
                }
        }catch(err){

        }
    }
    if (success){
        return (
            <div className="sucesso">
                <h1>Ocorrência registrada com sucesso!</h1>
                <p><Link to="/menu">Voltar para o menu</Link></p>
            </div>
        );
    }
    console.log(ocorrencia)
    return (
      <section>
        <div className='form'>
             <div class="backbutton"><Link to="/menu">←</Link></div>
            <h1>Adicionar Ocorrência</h1>
            <input type="datetime-local" step={2} onChange={handleChange} name="registered_at"></input>
            <input type="text" placeholder="local" onChange={handleChange} name="local"></input>
            {/* <input type="number" placeholder="tipo de ocorrência" onChange={handleChange} name="occurrence_type"></input> */}
            <select class="selectbox" onChange={handleChange} name="occurrence_type">
             {occurrenceTypes.map(occurrenceType => (
               <option key={occurrenceType.id} value={occurrenceType.id}>{occurrenceType.label}</option>
             ))}
            </select>
            <input type="number" placeholder="kilômetro" onChange={handleChange} name="km" min="1"></input>
            <button class="centeredbtn" onClick={handleClick}>Add</button>
        </div>
        </section>
    )
}

export default Add