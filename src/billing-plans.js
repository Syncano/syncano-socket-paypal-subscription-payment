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
  const actions = 'creating, retrieving and updating billing plans respectively';
  const expectedMethodTypes = ['POST', 'GET', 'PATCH'];

  try {
    await configurePayPal(data);

    checkRequestMethodType(requestMethod, expectedMethodTypes, actions);

    if (requestMethod === 'POST') {
      validateRequired({ create_billing_plan_details });
      const result = await callEndpoint('billingPlan', 'create', create_billing_plan_details);
      const { statusCode, paypalResponse } = result;
      response.json(paypalResponse, statusCode);
    } else if (requestMethod === 'GET') {
      let result;
      if (billing_plan_id) {
        result = await callEndpoint('billingPlan', 'get', null, billing_plan_id);
      } else {
        result = await callEndpoint('billingPlan', 'list', list_details);
      }
      const { statusCode, paypalResponse } = result;
      response.json(paypalResponse, statusCode);
    } else if (requestMethod === 'PATCH') {
      validateRequired({ update_billing_plan_details });
      const result = await callEndpoint(
        'billingPlan', 'update', update_billing_plan_details, billing_plan_id);
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
