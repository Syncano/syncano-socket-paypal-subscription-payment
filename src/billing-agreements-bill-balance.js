import Syncano from '@syncano/core';
import { callEndpoint, configurePayPal, validateRequired } from './utils/helpers';

export default async (ctx) => {
  const { data, response } = new Syncano(ctx);
  const { billing_agreement_id, note = '', amount } = ctx.args;

  try {
    await configurePayPal(data);

    validateRequired({ billing_agreement_id, amount });
    const params = { amount, note };
    const { statusCode, paypalResponse } = await callEndpoint(
      'billingAgreement', 'billBalance', params, billing_agreement_id);
    return response.json(paypalResponse, statusCode);
  } catch ({ error, statusCode, ...errorDetails }) {
    return response.json(error || errorDetails, statusCode || 400);
  }
};
