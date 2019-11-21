import {ChangeDetectionStrategy, Component, NgModule, OnDestroy, OnInit} from '@angular/core';
import {RouterModule} from '@angular/router';
import {NgxsModule, Select, Store} from '@ngxs/store';
import {Observable, Subject} from 'rxjs';
import {Silk} from '../../model/silk';
import {SharedModule} from '../../share/shared.module';
import {ConfigPageState, InitAction} from './config-page.state';

@Component({
  // tslint:disable-next-line:no-host-metadata-property
  host: {
    class: 'page'
  },
  templateUrl: './config-page.component.html',
  styleUrls: ['./config-page.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfigPageComponent implements OnInit, OnDestroy {
  @Select(ConfigPageState.silks)
  readonly silks$: Observable<Silk[]>;
  private readonly destroy$ = new Subject();

  constructor(private store: Store) {
    this.store.dispatch(new InitAction());
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

@NgModule({
  declarations: [
    ConfigPageComponent,
  ],
  imports: [
    NgxsModule.forFeature([ConfigPageState]),
    SharedModule,
    RouterModule.forChild([
      {path: '', component: ConfigPageComponent},
    ]),
  ],
})
export class Module {
}
