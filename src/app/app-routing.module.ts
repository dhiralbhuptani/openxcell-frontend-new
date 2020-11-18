import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// Import Services
import { AuthguardService } from './_core/services/authguard.service';
//** Define Components
import { HomeComponent } from './components/home/home.component';
import { EventListComponent } from './components/events/event-list/event-list.component';
import { EventCreateComponent } from './components/events/event-create/event-create.component';
import { MyEventsComponent } from './components/events/my-events/my-events.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthguardService]
  },
  {
    path: 'events/list',
    component: EventListComponent,
    canActivate: [AuthguardService]
  },
  {
    path: 'events/create',
    component: EventCreateComponent,
    canActivate: [AuthguardService]
  },
  {
    path: 'events/edit/:eventId',
    component: EventCreateComponent,
    canActivate: [AuthguardService]
  },
  {
    path: 'events/my-events',
    component: MyEventsComponent,
    canActivate: [AuthguardService]
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module')
    .then(m => m.AuthModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthguardService]
})
export class AppRoutingModule { }
