import Syncano from '@syncano/core';
import {
  callEndpoint, checkRequestMethodType, configurePayPal,
  validateRequired
} from './utils/helpers';

export default async (ctx) => {
  const { data, response } = new Syncano(ctx);
  const requestMethod = ctx.meta.request.REQUEST_METHOD;
  const {
    create_billing_plan_details, update_billing_plan_details, billing_plan_id, ...list_details
  } = ctx.args;
  const actionsMessage = 'creating, retrieving and updating billing plans respectively';

  try {
    await configurePayPal(data);

    checkRequestMethodType(requestMethod, ['POST', 'GET', 'PATCH'], actionsMessage);

    if (requestMethod === 'POST') {
      validateRequired({ create_billing_plan_details });
      const { statusCode, paypalResponse } =
        await callEndpoint('billingPlan', 'create', create_billing_plan_details);
      return response.json(paypalResponse, statusCode);
    } else if (requestMethod === 'GET') {
      let result;
      if (billing_plan_id) {
        result = await callEndpoint('billingPlan', 'get', null, billing_plan_id);
      } else {
        result = await callEndpoint('billingPlan', 'list', list_details);
      }
      const { statusCode, paypalResponse } = result;
      return response.json(paypalResponse, statusCode);
    } else if (requestMethod === 'PATCH') {
      validateRequired({ update_billing_plan_details, billing_plan_id });
      const { statusCode, paypalResponse } =
        await callEndpoint('billingPlan', 'update', update_billing_plan_details, billing_plan_id);
      return response.json(paypalResponse, statusCode);
    }
  } catch ({ error, statusCode, ...errorDetails }) {
    return response.json(error || errorDetails, statusCode || 400);
  }
};
