/* eslint no-throw-literal: 0 */
import paypal from 'paypal-rest-sdk';

/**
 * Call paypal-rest-sdk endpoint
 * @param {string} endpoint
 * @param {string} method
 * @param {object} params
 * @param {string | null} id
 * @returns {Promise} response result
 */
const callEndpoint = (endpoint, method, params = null, id = null) => {
  const args = [];
  [id, params].forEach((item) => {
    if (item) {
      args.push(item);
    }
  });
  return new Promise((resolve, reject) => {
    paypal[endpoint][method](...args, (error, result) => {
      if (error) {
        reject({ error: error.response, statusCode: error.httpStatusCode || 400 });
      } else {
        resolve({ paypalResponse: result, statusCode: result.httpStatusCode || 200 });
      }
    });
  });
};

/**
 * check if PayPal config installed on instance
 * @param {object} data
 * @returns {Promise.<*>}
 */
const configurePayPal = async (data) => {
  try {
    const config = await data.paypal_config.firstOrFail();
    const { PAYPAL_MODE, PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = config;
    paypal.configure({
      mode: PAYPAL_MODE,
      client_id: PAYPAL_CLIENT_ID,
      client_secret: PAYPAL_CLIENT_SECRET,
      headers: {
        custom: 'header'
      }
    });
  } catch (e) {
    throw ({
      message: 'Please install and configure PayPal using paypal-config socket.', statusCode: 400
    });
  }
};

/**
 * Check allowed request method type
 * @param {string} requestMethod
 * @param {array} expectedMethodTypes
 * @param {object | null } actions
 * @returns {object | null }
 */
const checkRequestMethodType = (requestMethod, expectedMethodTypes, actions) => {
  if (!expectedMethodTypes.includes(requestMethod)) {
    const expectedAsString = expectedMethodTypes.join(', ');
    throw ({
      message: `Make sure to use ${expectedAsString} for ${actions}.`,
      statusCode: 400
    });
  }
};

/**
 * Check value empty, undefined or null
 * @param {*} val
 * @returns {boolean}
 */
const checkRequired = (val) => {
  if (val === undefined || val === null) {
    return false;
  }
  const str = String(val).replace(/\s/g, '');
  return str.length > 0;
};

/**
 * Check for parameters required
 * @param {object} obj
 * @param {string} message
 * @param {number} statusCode
 * @returns {object| null} error response
 */
const validateRequired = (obj, message = 'Validation error(s)', statusCode = 400) => {
  const validateMessages = {};
  Object.keys(obj).forEach((key) => {
    if (!checkRequired(obj[key])) {
      validateMessages[key] = `The ${key} field is required`;
    }
  });

  if (Object.keys(validateMessages).length > 0) {
    throw ({ message, details: validateMessages, statusCode });
  }
};

export {
  callEndpoint,
  configurePayPal,
  checkRequestMethodType,
  validateRequired
};
