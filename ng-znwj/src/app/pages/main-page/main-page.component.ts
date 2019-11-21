import {ChangeDetectionStrategy, Component, NgModule, OnDestroy, OnInit} from '@angular/core';
import {RouterModule} from '@angular/router';
import {NgxsModule, Select, Store} from '@ngxs/store';
import {Observable, Subject} from 'rxjs';
import {Silk} from '../../model/silk';
import {SharedModule} from '../../share/shared.module';
import {InitAction, MainPageState} from './main-page.state';
import {SilkComponent} from './silk/silk.component';

@Component({
  // tslint:disable-next-line:no-host-metadata-property
  host: {
    class: 'page'
  },
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainPageComponent implements OnInit, OnDestroy {
  @Select(MainPageState.silks)
  readonly silks$: Observable<Silk[]>;
  @Select(MainPageState.count)
  readonly count$: Observable<number>;
  @Select(MainPageState.pageSize)
  readonly pageSize$: Observable<number>;
  @Select(MainPageState.pageIndex)
  readonly pageIndex$: Observable<number>;
  private readonly destroy$ = new Subject();

  constructor(private store: Store) {
    this.store.dispatch(new InitAction());
    // this.silks$ = this.store.select(MainPageState.silks).pipe(
    //   debounceTime(5000),
    // );
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
    MainPageComponent,
    SilkComponent,
  ],
  imports: [
    NgxsModule.forFeature([MainPageState]),
    SharedModule,
    RouterModule.forChild([
      {path: '', component: MainPageComponent},
    ]),
  ],
})
export class Module {
}
