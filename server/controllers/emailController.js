const { sendEmail } = require('../utils/emailService');

/**
 * sendTestEmail — POST /api/email/test
 *
 * Sends a test email to verify the Postmark integration is working.
 * The "To" and "From" addresses can be overridden via the request body;
 * defaults make it easy to smoke-test without a payload.
 */
const sendTestEmail = async (req, res, next) => {
  try {
    const {
      to = 'test@example.com',
      from = process.env.EMAIL_FROM || 'noreply@energex.io',
    } = req.body;

    const result = await sendEmail({
      to,
      from,
      subject: 'EnergeX — Email Integration Test',
      textBody: 'If you received this, the Postmark integration is working correctly.',
      htmlBody: '<p>If you received this, the <strong>Postmark integration</strong> is working correctly.</p>',
    });

    res.status(200).json({
      success: true,
      message: 'Test email sent successfully.',
      postmarkResponse: result,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { sendTestEmail };
