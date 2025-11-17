const express = require('express');
const { authenticate } = require('../middleware/auth');
const { sendAlertNotification } = require('../services/notificationService');

const router = express.Router();

router.use(authenticate);

router.post('/test', async (req, res) => {
  try {
    await sendAlertNotification(req.user, {
      severity: 'info',
      type: 'test_notification',
      detail: req.body.message || 'This is a test notification',
    });
    return res.json({ message: 'Notification dispatched' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
