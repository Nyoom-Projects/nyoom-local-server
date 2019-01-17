import request from 'supertest';
import app from '../../app';


describe('/ping', () => {
    describe('GET /ping', () => {
        it('respond with JSON containing status of "ok"', (done) => {
            request(app)
                .get('/ping')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200, {
                    status: 'ok',
                }, done);
        });
    });
});
