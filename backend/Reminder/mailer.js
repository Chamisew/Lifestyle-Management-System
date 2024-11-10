const nodemailer = require('nodemailer');

// Configure the email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // email service
  auth: {
    user: 'lifestyleplanner6@gmail.com', 
    pass: 'oepz jswu zpgx kxeq', 
  },
});



//autoAssist
const autoAssistReminderEmail = async (email, reminderDetails) => {
  const { vehicleName, reminderType, date, appointedTime, location, notes } = reminderDetails;

  const reminderMessage = `Reminder: You have an upcoming ${reminderType} for your vehicle "${vehicleName}" scheduled on ${date} at ${appointedTime} at ${location}.
Notes: ${notes || "No notes provided."}`;

  const mailOptions = {
    from: 'lifestyleplanner6@gmail.com',
    to: email,
    subject: `Reminder: ${reminderType} for "${vehicleName}" Scheduled`,
    text: reminderMessage,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};


//eventPlanner
// Function to send invitation email
const sendInvitationEmail = async (email, invitationMessage) => {
  const mailOptions = {
    from: 'lifestyleplanner6@gmail.com',
    to: email,
    subject: 'Invitation',
    text: invitationMessage,
  };

  return transporter.sendMail(mailOptions);
};

// Function to send reminder email
const sendEventPlannerReminderEmail = async (email, eventDetails) => {
  const { name, date, time, location } = eventDetails;

  const reminderMessage = `Don't forget about the event "${name}" scheduled for ${date} at ${time} in ${location}.`;

  const mailOptions = {
    from: 'lifestyleplanner6@gmail.com',
    to: email,
    subject: `Reminder: Event "${name}" Scheduled`,
    text: reminderMessage,
  };

  await transporter.sendMail(mailOptions);
};


//meetAssist


//payTrack

//FinanceGuard

//eventMinder

//HealthMate

//ShopSmart

module.exports = {  autoAssistReminderEmail,
                    sendInvitationEmail,
                    sendEventPlannerReminderEmail,
};
