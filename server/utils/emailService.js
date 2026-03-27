const postmark = require('postmark');

/**
 * getClient — lazily creates a Postmark ServerClient.
 * Using a getter pattern avoids crashing at require-time if
 * POSTMARK_API_KEY isn't yet in the environment (e.g. during testing).
 */
const getClient = () => {
  if (!process.env.POSTMARK_API_KEY) {
    throw new Error('POSTMARK_API_KEY is not set in environment variables.');
  }
  return new postmark.ServerClient(process.env.POSTMARK_API_KEY);
};

/**
 * sendEmail — sends a single email via Postmark.
 *
 * @param {object} options
 * @param {string} options.to        - recipient email address
 * @param {string} options.from      - sender address (must be verified in Postmark)
 * @param {string} options.subject   - email subject line
 * @param {string} options.textBody  - plain text body
 * @param {string} [options.htmlBody] - optional HTML body
 * @returns {Promise<object>} Postmark send response
 */
const sendEmail = async ({ to, from, subject, textBody, htmlBody }) => {
  const client = getClient();

  return client.sendEmail({
    From: from,
    To: to,
    Subject: subject,
    TextBody: textBody,
    ...(htmlBody && { HtmlBody: htmlBody }),
  });
};

module.exports = { sendEmail };
