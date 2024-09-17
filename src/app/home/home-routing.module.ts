import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'children',
      },
      {
        path: 'children',
        loadChildren: () => import('./pages/children/children.module').then((m) => m.ChildrenModule),
      },
      {
        path: 'people',
        loadChildren: () => import('./pages/people/people.module').then((m) => m.PeopleModule),
      },
      {
        path: 'resources',
        loadChildren: () => import('./pages/resources/resources.module').then((m) => m.ResourcesModule),
      },
      {
        path: 'settings',
        loadChildren: () => import('./pages/settings/settings.module').then((m) => m.SettingsModule),
      },
    ]
  } 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule { }
