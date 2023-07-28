const db = require('../model/sqlserver');
const bcrypt = require('bcrypt');
const { bus } = require('nodemon/lib/utils');



const showAllOccurrences = async (req, res) => {
    const sqlSearch = (`SELECT * FROM Occurrences`);
     db.query (sqlSearch, async (err, result) => {
        if(err) return res.status(200).json('')
        return res.status(200).json(result)
        
    })
}


const showSpecificOccurrence = async (req, res) => {
    const { user_id } = req.params 
    const sqlSearch = (`SELECT * FROM Occurrences WHERE user_id = "${user_id}"`);
     db.query (sqlSearch, async (err, result) => {
        if(err) return res.status(200).json('')
        return res.status(200).json(result)
    })
}

const showOccurrencebyId = async (req, res) => {
  const { occurrence_id } = req.params 
  const sqlSearch = (`SELECT * FROM Occurrences WHERE id = "${occurrence_id}"`);
   db.query (sqlSearch, async (err, result) => {
      if(err) return res.status(200).json('')
      return res.status(200).json(result)
  })
}

const handleNewOccurrence = async (req, res) => {
    const { registered_at, local, occurrence_type, km, user_id} = req.body;
    if( !registered_at || !local || !occurrence_type || !km || !user_id) return res.status(400).json({ 'message': 'Campos inválidos'});
                try {
                const insertOccurrence = `INSERT INTO Occurrences(registered_at, local, occurrence_type, km, user_id)
                VALUES(?, ?, ?, ?, ?)`;
                const newOccurrence = [registered_at, local, occurrence_type, km, user_id];
                db.query(insertOccurrence, newOccurrence, (err, results, fields) => {
                    if (err) {
                        console.log(err.message);
                    }
                    console.log(results.insertId);
                    res.status(201).json({'id': results.insertId, 'registered_at': registered_at, 'local': local, 'occurrence_type': occurrence_type, 'km': km, 'user_id': user_id});
                });
            
            }catch (err){
            res.status(500).json({ 'message': err.message});
            }
        };

        const handleOccurrenceDeletion = async (req, res) => {
            const { occurrence_id } = req.params;
            const sqlSearch = (`DELETE FROM Occurrences WHERE id = "${occurrence_id}"`);
        
            db.query(sqlSearch, async (err, result)=>{
                if(err) return res.status(400).json({'message': 'Campos Invalidos hmm'})
                return res.status(200).json({'message': 'Ocorrência deletada com sucesso'})
            })
        //ta ok, só fazer proteção pelo token fora a rota
        }

        const handleOccurrenceAlteration = async (req, res) => {
            const { occurrence_id } = req.params;
            const { registered_at, local, occurrence_type, km, user_id } = req.body;
          
            if (!registered_at || !local || !occurrence_type || !km || !user_id) {
              return res.status(400).json({ message: "Campos inválidos." });
            }
          
            try {
              const updateOccurrence = `UPDATE Occurrences SET registered_at = ?, local = ?, occurrence_type = ?, km = ?, user_id = ? WHERE id = ?`;
              const updatedOccurrence = [registered_at, local, occurrence_type, km, user_id, occurrence_id];
          
              db.query(updateOccurrence, updatedOccurrence, (err, results, fields) => {
                if (err) {
                  console.error(err.message);
                  return res.status(500).json({ message: "Ocorreu um erro ao atualizar a ocorrência." });
                }
          
                if (results.affectedRows === 0) {
                  return res.status(401).json({ message: "Ocorrência não encontrada." });
                }
          
                res.status(200).json({ message: "Ocorrência atualizada com sucesso." });
              });
            } catch (error) {
              console.error(error);
              res.status(500).json({ message: "Ocorreu um erro ao atualizar a ocorrência." });
            }
          };
          
        
        

        module.exports = {
            handleNewOccurrence,
            showAllOccurrences,
            showSpecificOccurrence,
            handleOccurrenceDeletion,
            showOccurrencebyId,
            handleOccurrenceAlteration
        }