import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EventModel } from 'src/app/_shared/models/events.model';
import { AbstractComponent } from '../../../_core/components/abstract/abstract.component';
import { CommonService } from 'src/app/_core/services/common.service';
import { EventService } from '../../../_core/services/event.service';
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';

const moment = _rollupMoment || _moment;

@Component({
  selector: 'app-event-create',
  templateUrl: './event-create.component.html',
  styleUrls: ['./event-create.component.css']
})
export class EventCreateComponent extends AbstractComponent implements OnInit {

  newPost: string = '';
  createEventForm: FormGroup;
  private mode: string = 'create';
  private eventId: string;
  singleEvent: EventModel;
  isLoading: boolean = false;
  formTitle: string = 'Create an Event';

  constructor(
    public _commonService: CommonService,
    private eventService: EventService,
    public route: ActivatedRoute
  ) {
    super();
  }

  ngOnInit(): void {

    this.createEventForm = new FormGroup({
      eventName: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      eventDate: new FormControl(
        moment([new Date().getFullYear(), new Date().getMonth(), new Date().getDate()]).startOf('day'),
        {
          validators: [Validators.required]
        }
      ),
      eventAddress: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(10)]
      })
    });
    this.eventId = this.route.snapshot.params['eventId'];
    if (this.eventId) {
      this.isLoading = true;
      this.eventService.getSingleEvent(this.eventId)
      .subscribe(singleEventData => {
        console.log(singleEventData)
        if (singleEventData != null) {
          this.isLoading = false;
          this.mode = 'edit';
          this.formTitle = 'Edit an Event';
          this.singleEvent = {
            id: singleEventData._id,
            eventName: singleEventData.eventName,
            eventDate: singleEventData.eventDate,
            eventAddress: singleEventData.eventAddress,
            eventCreator: singleEventData.eventCreator
          };
          console.log(this.singleEvent);
          this.createEventForm.patchValue({
            eventName: this.singleEvent.eventName,
            eventDate: this.singleEvent.eventDate,
            eventAddress: this.singleEvent.eventAddress
          });
        } else {
          this.isLoading = false;
          this.mode = 'create';
        }
      });
    }

  }

  onCreateEvent() {
    if (this.createEventForm.invalid)
      return;
    if (this.mode === 'create') {
      this.isLoading = true;
      console.log(this.createEventForm.controls['eventDate'].value)
      this.eventService.createEvent(
        this.createEventForm.controls['eventName'].value,
        this.createEventForm.controls['eventDate'].value,
        this.createEventForm.controls['eventAddress'].value
      );
    } else {
      console.log(this.eventId)
      this.eventService.updateEvent(
        this.eventId,
        this.createEventForm.controls['eventName'].value,
        this.createEventForm.controls['eventDate'].value,
        this.createEventForm.controls['eventAddress'].value
      );
    }
    this.createEventForm.reset();
  }

}
