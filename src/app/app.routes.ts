import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'signUp',
    loadComponent: () => import('./sign-up/sign-up.component')
  },
  {
    path: '**',
    redirectTo: 'signUp'
  }
];
