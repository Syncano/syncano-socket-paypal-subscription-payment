import Syncano from '@syncano/core';
import { callEndpoint, configurePayPal, validateRequired } from './utils/helpers';

export default async (ctx) => {
  const { data, response } = new Syncano(ctx);
  const { payment_token } = ctx.args;

  try {
    await configurePayPal(data);

    validateRequired({ payment_token });
    const { statusCode, paypalResponse } =
      await callEndpoint('billingAgreement', 'execute', { }, payment_token);
    return response.json(paypalResponse, statusCode);
  } catch ({ error, statusCode, ...errorDetails }) {
    return response.json(error || errorDetails, statusCode || 400);
  }
};
