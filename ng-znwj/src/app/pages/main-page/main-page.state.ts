import {ImmutableContext, ImmutableSelector} from '@ngxs-labs/immer-adapter';
import {Action, Selector, State, StateContext, Store} from '@ngxs/store';
import {tap} from 'rxjs/operators';
import {Silk} from '../../model/silk';
import {WsReceiveEvent} from '../../model/ws-receive-event';
import {ApiService} from '../../service/api.service';
import {SILK_COMPARE} from '../../service/util.service';

const maxSize = 100;

const checkSize = (silkEntities: { [p: string]: Silk }) => {
  let silks = Object.values(silkEntities);
  if (silks.length > maxSize) {
    silks = silks.sort(SILK_COMPARE).slice(0, maxSize);
    return Silk.toEntities(silks);
  }
  return silkEntities;
};

const PAGE_NAME = 'MainPage';

export class InitAction {
  static readonly type = `[${PAGE_NAME}] InitAction`;
}

export class QueryAction {
  static readonly type = `[${PAGE_NAME}] QueryAction`;
}

export class DeleteAction {
  static readonly type = `[${PAGE_NAME}] DeleteAction`;

  constructor(public payload: Silk) {
  }
}

export class SilkInfoUpdateAction {
  static readonly type = `[${PAGE_NAME}] SilkInfoUpdateAction`;

  constructor(public payload: WsReceiveEvent) {
  }
}

interface StateModel {
  count?: number;
  first?: number;
  pageSize?: number;
  silkEntities: { [id: string]: Silk };
}

@State<StateModel>({
  name: PAGE_NAME,
  defaults: {
    first: 0,
    pageSize: 100,
    silkEntities: {}
  }
})
export class MainPageState {
  constructor(private store: Store,
              private api: ApiService) {
  }

  @Selector()
  @ImmutableSelector()
  static silks(state: StateModel): Silk[] {
    return Object.values(state.silkEntities).sort(SILK_COMPARE);
  }

  @Selector()
  @ImmutableSelector()
  static count(state: StateModel): number {
    return Object.keys(state.silkEntities).length;
  }

  @Selector()
  @ImmutableSelector()
  static pageSize(state: StateModel): number {
    return state.pageSize || 10;
  }

  @Selector()
  @ImmutableSelector()
  static pageIndex(state: StateModel): number {
    return state.first / state.pageSize;
  }

  @Action(InitAction)
  @ImmutableContext()
  InitAction({dispatch}: StateContext<StateModel>) {
    return dispatch(new QueryAction());
  }

  @Action(QueryAction)
  @ImmutableContext()
  QueryAction({setState}: StateContext<StateModel>) {
    return this.api.listSilks().pipe(
      tap(silks => setState((state: StateModel) => {
        state.silkEntities = Silk.toEntities(silks);
        state.silkEntities = checkSize(state.silkEntities);
        return state;
      })),
    );
  }

  @Action(SilkInfoUpdateAction)
  @ImmutableContext()
  SilkInfoUpdateAction({setState}: StateContext<StateModel>, {payload: {data}}: SilkInfoUpdateAction) {
    setState((state: StateModel) => {
      const silk = Silk.assign(data);
      state.silkEntities[silk.id] = silk;
      state.silkEntities = checkSize(state.silkEntities);
      return state;
    });
  }
}
