import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('VisitPlans HTTP API (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  const sample = {
    name: 'Jalan-jalan Banyumas',
    destinationId: 'baturraden',
    destinationName: 'Lokawisata Baturraden',
    visitDate: '2027-01-20',
    participantCount: 2,
    isCompleted: false,
  };

  it('GET, POST, GET/:id, PATCH, DELETE dan 404', async () => {
    await request(app.getHttpServer()).get('/visit-plans').expect(200, []);

    const created = await request(app.getHttpServer())
      .post('/visit-plans').send(sample).expect(201);
    const id: string = created.body.id;
    expect(id).toBeTruthy();

    await request(app.getHttpServer()).get(`/visit-plans/${id}`).expect(200);
    await request(app.getHttpServer())
      .patch(`/visit-plans/${id}`).send({ participantCount: 4 }).expect(200)
      .expect((res) => expect(res.body.participantCount).toBe(4));
    await request(app.getHttpServer()).post('/visit-plans').send(sample).expect(409);
    await request(app.getHttpServer())
      .post('/visit-plans').send({ ...sample, participantCount: 0 }).expect(400);
    await request(app.getHttpServer()).delete(`/visit-plans/${id}`).expect(200);
    await request(app.getHttpServer()).get(`/visit-plans/${id}`).expect(404);
  });
});
