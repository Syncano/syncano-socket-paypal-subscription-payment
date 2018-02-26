const create_billing_plan_details = {
  description: 'Create Plan for Regular',
  merchant_preferences: {
    auto_bill_amount: 'yes',
    cancel_url: 'http://www.cancel.com',
    initial_fail_amount_action: 'continue',
    max_fail_attempts: '1',
    return_url: 'http://www.success.com',
    setup_fee: {
      currency: 'USD',
      value: '25'
    }
  },
  name: 'Testing1-Regular1',
  payment_definitions: [
    {
      amount: {
        currency: 'USD',
        value: '100'
      },
      charge_models: [
        {
          amount: {
            currency: 'USD',
            value: '10.60'
          },
          type: 'SHIPPING'
        },
        {
          amount: {
            currency: 'USD',
            value: '20'
          },
          type: 'TAX'
        }
      ],
      cycles: '0',
      frequency: 'MONTH',
      frequency_interval: '1',
      name: 'Regular 1',
      type: 'REGULAR'
    },
    {
      amount: {
        currency: 'USD',
        value: '20'
      },
      charge_models: [
        {
          amount: {
            currency: 'USD',
            value: '10.60'
          },
          type: 'SHIPPING'
        },
        {
          amount: {
            currency: 'USD',
            value: '20'
          },
          type: 'TAX'
        }
      ],
      cycles: '4',
      frequency: 'MONTH',
      frequency_interval: '1',
      name: 'Trial 1',
      type: 'TRIAL'
    }
  ],
  type: 'INFINITE'
};

const update_billing_plan_details = [
  {
    op: 'replace',
    path: '/merchant-preferences',
    value: {
      cancel_url: 'http://www.paypal123.com',
      setup_fee: {
        value: '22',
        currency: 'USD'
      }
    }
  }
];

const execute_payment_response =
  {
    id: 'PAY-9N9834337A9191208KOZOQWI',
    create_time: '2017-07-01T16:56:57Z',
    update_time: '2017-07-01T17:05:41Z',
    state: 'approved',
    intent: 'order',
    payer: {
      payment_method: 'paypal',
      payer_info: {
        email: 'qa152-biz@example.com',
        first_name: 'Thomas',
        last_name: 'Miller',
        payer_id: 'PUP87RBJV8HPU',
        shipping_address: {
          line1: '4th Floor, One Lagoon Drive',
          line2: 'Unit #34',
          city: 'Redwood City',
          state: 'CA',
          postal_code: '94065',
          country_code: 'US',
          phone: '011862212345678',
          recipient_name: 'Thomas Miller'
        }
      }
    },
    transactions: [
      {
        amount: {
          total: '41.15',
          currency: 'USD',
          details: {
            subtotal: '30.00',
            tax: '0.15',
            shipping: '11.00'
          }
        },
        description: 'The payment transaction description.',
        item_list: {
          items: [
            {
              name: 'hat',
              sku: '1',
              price: '3.00',
              currency: 'USD',
              quantity: '5'
            },
            {
              name: 'handbag',
              sku: 'product34',
              price: '15.00',
              currency: 'USD',
              quantity: '1'
            }
          ],
          shipping_address: {
            recipient_name: 'Thomas Miller',
            line1: '4th Floor, One Lagoon Drive',
            line2: 'Unit #34',
            city: 'Redwood City',
            state: 'CA',
            phone: '011862212345678',
            postal_code: '94065',
            country_code: 'US'
          }
        },
        related_resources: [
          {
            order: {
              id: 'O-3SP845109F051535C',
              create_time: '2017-07-01T16:56:58Z',
              update_time: '2017-07-01T17:05:41Z',
              state: 'pending',
              amount: {
                total: '41.15',
                currency: 'USD'
              },
              parent_payment: 'PAY-9N9834337A9191208KOZOQWI',
              links: [
                {
                  href: 'https://api.sandbox.paypal.com/v1/payments/orders/O-3SP845109F051535C',
                  rel: 'self',
                  method: 'GET'
                },
                {
                  href: 'https://api.sandbox.paypal.com/v1/payments/payment/PAY-9N9834337A9191208KOZOQWI',
                  rel: 'parent_payment',
                  method: 'GET'
                },
                {
                  href: 'https://api.sandbox.paypal.com/v1/payments/orders/O-3SP845109F051535C/void',
                  rel: 'void',
                  method: 'POST'
                },
                {
                  href: 'https://api.sandbox.paypal.com/v1/payments/orders/O-3SP845109F051535C/authorize',
                  rel: 'authorization',
                  method: 'POST'
                },
                {
                  href: 'https://api.sandbox.paypal.com/v1/payments/orders/O-3SP845109F051535C/capture',
                  rel: 'capture',
                  method: 'POST'
                }
              ]
            }
          }
        ]
      }
    ],
    links: [
      {
        href: 'https://api.sandbox.paypal.com/v1/payments/payment/PAY-9N9834337A9191208KOZOQWI',
        rel: 'self',
        method: 'GET'
      }
    ]
  };


export {
  create_billing_plan_details,
  update_billing_plan_details,
  execute_payment_response
};
