import { expect } from 'chai';
import { run, generateMeta } from 'syncano-test';
import 'dotenv/config';

import { create_billing_agreement_details, update_billing_plan_details } from './utils/helpers';

describe('billing-agreements', () => {
  const meta = generateMeta('billing_agreements');
  // let billing_agreement_id = '';

  describe('POST', () => {
    it('should create billing agreement successfully with valid parameters', (done) => {
      meta.request.REQUEST_METHOD = 'POST';
      create_billing_agreement_details.plan.id = process.env.TEST_BILLING_PLAN_ID;
      run('billing_agreements',
        { args: { create_billing_agreement_details }, meta })
        .then((res) => {
          const billing_agreement = res.data;
          // billing_agreement_id = billing_agreement.id;
          // process.env.TEST_BILLING_AGREEMENT_ID = billing_agreement.id;

          const executeLinkUrlSplits = links[1].href.split('/');
          process.env.TEST_PAYMENT_TOKEN = executeLinkUrlSplits[executeLinkUrlSplits.length - 2];

          expect(res.code).to.equal(201);
          expect(billing_agreement.name).to.equal(create_billing_agreement_details.name);
          expect(billing_agreement.plan.id).to.equal(create_billing_agreement_details.plan.id);
          expect(billing_agreement).to.have.property('plan');
          expect(billing_agreement).to.have.property('start_date');
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('should return "Validation error(s)" if create_billing_agreement_details parameter absent',
      (done) => {
        meta.request.REQUEST_METHOD = 'POST';
        run('billing_agreements', { args: { }, meta })
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
      run('billing_agreements', { meta })
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
