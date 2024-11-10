const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');
const { MONGO_URI } = require('./config');
const {scheduleReminderJob} = require('./Reminder/reminderQueue')
//require('./scheduler');
require('dotenv').config();


//reminder 
scheduleReminderJob();

///reruire 8 funtions routes.....................

//login 
const userRoutes = require('./routes/userRoutes');

//meet-assist
const router=require("./routes/1MeetAssistRoutes");
const meetSheduleRoutes = require('./routes/MeetSheduleRoute');
//auto-assist
const vehicleRoutes = require('./routes/vehicleRoutes');
const reminderRoutes = require('./routes/reminderRoutes');
const serviceStationRoutes = require('./routes/serviceStationRoutes');

//finance guard
const path = require('path');
const incomecardRoutes = require('./routes/incomecardRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const transactionRoutes = require("./routes/transactionRoutes");
const goalRoutes = require("./routes/goalRoutes");
const savingRoutes = require("./routes/savingRoutes");
const loanRoutes = require('./routes/loanRoutes');

//shop smart
const todoRoutes = require("./routes/TodoRoute");
const eventRoutes = require('./routes/EventRoute');
const MeetingRoute = require('./routes/MeetingRoute');
const VehicleRoute = require('./routes/VehicleRoute');
const occasionRoutes = require('./routes/OccasionRoute');
const hospitalTasksRouter = require('./routes/hospitalTasksRoute');

//eventPlanner
const eventsRoutes = require("./routes/eventRoutes");
const CreateItineraryRoute = require("./routes/CreateItineraryRoute");
const activityRoutes = require("./routes/activityRoutes");
const expensesRoutes = require("./routes/expensesRoutes");
const guestListRoutes = require('./routes/guestListRoutes');
const invitationRoutes = require('./routes/InvitationRoute');

//eventMinder
const eventMinderReminderRoutes = require("./routes/eventMinderReminderRoutes");

//Pay-Track
const paymentRoutes = require('./routes/paymentRoutes');
const cardRoutes = require('./routes/cardRoutes');
const payreminderRoutes = require('./routes/payreminderRoutes');


//health-mate
const healthroute = require('./routes/HealthMatereminderRoutes');
const healthDataRoute = require('./routes/HealthDataRoutes');

//........................................

const app = express();


app.use(bodyParser.json());
app.use(express.json());
app.use(cors());


//routes.......................................
//login
app.use('/users', userRoutes);


//meet-assist
app.use("/meet",router);
app.use('/meetShedule', meetSheduleRoutes);


//auto-assist
app.use('/api/vehicles', vehicleRoutes); 
app.use('/api/reminders', reminderRoutes);
app.use('/api/service-stations', serviceStationRoutes);


//finance guard
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/budget', budgetRoutes);
app.use('/', incomecardRoutes);
app.use("/goals", goalRoutes);
app.use("/api/transactions", transactionRoutes);
app.use('/loans', loanRoutes);
app.use("/continue", savingRoutes);




//eventPlanner
app.use('/api', eventsRoutes);
app.use('/api',CreateItineraryRoute);
app.use('/api', activityRoutes);
app.use('/api', expensesRoutes);
app.use('/api', guestListRoutes);
app.use('/api', invitationRoutes);

//shop smart
app.use('/api/todos', todoRoutes); 
app.use('/api/event', eventRoutes);
app.use('/api/meetings', MeetingRoute);
app.use('/api/vehicle', VehicleRoute);
app.use('/api/occasions', occasionRoutes);
app.use('/api/medicals', hospitalTasksRouter);

//eventMinder
app.use("/eventMind", eventMinderReminderRoutes);

//Pay-Track
app.use('/api/payments', paymentRoutes);
app.use('/api/payreminders', payreminderRoutes);
app.use('/api/cards', cardRoutes);

//health-mate
app.use('/health', healthroute);
app.use('/healthdata', healthDataRoute);




mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .then(() => {
    app.listen(5000, () => console.log('Server running on port 5000'));
  })
  .catch(err => console.log(err));
