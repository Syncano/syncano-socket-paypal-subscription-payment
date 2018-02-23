import request from 'supertest';
import { expect } from 'chai';
import { run, generateMeta } from 'syncano-test';
import 'dotenv/config';

import {
  create_billing_plan_params, update_payment_params, updated_insurance
} from './utils/helpers';

describe('billing-plans', () => {
  const { PAYPAL_CONFIG_URL, PAYPAL_MODE, PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;
  const meta = generateMeta('billing-plans');
  let billing_plan_id = '';
  const requestUrl = request(PAYPAL_CONFIG_URL);

  before((done) => {
    requestUrl.post('/')
      .set({ 'X-API-KEY': meta.token, 'Content-Type': 'application/json' })
      .send({ PAYPAL_MODE, PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET })
      .then(() => {
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  describe('POST', () => {
    it('should create billing plan successfully with valid parameters', (done) => {
      meta.request.REQUEST_METHOD = 'POST';
      run('billing-plans',
        { args: { create_billing_plan_details: create_billing_plan_params }, meta })
        .then((res) => {
          const billing_plan = res.data;
          billing_plan_id = billing_plan.id;

          expect(res.code).to.equal(201);
          expect(billing_plan.id).to.contain('P-');

          expect(billing_plan).to.have.property('state');
          expect(billing_plan.state).to.equal('CREATED');
          expect(billing_plan).to.have.property('description');
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('should return "VALIDATION_ERROR" if type parameter absent', (done) => {
      meta.request.REQUEST_METHOD = 'POST';
      const argsValidation = { ...create_billing_plan_params, type: null };
      run('billing-plans', { args: { create_billing_plan_details: argsValidation }, meta })
        .then((res) => {
          expect(res.code).to.equal(400);
          expect(res.data.name).to.equal('VALIDATION_ERROR');
          expect(res.data).to.have.property('debug_id');
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });

  // describe('PATCH', () => {
  //   it('should update payment successfully with valid parameters', (done) => {
  //     meta.request.REQUEST_METHOD = 'PATCH';
  //     run('billing-plans',
  //       { args: { update_payment_details: update_payment_params, payment_id }, meta })
  //       .then((res) => {
  //         const updatedPayment = res.data;
  //
  //         expect(res.code).to.equal(200);
  //         expect(updatedbilling_plan.id).to.equal(payment_id);
  //
  //         expect(updatedPayment).to.have.property('links');
  //         expect(updatedPayment).to.have.property('transactions');
  //
  //         // Check for updated_insurance
  //         expect(updatedbilling_plan.transactions[0].amount.details.insurance)
  //           .to.equal(updated_insurance);
  //         done();
  //       })
  //       .catch((err) => {
  //         done(err);
  //       });
  //   });
  // });
  //
  // describe('GET', () => {
  //   it('should show details for a payment if payment ID passed is valid', (done) => {
  //     meta.request.REQUEST_METHOD = 'GET';
  //     run('billing-plans', { args: { payment_id }, meta })
  //       .then((res) => {
  //         expect(res.code).to.equal(200);
  //         expect(res.data.id).to.equal(payment_id);
  //
  //         expect(res.data).to.have.property('links');
  //         expect(res.data).to.have.property('transactions');
  //         expect(res.data.intent).to.equal('sale');
  //         done();
  //       })
  //       .catch((err) => {
  //         done(err);
  //       });
  //   });
  //
  //   it('should list payments created if payment_id not passed as params', (done) => {
  //     meta.request.REQUEST_METHOD = 'GET';
  //     run('billing-plans', { args: { count: 3 }, meta })
  //       .then((res) => {
  //         expect(res.code).to.equal(200);
  //         expect(res.data).to.have.property('payments');
  //         expect(res.data).to.have.property('count');
  //         expect(res.data.payments).to.be.an.instanceof(Array);
  //         expect(res.data.payments.length).to.be.at.most(3);
  //         done();
  //       })
  //       .catch((err) => {
  //         done(err);
  //       });
  //   });
  // });
  //
  // describe('Invalid request method', () => {
  //   it('should return an error if request method is of type `DELETE`', (done) => {
  //     meta.request.REQUEST_METHOD = 'DELETE';
  //     run('billing-plans', { meta })
  //       .then((res) => {
  //         const actions = 'creating, retrieving and updating payments respectively';
  //         const expectedMethodTypes = ['POST', 'GET', 'PATCH'].join(', ');
  //         const errorMessage = `Make sure to use ${expectedMethodTypes} for ${actions}.`;
  //         expect(res.code).to.equal(400);
  //         expect(res.data.message).to.equal(errorMessage);
  //         done();
  //       })
  //       .catch((err) => {
  //         done(err);
  //       });
  //   });
  // });
});
