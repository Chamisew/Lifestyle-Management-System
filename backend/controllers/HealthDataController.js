const HealthData = require('../models/HealthMateHealthData');

// Add new health data (either blood pressure or diabetes)
const addHealthData = async (req, res) => {
  const { patientName, age, type, readings } = req.body;

  // Validation
  if (!patientName || !age || !type || !readings) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  if (!['blood pressure', 'diabetes'].includes(type)) {
    return res.status(400).json({ message: 'Invalid type, must be either "blood pressure" or "diabetes"' });
  }
  if (readings.length !== 7) {
    return res.status(400).json({ message: 'Readings should contain exactly 7 entries for a full week' });
  }

  try {
    const newData = new HealthData({ patientName, age, type, readings });
    await newData.save();
    res.status(201).json(newData);
  } catch (error) {
    res.status(500).json({ message: 'Server error: Unable to save data', error });
  }
};

// Get all health data
const getHealthData = async (req, res) => {
  try {
    const data = await HealthData.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Server error: Unable to fetch data', error });
  }
};

// Get health data by ID
const getHealthDataById = async (req, res) => {
  const { id } = req.params;

  try {
    const data = await HealthData.findById(id);
    if (!data) {
      return res.status(404).json({ message: 'Health data not found' });
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Server error: Unable to fetch data', error });
  }
};

// Update health data by ID
const updateHealthData = async (req, res) => {
  const { id } = req.params;
  const { patientName, age, type, readings } = req.body;

  // Validation
  if (!patientName || !age || !type || !readings) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  if (!['blood pressure', 'diabetes'].includes(type)) {
    return res.status(400).json({ message: 'Invalid type, must be either "blood pressure" or "diabetes"' });
  }

  try {
    const updatedData = await HealthData.findByIdAndUpdate(id, { patientName, age, type, readings }, { new: true });
    if (!updatedData) {
      return res.status(404).json({ message: 'Health data not found' });
    }
    res.status(200).json(updatedData);
  } catch (error) {
    res.status(500).json({ message: 'Server error: Unable to update data', error });
  }
};

// Delete health data by ID
const deleteHealthData = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedData = await HealthData.findByIdAndDelete(id);
    if (!deletedData) {
      return res.status(404).json({ message: 'Health data not found' });
    }
    res.status(204).send(); // No content
  } catch (error) {
    res.status(500).json({ message: 'Server error: Unable to delete data', error });
  }
};

module.exports = { addHealthData, getHealthData, getHealthDataById, updateHealthData, deleteHealthData };
