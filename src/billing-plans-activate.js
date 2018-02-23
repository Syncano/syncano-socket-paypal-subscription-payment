import Syncano from '@syncano/core';
import { callEndpoint, configurePayPal, validateRequired } from './utils/helpers';

export default async (ctx) => {
  const { data, response } = new Syncano(ctx);
  const { billing_plan_id } = ctx.args;

  try {
    await configurePayPal(data);

    validateRequired({ billing_plan_id });
    const result = await callEndpoint(
      'billingPlan', 'activate', null, billing_plan_id);
    const { statusCode, paypalResponse } = result;
    response.json(paypalResponse, statusCode);
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
