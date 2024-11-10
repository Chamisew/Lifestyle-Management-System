// src/pages/ReminderPage.js
import React from 'react';
import Nav from '../Nav/Nav';
import Footer from '../Footer/Footer';
import ReminderForm from '../AutoAssist/ReminderForm';
import ReminderList from '../AutoAssist/ReminderList';
import '../AutoAssist/vehicleform.css'
import '../AutoAssist/Home.css'

function ReminderPage({ reminders, vehicles, saveReminder, deleteReminder, setCurrentReminder, currentReminder, selectedServiceStation, selectServiceStation }) {
  return (
    <div>
      <Nav />
      <h1 className='title'>Add Reminders</h1>
      <ReminderForm 
        saveReminder={saveReminder} 
        vehicles={vehicles} 
        currentReminder={currentReminder} 
        selectedServiceStation={selectedServiceStation} 
      />
      <ReminderList reminders={reminders} setCurrentReminder={setCurrentReminder} deleteReminder={deleteReminder} />
      <Footer />
    </div>

  );
}

export default ReminderPage;
