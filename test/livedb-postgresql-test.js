'use strict';

const LivePg = require('..');
const async  = require('async');
const pg     = require('pg');
const sinon  = require('sinon');

describe('LivePg', () => {
  let livePg;

  beforeEach(() => {
    livePg = new LivePg(process.env.PG_URL, 'documents');
  });

  describe('#close', () => {
    beforeEach(() => {
      LivePg.willClose = undefined;
      sinon.spy(pg, 'end');
    });

    afterEach(() => {
      pg.end.restore();
    });

    it('calls end on pg', done => {
      livePg.close(() => {
        pg.end.callCount.should.eql(1);
        done();
      });
    });

    it('does not call end on pg twice', done => {
      async.series([
        cb => livePg.close(cb),
        cb => livePg.close(cb) 
      ], err => {
        if (err) throw err;
        pg.end.callCount.should.eql(1);
        done();
      });
    });

    it('does not call end on pg if it has already been called', done => {
      pg.end();

      livePg.close(() => {
        pg.end.callCount.should.eql(1);
        done();
      });
    });
  });
});
