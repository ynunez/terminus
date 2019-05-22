import { join } from 'path';
import * as request from 'supertest';

import { Test } from '@nestjs/testing';
import { Transport } from '@nestjs/common/enums/transport.enum';
import { ClientModule, ServerModule } from './src/module';
import { SERVING_STATUS_RESPONSE } from './src/serving-status-response.token';
import { ServingStatus } from './src/interfaces';

describe('GRCP Health', () => {
  it('should return a healthy status code', async () => {
    const clientModule = await Test.createTestingModule({
      imports: [ClientModule.forSettings({})],
    }).compile();

    const clientApp = clientModule.createNestApplication();
    const server = clientApp.getHttpAdapter().getInstance();

    await clientApp.init();

    const serverModule = await Test.createTestingModule({
      imports: [
        ServerModule.forSettings({
          providers: [
            {
              provide: SERVING_STATUS_RESPONSE,
              useValue: ServingStatus.SERVING,
            },
          ],
        }),
      ],
    }).compile();

    const serverApp = serverModule.createNestApplication();
    await serverApp.init();

    serverApp.connectMicroservice({
      transport: Transport.GRPC,
      options: {
        package: 'grpc.health.v1',
        protoPath: join(__dirname, './src/protos/health.proto'),
      },
    });

    await serverApp.startAllMicroservicesAsync();

    return request(server)
      .get('/health')
      .expect({
        status: 'ok',
        info: { grpc: { status: 'up' } },
      });
  });
});
