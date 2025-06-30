const Client = require('../models/Admin');
const DeliveryProfile=require('../models/DeliveryPerson');

exports.createClient = async (req, res) => {
  try {
    const client = new Client(req.body);
    await client.save();
    res.status(201).json(client);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllClients = async (req, res) => {
  const clients = await Client.find({
  business_type: { $nin: ['delivery', 'admin'] }})
  res.json(clients);
};

exports.getonlyDelivery = async (req, res) => {
  try {
    // 1. Get all users with business_type = 'delivery'
    const clients = await Client.find({ business_type: 'delivery' });
    const clientIds = clients.map(c => c._id);
    const deliveryProfiles = await DeliveryProfile.find({ user_Id: { $in: clientIds } });
    const mergedData = clients.map(client => {
      const extra = deliveryProfiles.find(p => p.user_Id.toString() === client._id.toString());
      const extraData = extra ? extra.toObject() : {};
      const { _id: user_id, ...restExtra } = extraData;
      return {
        ...client.toObject(),              // Client data (including _id)
        user_id,              // Separate delivery profile ID
        ...restExtra                      // Remaining delivery fields
      };
    });
    res.json(mergedData);
  } catch (error) {
    console.error('Error fetching delivery data:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getClient = async (req, res) => {
  const client = await Client.findById(req.params.id);
  if (!client) return res.status(404).json({ error: 'Client not found' });
  res.json(client);
};

exports.replaceClient = async (req, res) => {
  const client = await Client.findOneAndReplace({ _id: req.params.id }, req.body, { new: true });
  res.status(200).json(client);
};

exports.updateClient = async (req, res) => {
  const client = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).json(client);
};

exports.deleteClient = async (req, res) => {
  await Client.findByIdAndDelete(req.params.id);
  res.status(204).send();
};


/*Get All client based on Type*/
exports.getClientbyType=async(req,res)=>{
  try {
    const all_client = await Client.find({ business_type: req.params.business_type });
    res.status(200).json(all_client);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}