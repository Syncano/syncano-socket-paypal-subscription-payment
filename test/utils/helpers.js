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

const create_billing_agreement_details = {
  name: 'Fast Speed Agreement',
  description: 'Agreement for Fast Speed Plan',
  start_date: '2019-04-26T11:27:22.962Z',
  plan: {
    id: 'P-0NJ10521L3680291SOAQIVTQ'
  },
  payer: {
    payment_method: 'paypal'
  },
  shipping_address: {
    line1: 'StayBr111idge Suites',
    line2: 'Cro12ok Street',
    city: 'San Jose',
    state: 'CA',
    postal_code: '95112',
    country_code: 'US'
  }
};

export {
  create_billing_plan_details,
  update_billing_plan_details,
  create_billing_agreement_details
};
