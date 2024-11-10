const GuestList = require('../models/GuestListModel');
const { sendInvitationEmail } = require('../Reminder/mailer');
const { authenticateToken } = require('../middleware/authMiddleware'); // Adjust the path as necessary

const sendInvitation = async (req, res) => {
  const { id } = req.params;
  const { invitationMessage } = req.body;

  try {
    // Optionally, you can access the authenticated user
    const userId = req.user.id; // Assuming you store user ID in the token

    const guest = await GuestList.findById(id);
    if (!guest) {
      return res.status(404).json({ message: 'Guest not found' });
    }

    await sendInvitationEmail(guest.email, invitationMessage);

    res.status(200).json({ message: 'Invitation sent successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending invitation', error: error.message });
  }
};

module.exports = { sendInvitation };
