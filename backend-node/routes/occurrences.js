const express = require('express');
const router = express.Router();
const ocurrenceController = require('../controller/ocurrenceController');
const verifyJWT = require('../middleware/verifyjwt');

router.route('/occurrences')
     .get(ocurrenceController.showAllOccurrences)
     .post(ocurrenceController.handleNewOccurrence);

router.route('/occurrences/users/:user_id')
    .get(verifyJWT, ocurrenceController.showSpecificOccurrence);

router.route('/occurrences/:occurrence_id')
    .delete(verifyJWT, ocurrenceController.handleOccurrenceDeletion)
    .get(verifyJWT, ocurrenceController.showOccurrencebyId)
    .put(verifyJWT, ocurrenceController.handleOccurrenceAlteration);
module.exports = router;