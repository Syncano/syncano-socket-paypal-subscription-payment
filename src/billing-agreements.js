import Syncano from '@syncano/core';
import {
  callEndpoint, checkRequestMethodType, configurePayPal,
  validateRequired
} from './utils/helpers';

export default async (ctx) => {
  const { data, response } = new Syncano(ctx);
  const requestMethod = ctx.meta.request.REQUEST_METHOD;
  const { create_billing_agreement_details, update_billing_agreement_details,
    billing_agreement_id } = ctx.args;
  const actions = 'creating, retrieving and updating billing agreements respectively';
  const expectedMethodTypes = ['POST', 'GET', 'PATCH'];

  try {
    await configurePayPal(data);

    checkRequestMethodType(requestMethod, expectedMethodTypes, actions);

    if (requestMethod === 'POST') {
      validateRequired({ create_billing_agreement_details });
      const result = await callEndpoint(
        'billingAgreement', 'create', create_billing_agreement_details);
      const { statusCode, paypalResponse } = result;
      response.json(paypalResponse, statusCode);
    } else if (requestMethod === 'GET') {
      validateRequired({ billing_agreement_id });
      const result = await callEndpoint('billingAgreement', 'get', null, billing_agreement_id);
      const { statusCode, paypalResponse } = result;
      response.json(paypalResponse, statusCode);
    } else if (requestMethod === 'PATCH') {
      validateRequired({ update_billing_agreement_details, billing_agreement_id });
      const result = await callEndpoint(
        'billingAgreement', 'update', update_billing_agreement_details, billing_agreement_id);
      const { statusCode, paypalResponse } = result;
      response.json(paypalResponse, statusCode);
    }
  } catch (err) {
    const { error, message, statusCode, details } = err;
    if (error) {
      return response.json(error, statusCode);
    }
    if (details) {
      return response.json({ message, details }, 400);
    }
    return response.json({ message }, statusCode || 400);
  }
};
