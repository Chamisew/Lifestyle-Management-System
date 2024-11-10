const Medication = require('../models/HealthMateMedication');

const getMedications = async (req, res) => {
  const medications = await Medication.find();
  res.json(medications);
};

const addMedication = async (req, res) => {
  const { name, dosage, frequency } = req.body;
  const newMedication = new Medication({ name, dosage, frequency });
  await newMedication.save();
  res.status(201).json(newMedication);
};

module.exports = { getMedications, addMedication };
