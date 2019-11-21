import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {path: '', loadChildren: () => import('./pages/main-page/main-page.component').then(it => it.Module), pathMatch: 'full'},
  {path: 'config', loadChildren: () => import('./pages/config-page/config-page.component').then(it => it.Module)},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
