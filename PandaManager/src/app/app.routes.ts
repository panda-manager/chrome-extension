import { Routes } from '@angular/router'
import { GeneratePasswordContainerComponent } from '../components/generate-password-container/generate-password-container.component'
import { VaultContainerComponent } from '../components/vault-container/vault-container.component'
import { LoginContainerComponent } from '../components/login-container/login-container.component'
import { RegisterContainerComponent } from '../components/register-container/register-container.component'
import { AuthGuard } from '../guards/auth-gard'
import { HomeComponent } from '../components/home/home.component'

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full',
  },
  {
    path: 'login',
    pathMatch: 'full',
    component: LoginContainerComponent,
  },
  {
    path: 'register',
    pathMatch: 'full',
    component: RegisterContainerComponent,
  },
  {
    path: 'generate',
    component: GeneratePasswordContainerComponent,
    pathMatch: 'full',
  },
  {
    path: 'vault',
    canActivate: [AuthGuard],
    component: VaultContainerComponent,
    pathMatch: 'full',
  },
]
