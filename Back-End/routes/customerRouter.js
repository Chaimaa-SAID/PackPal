const express = require('express');
const router = express.Router();
const controller = require('../controllers/customersController')

router.get('/',controller.getAllCustomers);
router.get('/:id',controller.getOneCustomer);
router.post('/',controller.createCustomer);
router.put('/:id',controller.updateCustomer);
router.delete('/:id',controller.deleteCustomer);

module.exports = router;