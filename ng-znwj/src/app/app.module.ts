import {FullscreenOverlayContainer, OverlayContainer} from '@angular/cdk/overlay';
import {registerLocaleData} from '@angular/common';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import localeZhHans from '@angular/common/locales/zh-Hans';
import {LOCALE_ID, NgModule} from '@angular/core';
import {DateAdapter, MAT_AUTOCOMPLETE_DEFAULT_OPTIONS, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatPaginatorIntl} from '@angular/material';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {GALLERY_CONFIG} from '@ngx-gallery/core';
import {LIGHTBOX_CONFIG} from '@ngx-gallery/lightbox';
import {TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {NgxsDispatchPluginModule} from '@ngxs-labs/dispatch-decorator';
import {NgxsEmitPluginModule} from '@ngxs-labs/emitter';
import {NgxsReduxDevtoolsPluginModule} from '@ngxs/devtools-plugin';
import {NgxsLoggerPluginModule} from '@ngxs/logger-plugin';
import {NgxsRouterPluginModule} from '@ngxs/router-plugin';
import {NgxsStoragePluginModule} from '@ngxs/storage-plugin';
import {NgxsModule, NoopNgxsExecutionStrategy} from '@ngxs/store';
import {OWL_DATE_TIME_LOCALE, OwlDateTimeIntl} from 'ng-pick-datetime';
import {environment} from '../environments/environment';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {GraphQLModule} from './graphql.module';
import {MyOwlDateTimeIntl} from './service/my-owl-date-time-intl';
import {MyPaginatorIntl} from './service/my-paginator-intl';
import {SharedModule} from './share/shared.module';
import {AppState} from './store/app.state';

registerLocaleData(localeZhHans, 'zh-Hans');

export function createTranslateLoader(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    NgxsModule.forRoot([AppState], {
      developmentMode: !environment.production,
      executionStrategy: NoopNgxsExecutionStrategy,
    }),
    // It is recommended to register the storage plugin before other plugins so initial state can be picked up by those plugins.
    NgxsStoragePluginModule.forRoot({
      key: [
        ...AppState.storageIds(),
      ],
    }),
    NgxsRouterPluginModule.forRoot(),
    NgxsDispatchPluginModule.forRoot(),
    NgxsEmitPluginModule.forRoot(),
    // You should always include the logger as the last plugin in your configuration.
    NgxsLoggerPluginModule.forRoot({
      disabled: environment.production
    }),
    // You should always include the devtools as the last plugin in your configuration.
    NgxsReduxDevtoolsPluginModule.forRoot({
      disabled: environment.production
    }),
    SharedModule,
    AppRoutingModule,
    GraphQLModule,
  ],
  providers: [
    {provide: LOCALE_ID, useValue: 'zh-Hans'},
    {provide: MAT_DATE_LOCALE, useValue: 'zh-CN'},
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
    {provide: MAT_AUTOCOMPLETE_DEFAULT_OPTIONS, useValue: {autoActiveFirstOption: true}},
    {provide: MatPaginatorIntl, useClass: MyPaginatorIntl, deps: [TranslateService]},
    {provide: OverlayContainer, useClass: FullscreenOverlayContainer},
    {provide: OWL_DATE_TIME_LOCALE, useValue: 'zh-CN'},
    {provide: OwlDateTimeIntl, useClass: MyOwlDateTimeIntl, deps: [TranslateService]},
    {provide: GALLERY_CONFIG, useValue: {loadingMode: 'indeterminate', imageSize: 'cover', thumbPosition: 'top'}},
    {provide: LIGHTBOX_CONFIG, useValue: {panelClass: 'fullscreen'}},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
