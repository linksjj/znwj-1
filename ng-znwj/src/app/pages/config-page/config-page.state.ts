import {ImmutableContext, ImmutableSelector} from '@ngxs-labs/immer-adapter';
import {Action, Selector, State, StateContext, Store} from '@ngxs/store';
import {Apollo} from 'apollo-angular';
import {Silk} from '../../model/silk';
import {DEFAULT_COMPARE} from '../../service/util.service';

const PAGE_NAME = 'ConfigPage';

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

interface StateModel {
  count?: number;
  first?: number;
  pageSize?: number;
  silkEntities: { [id: string]: Silk };
}

@State<StateModel>({
  name: PAGE_NAME,
  defaults: {
    silkEntities: {}
  }
})
export class ConfigPageState {
  constructor(private store: Store,
              private apollo: Apollo) {
  }

  @Selector()
  @ImmutableSelector()
  static silks(state: StateModel): Silk[] {
    return Object.values(state.silkEntities).sort((a, b) => {
      // const defaultMansion = this.defaultMansion(state);
      // const defaultMansionId = defaultMansion && defaultMansion.id;
      // if (a.id === defaultMansionId) {
      //   return -1;
      // }
      return DEFAULT_COMPARE(a, b);
    });
  }

  @Selector()
  @ImmutableSelector()
  static count(state: StateModel): number {
    return state.count;
  }

  @Selector()
  @ImmutableSelector()
  static pageIndex(state: StateModel): number {
    return state.first / state.pageSize;
  }

  @Selector()
  @ImmutableSelector()
  static pageSize(state: StateModel): number {
    return state.pageSize;
  }

  @Action(InitAction)
  @ImmutableContext()
  InitAction({dispatch}: StateContext<StateModel>) {
    return dispatch(new QueryAction());
  }

  @Action(QueryAction)
  @ImmutableContext()
  QueryAction({setState}: StateContext<StateModel>) {
  }

}
