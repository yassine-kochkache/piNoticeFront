import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import Containers
import { DefaultLayoutComponent } from './containers';
import { AuthGuard } from './services/auth.guard';
import { ConnectedGuard } from './services/connected.guard';

import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginComponent } from './views/login/login.component';
import { ProfileComponent } from './views/profile/profile.component';
import { RegisterComponent } from './views/register/register.component';
import { ResetPasswordComponent } from './views/reset-password/reset-password.component';
import { UpdatePasswordComponent } from './views/update-password/update-password.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: '404',
    component: P404Component,
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    component: P500Component,
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    canActivate: [ConnectedGuard],
    component: LoginComponent,
    data: {
      title: 'Login Page'
    }
  },
  {
    path: "reset-password/:token",
    component: ResetPasswordComponent,
    canActivate: [ConnectedGuard],
    data: {
      title: 'reset passoword page'
    }
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [ConnectedGuard],
    data: {
      title: 'Register Page'
    }
  },
  {
    path: 'home',
    component: DefaultLayoutComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Home'
    },
    
  },
  {
    path:'profile/:id',
    component:ProfileComponent,
    canActivate: [AuthGuard],
    data:{
      title:'profile'
    }
  },
  {
    path:'updatePassword',
    component:UpdatePasswordComponent,
    canActivate: [AuthGuard],
    data:{
      title:'update password'
    }
  },
  { path: '**', component: P404Component }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
