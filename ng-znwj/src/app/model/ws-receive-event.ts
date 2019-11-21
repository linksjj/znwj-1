export class WsReceiveEvent {
  type: string;
  data: any;

  static assign(...sources: any[]): WsReceiveEvent {
    const result = Object.assign(new WsReceiveEvent(), ...sources);
    return result;
  }
}
