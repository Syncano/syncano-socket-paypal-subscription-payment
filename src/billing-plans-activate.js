import Syncano from '@syncano/core';
import { callEndpoint, configurePayPal, validateRequired } from './utils/helpers';

export default async (ctx) => {
  const { data, response } = new Syncano(ctx);
  const { billing_plan_id } = ctx.args;

  try {
    await configurePayPal(data);

    validateRequired({ billing_plan_id });
    const { statusCode, paypalResponse } =
      await callEndpoint('billingPlan', 'activate', null, billing_plan_id);
    return response.json(paypalResponse, statusCode);
  } catch ({ error, statusCode, ...errorDetails }) {
    return response.json(error || errorDetails, statusCode || 400);
  }
};
