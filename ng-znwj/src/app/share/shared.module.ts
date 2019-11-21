import {ObserversModule} from '@angular/cdk/observers';
import {PlatformModule} from '@angular/cdk/platform';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {GalleryModule} from '@ngx-gallery/core';
import {GallerizeModule} from '@ngx-gallery/gallerize';
import {LightboxModule} from '@ngx-gallery/lightbox';
import {TranslateModule} from '@ngx-translate/core';
import {NgxsDispatchPluginModule} from '@ngxs-labs/dispatch-decorator';
import {NgxsEmitPluginModule} from '@ngxs-labs/emitter';
import {NgxsRouterPluginModule} from '@ngxs/router-plugin';
import {OwlDateTimeModule, OwlNativeDateTimeModule} from 'ng-pick-datetime';
import {NgScrollbarModule} from 'ngx-scrollbar';
import {MaterialModule} from '../material.module';
import {NavComponent} from './nav/nav.component';

@NgModule({
  declarations: [
    NavComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ObserversModule,
    PlatformModule,
    FormsModule,
    ReactiveFormsModule,

    GalleryModule,
    LightboxModule,
    GallerizeModule,

    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    // OwlMomentDateTimeModule,

    TranslateModule,
    MaterialModule,
    FlexLayoutModule,
    NgScrollbarModule,

    NgxsRouterPluginModule,
    NgxsDispatchPluginModule,
    NgxsEmitPluginModule,
  ],
  exports: [
    CommonModule,
    RouterModule,
    PlatformModule,
    ObserversModule,
    FormsModule,
    ReactiveFormsModule,

    GalleryModule,
    LightboxModule,
    GallerizeModule,

    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    // OwlMomentDateTimeModule,

    TranslateModule,
    MaterialModule,
    FlexLayoutModule,
    NgScrollbarModule,

    NgxsRouterPluginModule,
    NgxsDispatchPluginModule,
    NgxsEmitPluginModule,
    NavComponent,
  ],
})
export class SharedModule {
}
