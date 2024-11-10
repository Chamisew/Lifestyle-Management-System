import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
//import Header from './components/Header';
//import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './maindash/home/HomePage.js';

import Maindashboard from './pages/Dashboard';


import MeetHome from "./components/MeetAssist/MeetHome/MeetHome";
import AddNewMeeting from "./components/MeetAssist/AddNewMeeting/AddNewMeeting";
import UpcomingMeet from "./components/MeetAssist/UpcomingMeet/UpcomingMeet";
import ShowAMeet from "./components/MeetAssist/ShowAMeet/ShowAMeet";
import ChangeMeet from "./components/MeetAssist/ChangeMeet/ChangeMeet";
import MeetSchedule from "./components/MeetAssist/MeetSchedule/MeetSchedule";
import TimeTable from "./components/MeetAssist/TimeTable/TimeTable";

// import Nav from './components/AutoAssist/Nav.js';
// import Footer from './components/AutoAssist/Footer';
import Home from './components/AutoAssist/AAhome';
import VehiclePage from './components/pages/VehiclePage';
import ReminderPage from './components/pages/ReminderPage';
import ServiceStationPage from './components/pages/ServiceStationPage';
import useAppData from './components/hooks/useAppData.js';
import './App.css';
import './components/AutoAssist/App.css'



//event planner
import EHome from './components/eventPlanner/EventPlannerHome/EventPlannerHome';
import EventsHome from './components/eventPlanner/Event/EventHome';
import AddEvent from './components/eventPlanner/Event/AddEvent';
import ShowDeleteEvent from './components/eventPlanner/Event/ShowDeleteEvent';
import EditEvent from './components/eventPlanner/Event/EditEvent';
import CreateItinerary from './components/eventPlanner/Itinerary/CreateItinerary';
import CreatedItineraryMange from './components/eventPlanner/Itinerary/CreatedItineraryMange';
import Activity from './components/eventPlanner/Itinerary/Activity';
import Expenses from './components/eventPlanner/TrackExpenses/Expenses';
import ManageExpenses from './components/eventPlanner/TrackExpenses/ManageExpenses';
import ViewExpenses from './components/eventPlanner/TrackExpenses/ViewExpenses';
import AddGuest from './components/eventPlanner/GuestList/AddGuest';
import GuestList from './components/eventPlanner/GuestList/GuestList';
import UpdateGuest from './components/eventPlanner/GuestList/UpdateGuest';
import Invitation from './components/eventPlanner/GuestList/Invitation';


import Allcard from './financeGuard/layout/Content/Content';
import Stat from './financeGuard/components/StatisticsChart/StatisticsChart'
import GP from './financeGuard/components/GoalProgress/GoalProgress'
import IncomeCalendar from './financeGuard/components/IncomeCalendar/IncomeCalendar';
import Netincome from './financeGuard/components/netincome/netincome';
import Incomemainconteiner from './financeGuard/layout/incomemainconteiner/incomemainconteiner'



import Services from "./components/Services";
import AddReminder from './components/AddReminder';
import ReminderList from './components/ReminderList';
import UpdateReminder from './components/UpdateReminder';
import HealthDataAdd from "./components/HealthDataAdd";
import HealthDataView from "./components/HealthDataView";
import UpdateHealthData from "./components/UpdateHealthData";
import HealthDataDashboard from "./components/HealthDataDashboard";
import HomePage from "./components/HomePage";
import EmergencyContacts from "./components/EmergencyContacts";
import DoctorAppointments from "./components/DoctorAppointments";
import OrderPrescription from "./components/PrescriptionOrder";
import PatientCare from "./components/PatientCare"; 


//shop Smart
import AddingMeeting from './components/shopSmart/AddMeeting.js';
import AddingOccasion from './components/shopSmart/AddOccasion';
import AddingVehicle from './components/shopSmart/AddVehicle';
import AddingTodo from './components/shopSmart/AddTodo';
import AddingEvent from './components/shopSmart/AddEvent';
import AddingMedical from './components/shopSmart/AddMedical';
import ShopSmart from './components/shopSmart/ShopSmart';
import Ms from './components/shopSmart/Ms';



