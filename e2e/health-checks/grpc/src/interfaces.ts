export enum ServingStatus {
  UNKNOWN = 0,
  SERVING = 1,
  NOT_SERVING = 2,
}

export interface HealthCheckRequest {
  service: string;
}

export interface HealthCheckResposne {
  status: ServingStatus;
}
