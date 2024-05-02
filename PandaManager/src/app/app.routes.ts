import { Routes } from '@angular/router'
import { GeneratePasswordContainerComponent } from '../components/generate-password-container/generate-password-container.component'
import { MenuComponent } from '../components/menu/menu.component'
import { VaultContainerComponent } from '../components/vault-container/vault-container.component'

export const routes: Routes = [
  {
    path: '',
    component: MenuComponent,
    pathMatch: 'full',
  },
  {
    path: 'generate',
    component: GeneratePasswordContainerComponent,
    pathMatch: 'full',
  },
  {
    path: 'vault',
    component: VaultContainerComponent,
    pathMatch: 'full',
  },
]
