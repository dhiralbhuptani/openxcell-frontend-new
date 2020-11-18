import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AngMaterialModule } from '../../_shared/module/ang-material/ang-material.module';
// Import Components
import { EventListComponent } from './event-list/event-list.component';
import { EventCreateComponent } from './event-create/event-create.component';
import { MyEventsComponent } from './my-events/my-events.component';


@NgModule({
  declarations: [
    EventListComponent,
    EventCreateComponent,
    MyEventsComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    AngMaterialModule
  ]
})
export class EventsModule { }
