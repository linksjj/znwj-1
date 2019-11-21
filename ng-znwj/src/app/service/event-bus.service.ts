import {Injectable, OnDestroy} from '@angular/core';
import {Dispatch} from '@ngxs-labs/dispatch-decorator';
import {EB_URL} from '../../environments/environment';
import {WsReceiveEvent} from '../model/ws-receive-event';
import {SilkInfoUpdateAction} from '../pages/main-page/main-page.state';
import {WsReceiveEventAction} from '../store/app.state';

declare const EventBus: any;

@Injectable({
  providedIn: 'root',
})
export class EventBusService implements OnDestroy {
  private readonly eb = new EventBus(EB_URL);

  constructor() {
  }

  start() {
    this.eb.enableReconnect(true);
    this.eb.onopen = () => {
      this.eb.registerHandler('znwj://websocket/global', this.global);
    };
  }

  ngOnDestroy(): void {
    if (this.eb) {
      this.eb.close();
    }
  }

  @Dispatch()
  private global(error, message) {
    const event = WsReceiveEvent.assign(message.body);
    switch (event.type) {
      case 'SilkInfoUpdate': {
        return new SilkInfoUpdateAction(event);
      }
    }
    return new WsReceiveEventAction(event);
  }
}
