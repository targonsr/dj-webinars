const axios = require('axios');

const LOKI_URL = process.env.LOKI_URL || 'http://localhost:3100';
const LOKI_ENDPOINT = LOKI_URL + '/loki/api/v1/push';
const BASIC_AUTH = process.env.BASIC_AUTH;

async function sendToLoki(logs, labels) {
  const payload = {
    streams: [{ stream: labels, values: logs }],
  };

  const config = {
    headers: Object.assign(
      { 'Content-Type': 'application/json' },
      BASIC_AUTH && { Authorization: 'Basic ' + Buffer.from(BASIC_AUTH).toString('base64') }
    ),
  };

  try {
    const response = await axios.post(LOKI_ENDPOINT, payload, config);
    console.log('Successfully sent ' + logs.length + ' logs. Status: ' + response.status);
  } catch (error) {
    console.error('Error sending logs:', (error.response && error.response.data) || error.message);
  }
}

module.exports = { sendToLoki }; 