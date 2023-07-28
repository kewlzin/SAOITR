import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from '../Login';
import Register from '../Register';
import Occurrences from "../Occurrences";
import { Fragment } from "react";
import Add from "../AddOccurrence";
import ChangeUser from "../ChangeUser";
import EditOccurrence from "../EditOccurrence";
import Menu from "../Menu";

//terminar

const Rotas = () =>{
    return(
        <BrowserRouter>
            <Fragment>
                <Routes>
                    <Route path="/" element={<Register></Register>}></Route>
                    <Route path="/menu" element={<Menu></Menu>}></Route>
                    <Route path="/login" element={<Login></Login>}></Route>
                    <Route path="/register" element={<Register></Register>}></Route>
                    <Route path="/ocorrencias" element={<Occurrences></Occurrences>}></Route>
                    <Route path="/addocorrencia" element={<Add></Add>}></Route>
                    <Route path="/changeuser" element={<ChangeUser></ChangeUser>}></Route>
                    <Route path="/editocorrencia/:occurrenceId" element={<EditOccurrence></EditOccurrence>}></Route>
                </Routes>
            </Fragment>
        </BrowserRouter>
    )
}
export default Rotas