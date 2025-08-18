declare module '@paypal/checkout-server-sdk' {
  export namespace core {
    export class PayPalHttpClient {
      constructor(environment: Environment);
      execute<T>(request: T): Promise<PayPalResponse<T>>;
    }

    export abstract class Environment {
      constructor(clientId: string, clientSecret: string);
    }

    export class SandboxEnvironment extends Environment {
      constructor(clientId: string, clientSecret: string);
    }

    export class LiveEnvironment extends Environment {
      constructor(clientId: string, clientSecret: string);
    }
  }

  export namespace orders {
    export class OrdersCreateRequest {
      headers: { [key: string]: string };
      requestBody(body: any): void;
    }

    export class OrdersCaptureRequest {
      constructor(orderId: string);
      headers: { [key: string]: string };
    }
  }

  export interface PayPalResponse<T> {
    statusCode: number;
    result: any;
  }
}
