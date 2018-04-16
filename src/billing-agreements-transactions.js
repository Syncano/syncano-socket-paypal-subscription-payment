import Syncano from '@syncano/core';
import { callEndpoint, configurePayPal, validateRequired } from './utils/helpers';

export default async (ctx) => {
  const { data, response } = new Syncano(ctx);
  const { billing_agreement_id, start_date, end_date } = ctx.args;

  try {
    await configurePayPal(data);

    validateRequired({ billing_agreement_id });
    const { statusCode, paypalResponse } = await callEndpoint(
      'billingAgreement', 'searchTransactions', { start_date, end_date }, billing_agreement_id);
    return response.json(paypalResponse, statusCode);
  } catch ({ error, statusCode, ...errorDetails }) {
    return response.json(error || errorDetails, statusCode || 400);
  }
};
