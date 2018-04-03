import Syncano from '@syncano/core';
import { callEndpoint, configurePayPal, validateRequired } from './utils/helpers';

export default async (ctx) => {
  const { data, response } = new Syncano(ctx);
  const { billing_agreement_id, note = '' } = ctx.args;

  try {
    await configurePayPal(data);

    validateRequired({ billing_agreement_id });
    const { statusCode, paypalResponse } =
      await callEndpoint('billingAgreement', 'reactivate', { note }, billing_agreement_id);
    return response.json(paypalResponse, statusCode);
  } catch ({ error, statusCode, ...errorDetails }) {
    return response.json(error || errorDetails, statusCode || 400);
  }
};
