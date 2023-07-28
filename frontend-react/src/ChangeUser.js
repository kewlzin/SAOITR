import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle, faDeleteLeft, faRemove, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import md5 from 'md5';
import axios from './api/axios';
import { Link, useParams, useNavigate } from "react-router-dom";
import  handleLogout  from "./Logout";

const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{1,125}$/;
const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
const PWD_REGEX = /^(?=.*[a-z]).{1,125}$/;

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);

  const [user, setUser] = useState('');
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [email, setEmail] = useState('');
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [pwd, setPwd] = useState('');
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState('');
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);

  const [currentUserEmail, setCurrentUserEmail] = useState('');
  const [currentUserName, setCurrentUserName] = useState('');

  const [userOccurrences, setUserOccurrences] = useState([]);
  const [showOccurrences, setShowOccurrences] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [isEditingOccurrence, setIsEditingOccurrence] = useState(false);
  const [editingOccurrence, setEditingOccurrence] = useState(null);



  useEffect(() => {
    // Fetch user data here and populate the state variables (user, email) with the retrieved values
    // For example:
    const userId = localStorage.getItem('id');
    const token = localStorage.getItem('token');
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const response = await axios.get(`/users/${userId}`, { headers: { 'Content-Type': 'application/json', 'authorization': `Bearer ${token}` } });
        const { name, email } = response.data;
        setUser(name);
        setEmail(email);
        setCurrentUserEmail(email);
        setCurrentUserName(name);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const result = USER_REGEX.test(user);
    setValidName(result);
  }, [user]);

  useEffect(() => {
    const result = EMAIL_REGEX.test(email);
    setValidEmail(result);
  }, [email]);

  useEffect(() => {
    const result = PWD_REGEX.test(pwd);
    setValidPwd(result);
    const match = pwd === matchPwd;
    setValidMatch(match);
  }, [pwd, matchPwd]);

  useEffect(() => {
    setErrMsg('');
  }, [user, pwd, matchPwd]);

  const handleEdit = () => {
    setIsEditing(true);
  };

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
 
  const history = useNavigate();

  const handleEditOccurrence = (occurrenceId) => {
    history(`/editocorrencia/${occurrenceId}`)
  };
  

  const handleSave = async () => {
    const userId = localStorage.getItem('id');
    const ALT_URL = `/users/${userId}`;
    const hashpwd = pwd ? md5(pwd) : null;
    const token = localStorage.getItem('token');

    try {
      const response = await axios.put(
        ALT_URL,
        { name: user || currentUserName, email: email || currentUserEmail, password: hashpwd },
        { headers: { 'Content-Type': 'application/json', 'authorization': `Bearer ${token}` } }
      );
      if (response.status === 200) {
        setSuccess(true);
        setIsEditing(false);
      }
      console.log(JSON.stringify(response));
    } catch (err) {
      if (!err?.response) {
        setErrMsg('Sem resposta do servidor');
        console.log(err);
      } else if (err.response?.status === 422) {
        setErrMsg('Usuário já existe');
      } else {
        setErrMsg('Falha ao registrar');
      }
    }
  };

  const handleListOccurrences = async () => {
    setShowOccurrences(!showOccurrences);
    setIsLoading(true);
    const userId = localStorage.getItem('id');
    const token = localStorage.getItem('token');

    try {
      const response = await axios.get(`/occurrences/users/${userId}`, {
        headers: { 'Content-Type': 'application/json', 'authorization': `Bearer ${token}` }
      });
      const occurrences = response.data;
      setUserOccurrences(occurrences);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserDeletion = async () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('id');

    try {
      const response = await axios.delete(`/users/${userId}`, {
        headers: { 'Content-Type': 'application/json', 'authorization': `Bearer ${token}` }
      });
      if(response.status === 200){
        localStorage.clear();
        history('/')
      }
    } catch (err){

    }
  }


  const handleDeleteOccurrence = async (occurrenceId) => {
    const token = localStorage.getItem('token');
  
    try {
      await axios.delete(`/occurrences/${occurrenceId}`, {
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token}`
        }
      });
      // Atualizar a lista de ocorrências após a exclusão bem-sucedida, se necessário
       handleListOccurrences();
    } catch (err) {
      console.log(err);
    }
  };
  
  

  return (
    <>
      {success ? (
        <section>
          <h1>Success!</h1>
          <p>
            <a href="/login">Sign In</a>
          </p>
        </section>
      ) : (
        <section>
          <div className="backbutton">
            <Link to="/menu">←</Link>
          </div>
          <p className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
          {!isEditing ? (
            <>
              <h1>User Profile</h1>
              <div>
                <p>Name: {user}</p>
                <p>Email: {email}</p>
                {/* Add more profile information as needed */}
              </div>

              <button class="alteruser" onClick={handleEdit}>Alterar dados cadastrais</button>
              <button class="deleteuser" onClick={handleUserDeletion}>Deletar Minha conta</button>
              <button class="listbutton" onClick={handleListOccurrences}> {showOccurrences ? "Esconder Ocorrências" : "Listar Ocorrências"}</button>
              {showOccurrences && userOccurrences.length > 0 ? (
                userOccurrences.map((occurrences) => (
                  <div className="ocorrencia" key={occurrences.id}>
                    <h2>{occurrences.local}</h2>
                    <button class="alterbutton" onClick={() => handleEditOccurrence(occurrences.id)}><FontAwesomeIcon class="icon" icon={faEdit}></FontAwesomeIcon> </button>
                    <button class="deletebutton" onClick={() => handleDeleteOccurrence(occurrences.id)}> <FontAwesomeIcon class="icon"  icon={faTrash}></FontAwesomeIcon> </button>
                    <p>Data: {new Date(occurrences.registered_at).toLocaleString('pt-BR', {timeZone: 'UTC' })}</p>
                    <p>Kilômetro: {occurrences.km}</p>
                    <p>Tipo de ocorrência: {getOccurrenceTypeText(occurrences.occurrence_type)}</p>
                    
                  </div>
                  ))
              ) : (
                !showOccurrences && userOccurrences.length === 0 && !isLoading && (
                  <p>Esse usuário não possui nenhuma ocorrência.</p>
                )
              )}
            </>
          ) : (
            <>
              <h1>Edit Profile</h1>
              <form>
                <label htmlFor="username">
                  New Username:
                  <FontAwesomeIcon icon={faCheck} className={validName ? "valid" : "hide"} />
                  <FontAwesomeIcon icon={faTimes} className={validName || !user ? "hide" : "invalid"} />
                </label>
                <input
                  type="text"
                  id="username"
                  autoComplete="off"
                  onChange={(e) => setUser(e.target.value)}
                  value={user}
                  required
                  aria-invalid={validName ? "false" : "true"}
                  aria-describedby="uidnote"
                  onFocus={() => setUserFocus(true)}
                  onBlur={() => setUserFocus(false)}
                />
                <p id="uidnote" className={userFocus && user && !validName ? "instructions" : "offscreen"}>
                  <FontAwesomeIcon icon={faInfoCircle} />
                  4 to 24 characters.<br />
                  Must begin with a letter.<br />
                  Letters, numbers, underscores, hyphens allowed.
                </p>

                <label htmlFor="email">
                  New Email:
                  <FontAwesomeIcon icon={faCheck} className={validEmail ? "valid" : "hide"} />
                  <FontAwesomeIcon icon={faTimes} className={validEmail || !email ? "hide" : "invalid"} />
                </label>
                <input
                  type="text"
                  id="email"
                  autoComplete="off"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  required
                  aria-invalid={validEmail ? "false" : "true"}
                  aria-describedby="emailnote"
                  onFocus={() => setEmailFocus(true)}
                  onBlur={() => setEmailFocus(false)}
                />
                <p id="emailnote" className={emailFocus && email && !validEmail ? "instructions" : "offscreen"}>
                  <FontAwesomeIcon icon={faInfoCircle} />
                  4 to 24 characters.<br />
                  Must begin with a letter.<br />
                  Letters, numbers, underscores, hyphens allowed.
                </p>

                <label htmlFor="password">
                  New Password:
                  <FontAwesomeIcon icon={faCheck} className={validPwd ? "valid" : "hide"} />
                  <FontAwesomeIcon icon={faTimes} className={validPwd || !pwd ? "hide" : "invalid"} />
                </label>
                <input
                  type="password"
                  id="password"
                  autoComplete="off"
                  onChange={(e) => setPwd(e.target.value)}
                  value={pwd}
                  required
                  aria-invalid={validPwd ? "false" : "true"}
                  onFocus={() => setPwdFocus(true)}
                  onBlur={() => setPwdFocus(false)}
                />

                <label htmlFor="matchpwd">
                  Confirm New Password:
                  <FontAwesomeIcon icon={faCheck} className={validMatch ? "valid" : "hide"} />
                  <FontAwesomeIcon icon={faTimes} className={validMatch || !matchPwd ? "hide" : "invalid"} />
                </label>
                <input
                  type="password"
                  id="matchpwd"
                  autoComplete="off"
                  onChange={(e) => setMatchPwd(e.target.value)}
                  value={matchPwd}
                  required
                  aria-invalid={validMatch ? "false" : "true"}
                  onFocus={() => setMatchFocus(true)}
                  onBlur={() => setMatchFocus(false)}
                />

                <button onClick={handleSave}>Save Changes</button>
              </form>
            </>
          )}
        </section>
      )}
    </>
  );
};

export default Profile;
