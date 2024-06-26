const Customer = require('../models/customer');
exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (error) {
    res.status(400).json({ message: 'Customers not found' });
  }};
exports.getOneCustomer = async (req, res) => {
  try {
    const customer = await Customer.findOne({ _id: req.params.id });
    res.status(200).json(customer);
  } catch (error) {
    res.status(404).json({ message: 'Customer not found' });
  }};
exports.createCustomer = async (req, res) => {
  try {
    const customer = new Customer({
      email: req.body.email,
      password: req.body.password,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
    });
    await customer.save();
    res.status(201).json({ message: 'Customer saved successfully!' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }};
exports.updateCustomer = async (req, res) => {
      const updatedCustomer = {
        email: req.body.email,
        password: req.body.password,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        media: req.body.media,
      };
      Customer.updateOne({ _id: req.params.id }, updatedCustomer)
        .then(() => res.status(200).json({ message: 'Customer updated successfully!' }))
        .catch(() => res.status(404).json({ message: 'Customer not found' }));
};
exports.deleteCustomer = async (req, res) => {
  try{
  await Customer.deleteOne({_id: req.params.id});
  res.status(201).json({ message: 'Customer deleted successfully!' });        
  }catch (error) {
    res.status(403).json({ message: 'Customer not found' });
  }};