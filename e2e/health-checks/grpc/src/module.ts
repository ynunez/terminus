import { DynamicModule } from '@nestjs/common';
import { HealthController } from './health.controller';
import {
  GRPCHealthIndicator,
  TerminusModuleOptions,
  TerminusModule,
} from '../../../../lib';

const getTerminusOptions = (
  grpc: GRPCHealthIndicator,
): TerminusModuleOptions => ({
  endpoints: [
    {
      url: '/health',
      healthIndicators: [async () => grpc.checkService('grpc', 'service01')],
    },
  ],
});

export class ClientModule {
  static forSettings(settings: any): DynamicModule {
    return {
      module: ClientModule,
      providers: settings.providers,
      imports: [
        TerminusModule.forRootAsync({
          inject: [GRPCHealthIndicator],
          useFactory: getTerminusOptions,
        }),
      ],
    };
  }
}

export class ServerModule {
  static forSettings(settings: any): DynamicModule {
    return {
      module: ClientModule,
      controllers: [HealthController],
      providers: settings.providers,
      imports: [
        TerminusModule.forRootAsync({
          inject: [GRPCHealthIndicator],
          useFactory: getTerminusOptions,
        }),
      ],
    };
  }
}
