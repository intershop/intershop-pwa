import { ErrorHandler, Injectable } from '@angular/core';

declare type HandlerType = (error: unknown) => void;

@Injectable()
export class DefaultErrorHandler implements ErrorHandler {
  private handlers: HandlerType[] = [];

  constructor() {
    this.handlers.push(console.error);
  }

  addHandler(handler: HandlerType) {
    this.handlers.push(handler);
  }

  handleError(error: Error) {
    this.handlers.forEach(handler => handler(error));
  }
}
