import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'escritorio',
    loadChildren: () => import('./pages/escritorio/escritorio.module').then( m => m.EscritorioPageModule)
  },
  {
    path: 'supercontrolador',
    loadComponent: () =>
      import('./pages/supercontrolador/supercontrolador.page')
        .then(m => m.SupercontroladorPage)   // <‑‑ página stand‑alone
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
