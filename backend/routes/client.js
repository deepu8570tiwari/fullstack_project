const express = require('express');
const router = express.Router();
const clientController = require('../controllers/client');

router
  .post('/', clientController.createClient)
  .get('/', clientController.getAllClients)
  .get('/delivery',clientController.getonlyDelivery)
  .get('/getclientbytype/:business_type',clientController.getClientbyType)
  .get('/:id', clientController.getClient)
  .put('/:id', clientController.updateClient)
  .patch('/:id', clientController.replaceClient)
  .delete('/:id', clientController.deleteClient);

module.exports = router;
