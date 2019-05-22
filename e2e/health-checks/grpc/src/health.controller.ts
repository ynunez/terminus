import { GrpcMethod } from '@nestjs/microservices';
import { Controller, Inject } from '@nestjs/common';
import { HealthCheckResposne, ServingStatus } from './interfaces';
import { SERVING_STATUS_RESPONSE } from './serving-status-response.token';

@Controller()
export class HealthController {
  constructor(@Inject(SERVING_STATUS_RESPONSE) private status: ServingStatus) {}
  @GrpcMethod('Health', 'Check')
  check(): HealthCheckResposne {
    return { status: this.status };
  }
}
