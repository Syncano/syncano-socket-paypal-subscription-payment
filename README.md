# paypal-subscription-payment

[![CircleCI](https://circleci.com/gh/Syncano/syncano-socket-paypal-subscription-payment.svg?style=svg)](https://circleci.com/gh/Syncano/syncano-socket-paypal-subscription-payment)

`version:` **0.0.1**

Socket for creating sunscription payments with paypal

To install, run:

```
syncano-cli add paypal-subscription-payment
```

## Endpoints

### billing-plans

Create, get, list and update actions for paypal billing plan.

#### Parameters

| name | type | description | example | long_description
| ---- | ---- | ----------- | ------- | ----------------
| create_billing_plan_details | object | Detail parameters for creating a billing plan | {   "description": "Create Plan for Regular",   "type": "INFINITE"   "merchant_preferences": {     "auto_bill_amount": "yes",     "cancel_url": "http://www.cancel.com",     "initial_fail_amount_action": "continue",     "max_fail_attempts": "1",     "return_url": "http://www.success.com",     "setup_fee": {         "currency": "USD",         "value": "25"     }   },   "name": "Testing1-Regular1",   "payment_definitions": [     {       ....     }   ] }  | 
| update_billing_plan_details | array | An array of JSON patch objects to apply partial updates to billing plan | [   {     "op": "replace",     "path": "/merchant-preferences",     "value": {       "cancel_url": "https://example.com/cancel",       "setup_fee": {       "value": "5",       "currency": "USD"       }     }   } ]  | 
| billing_plan_id | string | The ID of the billing plan to update or retrieve. | P-3FV74344GJ503923KW | Note that this is required for get and update and shouldn't be passed for create or list billing plans. 
| page | string | Zero-indexed number of the first page that begins the set of pages that are returned (List billing plans) |  | 
| status | string | Filters the plans in the response by a plan status (List billing plans) | INACTIVE/CREATED/ACTIVE | 
| page_size | string | Number of plans to list on a single page (List billing plans) | 10 | 
| total_required | string | Indicates whether the response includes the total_items and total_pages fields (List billing plans) | yes | 



#### Response

mimetype: `application/json`

##### Success `200`

```
{
  "id": "P-7DC96732KA7763723UOPKETA",
  "state": "CREATED",
  "name": "Plan with Regular and Trial Payment Definitions",
  "description": "Plan with regular and trial payment definitions.",
  "type": "FIXED",
  "payment_definitions": [ ]
  ...
}
```

##### Failed `400`

```
{
  "name": "VALIDATION_ERROR",
  "details": [ ... ],
  "message": "Invalid request. See details.",
  "information_link": "https://developer.paypal.com/docs/api/payments.billing-plans#errors",
  "httpStatusCode": 400
}
```

### billing-plans-activate

Endpoint that activates a billing plan so that it can be used to form billing agreements with users

#### Parameters

| name | type | description | example
| ---- | ---- | ----------- | -------
| billing_plan_id | string | The ID of the billing plan. | P-3FV74344GJ503923KW



#### Response

mimetype: `application/json`

##### Success `200`

```
200 OK
```

### billing-agreements

Create, get, list and update actions for paypal billing agreement.

#### Parameters

| name | type | description | example
| ---- | ---- | ----------- | -------
| create_billing_agreement_details | object | Parameters for creating a billing agreement | {   "name": "Fast Speed Agreement",   "description": "Agreement for Fast Speed Plan",   "start_date": isoDate,   "plan": {     "id": "P-0NJ10521L3680291SOAQIVTQ"   },   "payer": {     "payment_method": "paypal"   },   "shipping_address": {     "line1": "StayBr111idge Suites",     "line2": "Cro12ok Street",     "city": "San Jose",     "state": "CA",     "postal_code": "95112",     "country_code": "US"   } } 
| update_billing_agreement_details | array | An array of JSON patch objects to apply partial updates to billing agreement | [   {     "op": "replace",     "path": "/merchant-preferences",     "value": {       "description": "Newer Description",       "name": "New Name",       "shipping_address": {         "line1": "StayBr111idge Suites",         "line2": "Cro12ok Street",         "city": "San Jose",         "state": "CA",         "postal_code": "95112",         "country_code": "US"       }     }   } ] 
| billing_agreement_id | string | The ID of a billing agreement. | P-3FV74344GJ503923KW



#### Response

mimetype: `application/json`

##### Success `200`

```
{
  "id": "P-7DC96732KA7763723UOPKETA",
  "state": "CREATED",
  "name": "Plan with Regular and Trial Payment Definitions",
  "description": "Plan with regular and trial payment definitions.",
  "type": "FIXED",
  "payment_definitions": [ ]
  ...
}
```

##### Failed `400`

```
{
  "name": "VALIDATION_ERROR",
  "details": [ ... ],
  "message": "Invalid request. See details.",
  "information_link": "https://developer.paypal.com/docs/api/payments.billing-plans#errors",
  "httpStatusCode": 400
}
```

### billing-agreements-bill-balance

Endpoint that bills the balance for an agreement.

#### Parameters

| name | type | description | example
| ---- | ---- | ----------- | -------
| billing_agreement_id | string | The ID of a billing agreement. | P-3FV74344GJ503923KW
| amount | object | Billing agreement amounta and currency | {   "value": "100",   "currency": "USD" } 
| note | string | Optional note that describes the reason for the billing action | Billing balance amount



#### Response

mimetype: `application/json`

##### Success `204`

```
204 No Content
```

### billing-agreements-cancel

Endpoint to cancel a billing agreement.

#### Parameters

| name | type | description | example
| ---- | ---- | ----------- | -------
| billing_agreement_id | string | The ID of a billing agreement. | P-3FV74344GJ503923KW
| note | string | Optional note that describes the reason for the cancellation. | Canceling the agreement



#### Response

mimetype: `application/json`

##### Success `204`

```
204 No Content
```

### billing-agreements-re-activate

Endpoint to re-activate a suspended billing agreement

#### Parameters

| name | type | description | example
| ---- | ---- | ----------- | -------
| billing_agreement_id | string | The ID of a billing agreement. | P-3FV74344GJ503923KW
| note | string | Optional note that describes the reason for the re-activation | Re-activating agreement



#### Response

mimetype: `application/json`

##### Success `204`

```
204 No Content
```

### billing-agreements-set-balance

Endpoint that sets the balance for an agreement

#### Parameters

| name | type | description | example
| ---- | ---- | ----------- | -------
| billing_agreement_id | string | The ID of a billing agreement. | P-3FV74344GJ503923KW
| amount | object | Billing agreement amount and currency | {   "value": "100",   "currency": "USD" } 



#### Response

mimetype: `application/json`

##### Success `204`

```
204 No Content
```

### billing-agreements-suspend

Endpoint that suspends a billing agreement

#### Parameters

| name | type | description | example
| ---- | ---- | ----------- | -------
| billing_agreement_id | string | The ID of a billing agreement. | P-3FV74344GJ503923KW
| note | string | Optional note that describes the reason for the state change | Suspending the agreement



#### Response

mimetype: `application/json`

##### Success `204`

```
204 No Content
```

### billing-agreements-transactions

Endpoint to list transactions for an agreement

#### Parameters

| name | type | description | example
| ---- | ---- | ----------- | -------
| billing_agreement_id | string | The ID of a billing agreement. | P-3FV74344GJ503923KW
| start_date | string | The start date of the range of transactions to list | 
| end_date | string | The end date of the range of transactions to list | 



#### Response

mimetype: `application/json`

##### Success `200`

```
{
  "agreement_transaction_list": [
    {
      "transaction_id": "I-V8SSE9WLJGY6",
      "status": "Completed",
      ....
    }
    ...
  ]
}
```

### billing-agreements-execute

Endpoint that executes a billing agreement

#### Parameters

| name | type | description | example
| ---- | ---- | ----------- | -------
| payment_token | string | Payment Token of format EC-XXXXXX, appended to return url as a parameter after buyer approves agreement | EC-2V0782854X675410W



#### Response

mimetype: `application/json`

##### Success `200`

```
{
  "id": "I-1TJ3GAGG82Y9",
  "state": "Active",
  "description": "Monthly agreement with free trial payment definition.",
  ...
}
```
### Contributing

#### How to Contribute
  * Fork this repository
  * Clone from your fork
  * Make your contributions (Make sure your work is well tested)
  * Create Pull request from the fork to this repo

#### Setting up environment variables
  * Create a `.env` on parent folder
  * Copy contents of `.env-sample` file to newly created `.env` file and assign appropriate values to the listed variables.

#### Testing
  * Ensure all your test are written on the `test` directory
  * Use the command `npm test` to run test