const db = require('../model/sqlserver');
const bcrypt = require('bcrypt');
const { bus } = require('nodemon/lib/utils');


const handleNewUser = async (req, res) => {
    const { name, email, password} = req.body;
    if( !name || !email || !password) return res.status(400).json({ 'message': 'erro'});
    const sqlSearch = (`SELECT * FROM usuarios WHERE email = "${email}"`);
     db.query (sqlSearch, async (err, result) => {
        if (err) throw (err)
        console.log (result.length);
        if (result.length != 0) {
            console.log("------> User already exists")
            res.sendStatus(422) 
           } else {
           // console.log("usuario nao existe funcionou")  
                try {
                
             //encriptar a senha
                const senhacript = await bcrypt.hash(password, 10);
                 //store the new user trocar para mysql2
                
                const insertUser = `INSERT INTO usuarios(name, email, senha)
                VALUES(?, ?, ?)`;
                const newUser = [name, email, senhacript];
                db.query(insertUser, newUser, (err, results, fields) => {
                    if (err) {
                        console.log(err.message);
                    }
                    console.log(results.insertId);
                    res.status(201).json({'id': results.insertId, 'name': name, 'email': email});
                });
            
            }catch (err){
            res.status(500).json({ 'message': err.message});
            }
        };
        
    })
}

const jwt = require('jsonwebtoken');
const { id } = require('date-fns/locale');
const { use } = require('bcrypt/promises');
require('dotenv').config();

const handleLogin = async (req, res) => {
    const { email, password} = req.body;
    if(!email || !password) return res.status(400).json({ 'message': 'Campos Inválidos'});
    //const buscaUser = userDB.users.find(person => person.email === email);
    //if(!buscaUser) return res.sendStatus(401); // não autorizado
    const sqlSearch = (`SELECT * FROM usuarios WHERE email = "${email}"`);
    db.query (sqlSearch, async (err, result) => {
        if (err) throw (err)
        console.log (result.length);
        if (result.length != 0) {
            for(var count = 0; count < result.length; count++){
                const match = await bcrypt.compare(password, result[count].senha);
                if(match){
                const accessToken = jwt.sign(
                    { "id": result[count].id},
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '35m' }
                );
                res.cookie('jwt', accessToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000});
                res.status(200).json({'id': result[count].id, 'name': result[count].name, 'email': email, 'token': accessToken });
                }else {
                    console.log('Credênciais para o usuário: ', email, "incorretas")
                    console.log(password," |X| " , result[count].senha)
                    console.log('bcrypt match: ', match)
                    res.status(401).json({'message': 'Essas credenciais não correspondem aos nossos registros'});
                }
            }
            
        } else {
            res.sendStatus(500);
        }
    });
}

const handleLogout = async (req, res) => {
    //OnClient: delete accessToken da memória
    const { id } = req.body;
    const sqlSearch = (`SELECT * FROM usuarios WHERE id = "${id}"`);
    db.query (sqlSearch, async (err, result) => {
        if (err) throw (err)
        console.log(err, id);
        if (result.length != 0) {
            for(var count = 0; count < result.length; count++){
                    // const cookies = req.cookies;
                    // if (!cookies?.jwt) return res.sendStatus(401);
                    //const refreshToken = cookies.jwt;
                    res.clearCookie('jwt', { httpOnly: true});
                    return res.status(200).json({'message': 'Logout realizado com sucesso'});
                    
            }
        }
    })
}

const showUserInfo = async (req, res) => {
    const { userId } = req.params;
    const sqlSearch = (`SELECT * FROM usuarios WHERE id = "${userId}"`);
    console.log("user id:", userId)
    db.query(sqlSearch, async (err, result) =>{
        if(err) return res.json('')
        if (result.length != 0) {
            for(var count = 0; count < result.length; count++){
            return res.status(200).json({'id': result[count].id, 'name': result[count].name, 'email': result[count].email})
            }}
    })

}

// const handleUserAlteration = async (req, res) => {
//     const { userId } = req.params;
//     console.log("userid:", userId)
//     const { name, email, password} = req.body;
//     console.log("user: ", name, "email: ", email, "passowrd: ", password)
//     const senhacript = await bcrypt.hash(password, 10);
//     const sqlSearch = (`UPDATE usuarios SET name = "${name}", email = "${email}", senha = "${senhacript}" WHERE id = "${userId}"`);
//     db.query(sqlSearch, async (err, result) => {
//         if(err) throw (err)
//         console.log(err, id);
//         if (result.length == 0){
//             res.status(401).json({'message': 'Usuário não encontrado'})
//         }else {
//             res.status(200).json({'id': userId, 'name': name, 'email': email})
//         }
//     })
// }

const handleUserAlteration = async (req, res) => {
    const { userId } = req.params;
    const { name, email, password } = req.body;
  
    // Verificar se o e-mail já está em uso
  if (email) {
      const sqlCheckEmail = `SELECT id FROM usuarios WHERE email = ? AND id != ?`;
      db.query(sqlCheckEmail, [email, userId], (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Erro ao verificar o e-mail.' });
        }

        if (result.length > 0) {
          return res.status(422).json({ message: 'O e-mail já está em uso por outro usuário.' });
        }
      })
    }
  
    // Verificar se o name ou o email são iguais aos valores enviados
    const sqlSelect = `SELECT name, email FROM usuarios WHERE id = ?`;
    db.query(sqlSelect, [userId], async (err, result) => {
      if (err) throw err;
  
      const user = result[0];
      let newName = name;
      let newEmail = email;
  
      if (user.name === name) {
        newName = user.name;
      }
  
      if (user.email === email) {
        newEmail = user.email;
      }
  
      // Executar a consulta de atualização
      let sqlUpdate;
      let sqlParams;
  
      if (password !== undefined && password !== null) {
        const senhacript = await bcrypt.hash(password, 10);
        sqlUpdate = `UPDATE usuarios SET name = ?, email = ?, senha = ? WHERE id = ?`;
        sqlParams = [newName, newEmail, senhacript, userId];
      } else {
        sqlUpdate = `UPDATE usuarios SET name = ?, email = ? WHERE id = ?`;
        sqlParams = [newName, newEmail, userId];
      }
  
      db.query(sqlUpdate, sqlParams, (err, result) => {
        if (err) throw err;
  
        if (result.affectedRows === 0) {
          return res.status(401).json({ message: 'Usuário não encontrado.' });
        }
  
        res.status(200).json({ id: userId, name: newName, email: newEmail });
      });
    });
  };
  

  const handleUserDeletion = async (req, res) => {
    const { userId } = req.params;
  
    try {
      // Não deletar ocorrências do usuário (BRUHHH)
        // Deletar o usuário
        const disablefkverify = "SET FOREIGN_KEY_CHECKS=0";
        db.query(disablefkverify, (err, results) => {
          const deleteUser = `DELETE FROM usuarios WHERE id = ?`;
          db.query(deleteUser, userId, (err, results, fields) => {
            if (err) {
              console.error(err.message);
              return res.status(500).json({ message: "Ocorreu um erro ao excluir o usuário." });
            }
    
            if (results.affectedRows === 0) {
              return res.status(401).json({ message: "Usuário não encontrado." });
            }
    
            res.status(200).json({ message: "Usuário e ocorrências excluídos com sucesso." });
          });
        })
        
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Ocorreu um erro ao excluir o usuário e as ocorrências." });
    }
  };
  



module.exports = {
    handleNewUser,
    handleLogin,
    handleLogout,
    handleUserAlteration,
    showUserInfo,
    handleUserDeletion
}