import { useState, useEffect } from 'react';
import axios from 'axios';

const useAppData = () => {
  const [vehicles, setVehicles] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [serviceStations, setServiceStations] = useState([]);
  const [currentVehicle, setCurrentVehicle] = useState(null);
  const [currentReminder, setCurrentReminder] = useState(null);
  const [currentServiceStation, setCurrentServiceStation] = useState(null);
  const [selectedServiceStation, setSelectedServiceStation] = useState(null);

  useEffect(() => {
    fetchVehicles();
    fetchReminders();
    fetchServiceStations();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/vehicles');
      setVehicles(response.data);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    }
  };

  const fetchReminders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/reminders');
      setReminders(response.data);
    } catch (error) {
      console.error('Error fetching reminders:', error);
    }
  };

  const fetchServiceStations = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/service-stations');
      setServiceStations(response.data);
    } catch (error) {
      console.error('Error fetching service stations:', error);
    }
  };

  const saveVehicle = async (vehicle) => {
    try {
      if (vehicle._id) {
        await axios.put(`http://localhost:5000/api/vehicles/${vehicle._id}`, vehicle);
      } else {
        await axios.post('http://localhost:5000/api/vehicles', vehicle);
      }
      fetchVehicles();
      setCurrentVehicle(null);
    } catch (error) {
      console.error('Error saving vehicle:', error);
    }
  };

  const saveReminder = async (reminder) => {
    try {
      if (reminder._id) {
        await axios.put(`http://localhost:5000/api/reminders/${reminder._id}`, reminder);
      } else {
        await axios.post('http://localhost:5000/api/reminders', reminder);
      }
      fetchReminders();
      setCurrentReminder(null);
    } catch (error) {
      console.error('Error saving reminder:', error);
    }
  };

  const saveServiceStation = async (serviceStation) => {
    try {
      if (serviceStation._id) {
        await axios.put(`http://localhost:5000/api/service-stations/${serviceStation._id}`, serviceStation);
      } else {
        await axios.post('http://localhost:5000/api/service-stations', serviceStation);
      }
      fetchServiceStations();
      setCurrentServiceStation(null);
    } catch (error) {
      console.error('Error saving service station:', error);
    }
  };

  const deleteVehicle = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/vehicles/${id}`);
      fetchVehicles();
    } catch (error) {
      console.error('Error deleting vehicle:', error);
    }
  };

  const deleteReminder = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/reminders/${id}`);
      fetchReminders();
    } catch (error) {
      console.error('Error deleting reminder:', error);
    }
  };

  const deleteServiceStation = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/service-stations/${id}`);
      fetchServiceStations();
    } catch (error) {
      console.error('Error deleting service station:', error);
    }
  };

  const handleSelectServiceStation = (stationId) => {
    const selectedStation = serviceStations.find(station => station._id === stationId);
    setSelectedServiceStation(selectedStation); // Make sure this is updating correctly
  };

  return {
    vehicles,
    reminders,
    serviceStations,
    currentVehicle,
    setCurrentVehicle,
    currentReminder,
    setCurrentReminder,
    currentServiceStation,
    setCurrentServiceStation,
    selectedServiceStation,
    setSelectedServiceStation,
    fetchVehicles,
    fetchReminders,
    fetchServiceStations,
    saveVehicle,
    saveReminder,
    saveServiceStation,
    deleteVehicle,
    deleteReminder,
    deleteServiceStation,
    handleSelectServiceStation
  };
};

export default useAppData;
