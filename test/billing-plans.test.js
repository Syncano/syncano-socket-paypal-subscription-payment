import request from 'supertest';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { run, generateMeta } from '@syncano/test';
import 'dotenv/config';

import { create_billing_plan_details, update_billing_plan_details } from './utils/helpers';

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
        { args: { create_billing_plan_details }, meta })
        .then((res) => {
          const billing_plan = res.data;
          billing_plan_id = billing_plan.id;
          process.env.TEST_BILLING_PLAN_ID = billing_plan.id;

          expect(res.code).to.equal(201);
          expect(billing_plan.id).to.contain('P-');

          expect(billing_plan).to.have.property('state');
          expect(billing_plan.state).to.equal('CREATED');
          expect(billing_plan).to.have.property('description');
          expect(billing_plan).to.have.property('payment_definitions');
          expect(billing_plan.payment_definitions).to.be.an.instanceof(Array);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('should return "VALIDATION_ERROR" if type parameter absent', (done) => {
      meta.request.REQUEST_METHOD = 'POST';
      const argsValidation = { ...create_billing_plan_details, type: null };
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

  describe('PATCH', () => {
    it('should update billing plan successfully with valid parameters', (done) => {
      meta.request.REQUEST_METHOD = 'PATCH';
      run('billing-plans',
        { args: { update_billing_plan_details, billing_plan_id }, meta })
        .then((res) => {
          expect(res.code).to.equal(200);
          expect(res.data.httpStatusCode).equal(200);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });

  describe('GET', () => {
    it('should get nonexistent billing plan failure if invalid billing plan ID passed', (done) => {
      meta.request.REQUEST_METHOD = 'GET';
      run('billing-plans', { args: { billing_plan_id: 'ABCDEFGH' }, meta })
        .then((res) => {
          expect(res.code).to.equal(400);
          expect(res.data.name).to.equal('TEMPLATE_ID_INVALID');
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('should show details for a billing plan if billing plan ID passed is valid',
      (done) => {
        meta.request.REQUEST_METHOD = 'GET';
        run('billing-plans', { args: { billing_plan_id }, meta })
          .then((res) => {
            expect(res.code).to.equal(200);
            expect(res.data.id).to.equal(billing_plan_id);
            expect(res.data).to.have.property('state');
            expect(res.data).to.have.property('name');
            done();
          })
          .catch((err) => {
            done(err);
          });
      });

    it('should list billing plans created if billing_plan_id not passed as params', (done) => {
      meta.request.REQUEST_METHOD = 'GET';
      run('billing-plans', { args: { page_size: '3' }, meta })
        .then((res) => {
          expect(res.code).to.equal(200);
          expect(res.data).to.have.property('plans');
          expect(res.data.plans).to.be.an.instanceof(Array);
          expect(res.data.plans.length).to.be.at.most(3);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });

  describe('Invalid request method', () => {
    it('should return an error if request method is of type `DELETE`', (done) => {
      meta.request.REQUEST_METHOD = 'DELETE';
      run('billing-plans', { meta })
        .then((res) => {
          const actions = 'creating, retrieving and updating billing plans respectively';
          const expectedMethodTypes = ['POST', 'GET', 'PATCH'].join(', ');
          const errorMessage = `Make sure to use ${expectedMethodTypes} for ${actions}.`;
          expect(res.code).to.equal(400);
          expect(res.data.message).to.equal(errorMessage);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });
});
