import { expect } from 'chai';
import { describe, it } from 'mocha';
import { run, generateMeta } from '@syncano/test';
import url from 'url';
import 'dotenv/config';

import { create_billing_agreement_details, update_billing_plan_details } from './utils/helpers';

describe('billing-agreements', () => {
  const meta = generateMeta('billing_agreements');

  describe('POST', () => {
    it('should create billing agreement successfully with valid parameters', (done) => {
      meta.request.REQUEST_METHOD = 'POST';
      create_billing_agreement_details.plan.id = process.env.TEST_BILLING_PLAN_ID;
      run('billing-agreements',
        { args: { create_billing_agreement_details }, meta })
        .then((res) => {
          const billingAgreement = res.data;
          const approval_url = billingAgreement.links.find(obj => obj.rel === 'approval_url').href;
          process.env.TEST_PAYMENT_TOKEN = url.parse(approval_url, true).query.token;

          expect(res.code).to.equal(201);
          expect(billingAgreement.name).to.equal(create_billing_agreement_details.name);
          expect(billingAgreement.plan.id).to.equal(create_billing_agreement_details.plan.id);
          expect(billingAgreement).to.have.property('plan');
          expect(billingAgreement).to.have.property('start_date');
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('should return "Validation error(s)" if create_billing_agreement_details parameter absent',
      (done) => {
        meta.request.REQUEST_METHOD = 'POST';
        run('billing-agreements', { args: { }, meta })
          .then((res) => {
            expect(res.code).to.equal(400);
            expect(res.data.message).to.equal('Validation error(s)');
            expect(res.data).to.have.property('details');
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
      run('billing-agreements', { meta })
        .then((res) => {
          const actions = 'creating, retrieving and updating billing agreements respectively';
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
