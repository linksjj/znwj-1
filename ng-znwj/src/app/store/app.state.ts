import {MatSnackBar} from '@angular/material';
import {TranslateService} from '@ngx-translate/core';
import {ImmutableContext} from '@ngxs-labs/immer-adapter';
import {Action, State, StateContext} from '@ngxs/store';
import {WsReceiveEvent} from '../model/ws-receive-event';
import {ApiService} from '../service/api.service';

const PAGE_NAME = 'App';

export class InitAction {
  static readonly type = `[${PAGE_NAME}] InitAction`;
}

export class WsReceiveEventAction {
  static readonly type = `[${PAGE_NAME}] WsReceiveEventAction`;

  constructor(payload: WsReceiveEvent) {
  }
}

interface StateModel {
  loading?: boolean;
}

@State<StateModel>({
  name: PAGE_NAME,
  defaults: {}
})
export class AppState {
  constructor(private api: ApiService,
              private translate: TranslateService,
              private snackBar: MatSnackBar) {
  }

  static storageIds(): string[] {
    return [`${PAGE_NAME}.token`];
  }

  @Action(InitAction)
  @ImmutableContext()
  InitAction({setState}: StateContext<StateModel>) {
  }

}
