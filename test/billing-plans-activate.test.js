import { expect } from 'chai';
import { describe, it } from 'mocha';
import { run, generateMeta } from '@syncano/test';
import 'dotenv/config';

describe('billing-plans-activate', () => {
  const meta = generateMeta('billing-plans-activate');

  it('should ensure billing_plan_id is passed as parameter', (done) => {
    run('billing-plans-activate', { args: { }, meta })
      .then((res) => {
        expect(res.code).to.equal(400);
        expect(res.data.message).to.equal('Validation error(s)');
        done();
      })
      .catch((err) => {
        done(err);
      });
  });


  it('should return "BUSINESS_VALIDATION_ERROR" if invalid billing plan ID passed', (done) => {
    run('billing-plans-activate', { args: { billing_plan_id: 'ABCDEFGH' }, meta })
      .then((res) => {
        expect(res.code).to.equal(400);
        expect(res.data.name).to.equal('BUSINESS_VALIDATION_ERROR');
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should activate a billing plan if valid billing plan ID passed', (done) => {
    run('billing-plans-activate',
      { args: { billing_plan_id: process.env.TEST_BILLING_PLAN_ID }, meta })
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