import PaymentForm from './PayTrack/components/PaymentForm.js';
import UpdatePayment from './PayTrack/components/UpdatePayment';
import AddpayReminder from './PayTrack/components/payAddReminder';
import AddCard from './PayTrack/components/AddCard';
import CardList from './PayTrack/components/CardList';
import Paymenthome from './PayTrack/pages/paymenthome';
import Cardetails from './PayTrack/pages/Cardetails';
import PayTrackHome from './PayTrack/components/PayTrackHome';







//EVENTMINDER
import Main from './components/EVENTMINDER/Mainpage/Main.js';
import SecondPage from './components/EVENTMINDER/secondPage/SecondPage.js';
import Bdays from './components/EVENTMINDER/birthday/bdays.js';
import ViweBday from './components/EVENTMINDER/viwe/ViweBday.js';
import Anniversaries from './components/EVENTMINDER/anniversaries/Anniversaries.js';
import ViewAnniversaries from './components/EVENTMINDER/viwe/ViewAnniversaries.js';
import Mdates from './components/EVENTMINDER/mdates/Mdates.js';
import ViewMemorialDay from './components/EVENTMINDER/viwe/ViewMemorialDay.js';
import Otherday from './components/EVENTMINDER/otherSpecialDays/Otherday.js';
import ViewOtherSpecialDays from './components/EVENTMINDER/viwe/ViewOtherSpecialDays.js';
import AddSpecialDayForm from './components/EVENTMINDER/add/AddSpecialDayForm.js';
import SendWishAndGift from './components/EVENTMINDER/Giftandwish/SendWishAndGift.js';
import GiftOptions from './components/EVENTMINDER/Giftandwish/GiftOptions.js';







//import IncomeList from './pages/IncomeList'; 
//import EditIncome from './pages/EditIncome'; 
//import Home from './pages/Home'; 
//import GoalForm from './components/GoalForm';
//import GoalList from './components/GoalList';
//import IncomeSet from './components/Incomeset';

