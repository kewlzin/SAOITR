import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import md5 from 'md5';
import axios from './api/axios';
import { Link } from "react-router-dom";

const OCCURRENCES_URL = '/occurrences'

const Occurrences = () => {
    const [Occurrences,setoccurrences] = useState([])

    useEffect(()=>{
        const fetchOccurrences = async () => {
            try{
                const res = await axios.get(OCCURRENCES_URL)
                console.log(res)
                if (Array.isArray(res.data)){
                    setoccurrences(res.data)
                }else {
                    console.log("O JSON retornado pela API não está formatado como um array")
                }

            }catch(err){
                console.log(err)
            }
        }
        fetchOccurrences()
    },[])

    const getOccurrenceTypeText = (occurrenceType) => {
        switch (occurrenceType) {
          case 1:
            return "Atropelamento";
          case 2:
            return "Deslizamento";
          case 3:
            return "Colisão frontal";
          case 4:
            return "Capotagem";
          case 5:
            return "Saída de pista";
          case 6:
            return "Batida em objeto fixo";
          case 7:
            return "Veículo avariado";
          case 8:
            return "Colisão com motocicletas";
          case 9:
            return "Colisão no mesmo sentido ou transversal";
          case 10:
            return "Construção";
          default:
            return "Tipo de ocorrência desconhecido";
        }
      };

    return(
        
        <div>
            <div class="backbutton"><Link to ="/menu">←</Link></div>
            <center><h1>Ocorrencias</h1></center><br/>
        {/* <div className="Ocorrencias">
            {Occurrences.map(ocorrencia=>(
                <div className="ocorrencia" key={ocorrencia.id}>
                  <div class="ocur-gradientbar"></div>
                  <h2>{ocorrencia.local}</h2>
                  <p>Data: {ocorrencia.registered_at}</p>
                  <p>Kilômetro: {ocorrencia.km}</p>
                </div> */}
            <div className="Ocorrencias">
            {Occurrences && Occurrences.length > 0 ? (
              Occurrences.map((ocorrencia) => (
            <div className="ocorrencia" key={ocorrencia.id}>
              <h2>{ocorrencia.local}</h2>
              <p>Data: {new Date(ocorrencia.registered_at).toLocaleString('pt-BR', {timeZone: 'UTC' })}</p>
              <p>Kilômetro: {ocorrencia.km}</p>
              <p>Tipo de ocorrência: {getOccurrenceTypeText(ocorrencia.occurrence_type)}</p>
            </div>
            ))
            ) : (
             <p>Não há ocorrências disponíveis.</p>
            )}
            </div>
        
        </div>
    )
}

export default Occurrences
