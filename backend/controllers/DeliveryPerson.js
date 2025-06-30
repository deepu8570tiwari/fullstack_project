const DeliveryPerson = require('../models/DeliveryPerson');

exports.createDeliveryPerson = async (req, res) => {
  try {
    const person = new DeliveryPerson(req.body);
    await person.save();
    res.status(201).json(person);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
// Get Payment by ID
exports.getDeliveryPerson = async (req, res) => {
  try {
    const userId = req.params.id; // Get from URL param instead of query
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required in URL params' });
    }

    const deliveryPerson = await DeliveryPerson.findOne({ user_Id: userId })
      .populate('user_Id')
      .lean();

    if (!deliveryPerson) {
      return res
        .status(404)
        .json({ error: 'Delivery person not found for this user' });
    }

    res.json(deliveryPerson);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllDeliveryPersons = async (req, res) => {
  const persons = await DeliveryPerson.find().populate('assignedClients');
  res.json(persons);
};

exports.updateDeliveryPerson = async (req, res) => {
  try {
    const person = await DeliveryPerson.findOneAndUpdate({user_Id: req.params.id }, req.body, { new: true });
    res.json(person);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteDeliveryPerson = async (req, res) => {
  await DeliveryPerson.deleteOne({user_Id: req.params.id });
  res.status(204).send();
};