function App() {
  const appData = useAppData();

  return (

    <Router>
      {/* <Nav />
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/vehicle-form"
            element={<VehiclePage {...appData} />}
          />
          <Route
            path="/reminders"
            element={<ReminderPage {...appData} />}
          />
          <Route
            path="/service-stations"
            element={<ServiceStationPage {...appData} />}
          />
        </Routes>
        <Footer />
      </div> */}
      <div>
     
      
        <Routes>
          <Route path="/" element={< Maindashboard />} />
          <Route path="/login" element={<Login />} /> 
          <Route path="/maindashboard" element={<Dashboard />} />          
          <Route path="/register" element={<Register />} /> 

          <Route path="/autoAssist" element={<Home />} />
          <Route
            path="/vehicle-form"
            element={<VehiclePage {...appData} />}
          />
          <Route
            path="/reminders"
            element={<ReminderPage {...appData} />}
          />
          <Route
            path="/service-stations"
            element={<ServiceStationPage {...appData} />}
          />
          {/* <Route
            path="/reminder-form"
            element={<ReminderForm />} /> */}



          {/* Navigation to MeetAssist Page  */}
          <Route path="/meet-assist" element={<MeetHome />} />
          <Route path="/MH" element={<MeetHome />} />
          <Route path="/add-meeting" element={<AddNewMeeting/>}></Route>
          <Route path="/upcoming-meetings" element={<UpcomingMeet/>}></Route>
          <Route path="/meeting/:id" element={<ShowAMeet/>}></Route>
          <Route path="/edit-meeting/:id" element={<ChangeMeet/>}></Route>
          <Route path="/schedule" element={<MeetSchedule/>}></Route>     
          <Route path="/get-direction" element={<Ms/>}></Route>     
          <Route path="/timetable/:date" element={<TimeTable/>}></Route>




           
        <Route path="/payments" element={<PaymentForm />} />
        <Route path="/update-payment/:id" element={<UpdatePayment />} />
        <Route path="/add-payreminder" element={<AddpayReminder />} />
        <Route path="/add-card" element={<AddCard />} />
        <Route path="/card" element={<CardList />} />
        <Route path="/paymenthome" element={<PayTrackHome />} />
        <Route path="/add-payment" element={<Paymenthome />} />
        <Route path="/cardetails" element={<Cardetails />} />


          {/*Financeguard routes*/}
          <Route path="/incomemainconteiner" element={<Incomemainconteiner />} />
          <Route path="/allincome" element={<Allcard />} />
        <Route path="/stat" element={<Stat />} />
        <Route path="/gp" element={<GP />} /> 
        <Route path="/incomecalendar" element={<IncomeCalendar />} /> 
        <Route path="/netincome" element={<Netincome />} /> 



       
      
 

        {/* event planner*/}
        <Route path="/mainhome" element={<EHome />} />
        <Route path="/eventhome" element={<EventsHome />} /> 
        <Route path="/add-event" element={<AddEvent />} />
        <Route path="/events/:id" element={<ShowDeleteEvent />} />
        <Route path="/edit/:id" element={<EditEvent />} />
        <Route path="/createitinerary" element={<CreateItinerary />} />
        <Route path="/CreatedItineraryMange" element={<CreatedItineraryMange />} />
        <Route path="/planmore" element={<Activity />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/gotrackexpense" element={<ManageExpenses />} />
        <Route path="/viewexpenses" element={<ViewExpenses />} />
        <Route path="/addguest" element={<AddGuest />} />
        <Route path="/viewguest" element={<GuestList />} />
        <Route path="/editguest/:id" element={<UpdateGuest />} />
        <Route path="/sendinvitation/:id" element={<Invitation />} />




        <Route path="/helthmatehome" element={<HomePage />} />
            <Route path="/services" element={<Services />} />
            <Route path="/emergency-contacts" element={<EmergencyContacts />} />
            <Route path="/doctor-appointments" element={<DoctorAppointments />} />
            <Route path="/prescription-order" element={<OrderPrescription />} />
            <Route path="/remainderlist" element={<ReminderList />} />
            <Route path="/add" element={<AddReminder />} />
            <Route path="/update/:id" element={<UpdateReminder />} />

            <Route path="/addhealthdata" element={<HealthDataAdd />} />
            <Route path="/viewhealthdata" element={<HealthDataView />} />
            <Route path="/updatehealthdata/:id" element={<UpdateHealthData />} />
            <Route path="/dashboard" element={<HealthDataDashboard />} />
            <Route path="/patient-care" element={<PatientCare />} />

           {/* shop Smart*/}
        <Route path="/shopsmart" element={<ShopSmart />} />
        <Route path="/meetingssmart" element={<AddingMeeting />} />
        <Route path="/occationsmart" element={<AddingOccasion />} />
        <Route path="/vehiclesmart" element={<AddingVehicle />} />
        <Route path="/todosmart" element={<AddingTodo />} />
        <Route path="/eventsmart" element={<AddingEvent />} />
        <Route path="/medicalsmart" element={<AddingMedical />} />
        <Route path="/Ms" element={<Ms />} />







 {/* EVENTMINDER*/}

         {/* Home/Main page */}
         <Route path="/event-minder-home" element={<Main />} />

{/* Second page */}
<Route path="/secondpage" element={<SecondPage/>} />

{/* Birthday-related routes */}
<Route path="/birthday" element={<Bdays/>} />
<Route path="/birthday/reminder" element={<ViweBday/>} /> 

{/* Anniversaries-related routes */}
<Route path="/anniversaries" element={<Anniversaries/>} />
<Route path="/anniversaries/reminder" element={<ViewAnniversaries/>} />

{/* Memorial dates-related routes */}
<Route path="/mdates" element={<Mdates/>} />
<Route path="/mdates/reminder" element={<ViewMemorialDay/>} />

{/* Other special days-related routes */}
<Route path="/otherday" element={<Otherday/>} />
<Route path="/otherday/reminder" element={<ViewOtherSpecialDays/>} />

{/* Form to add special days */}
<Route path="/addspecialday" element={<AddSpecialDayForm/>} />

{/* Sending wishes and gift options */}
<Route path="/sendwishandgift" element={<SendWishAndGift/>} /> 
<Route path="/gift-options" element={<GiftOptions/>} /> 


        </Routes>
      </div>
    </Router>



  );
}

export default App;

/*
<Header /> 
<Route path="/dashboard" element={< Dashboard/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/income-list" element={<IncomeList />} /> 
          <Route path="/edit-income/:id" element={<EditIncome />} /> 
          <Route path="/home" element={<Home />} />
          <Route path="/goals/new" element={<GoalForm />} />
          <Route path="/goals/edit/:id" element={<GoalForm />} />
          <Route path="/goals" element={<GoalList />} />
          <Route path="/incomeset" element={<IncomeSet />} />
          */