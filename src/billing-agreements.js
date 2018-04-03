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
  const actionsMessage = 'creating, retrieving and updating billing agreements respectively';

  try {
    await configurePayPal(data);

    checkRequestMethodType(requestMethod, ['POST', 'GET', 'PATCH'], actionsMessage);

    if (requestMethod === 'POST') {
      validateRequired({ create_billing_agreement_details });
      const { statusCode, paypalResponse } = await callEndpoint(
        'billingAgreement', 'create', create_billing_agreement_details);
      return response.json(paypalResponse, statusCode);
    } else if (requestMethod === 'GET') {
      validateRequired({ billing_agreement_id });
      const { statusCode, paypalResponse } =
        await callEndpoint('billingAgreement', 'get', null, billing_agreement_id);
      return response.json(paypalResponse, statusCode);
    } else if (requestMethod === 'PATCH') {
      validateRequired({ update_billing_agreement_details, billing_agreement_id });
      const { statusCode, paypalResponse } = await callEndpoint(
        'billingAgreement', 'update', update_billing_agreement_details, billing_agreement_id);
      return response.json(paypalResponse, statusCode);
    }
  } catch ({ error, statusCode, ...errorDetails }) {
    return response.json(error || errorDetails, statusCode || 400);
  }
};
