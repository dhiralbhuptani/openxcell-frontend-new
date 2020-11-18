import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { API_ENDPOINT_EVENT } from '../constants/api-endpoint.constant';
import { EventModel } from '../../_shared/models/events.model';
import { Subject } from 'rxjs';
import{ map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private events: EventModel[] = [];
  private eventsUpdated = new Subject<{events: EventModel[], eventsCount: number}>();
  singleEvent: EventModel;
  searchedEvents: any;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  getEvents(eventsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${eventsPerPage}&page=${currentPage}`;
    this.http
    .get<{
      message: string,
      events: any,
      getAllEventsCount: number
    }>(API_ENDPOINT_EVENT + queryParams)
    .pipe(
      map((getEventData) => {
        return {
          events: getEventData.events.map(event => {
            return {
              id: event._id,
              eventName: event.eventName,
              eventDate: event.eventDate,
              eventAddress: event.eventAddress,
              eventCreator: event.eventCreator
            }
          }),
          allEvents: getEventData.getAllEventsCount
        };
      })
    )
    .subscribe((newEventData) => {
      console.log(newEventData)
      this.events = newEventData.events;
      this.eventsUpdated.next({
        events: [...this.events],
        eventsCount: newEventData.allEvents
      });
    });
  }

  getEventsUpdated() {
    return this.eventsUpdated.asObservable();
  }

  getSingleEvent(eventId: string) {
    return this.http.get<{
      _id: string,
      eventName: string,
      eventDate: Date,
      eventAddress: string,
      eventCreator: string
    }>(
      API_ENDPOINT_EVENT + eventId
    );
  }

  getSearchedEvents(query) {
    return this.http.get<any>(
      API_ENDPOINT_EVENT + 'search/' + query
    );
  }

  createEvent(eventName: string, eventDate: Date, eventAddress: string) {
    const eventData = {
      eventName,
      eventDate,
      eventAddress
    };
    // console.log(eventData)
    this.http
    .post<{message: string, eventCreated: EventModel}>(
      API_ENDPOINT_EVENT,
      eventData
    )
    .subscribe((response) => {
      this.router.navigate(['/events/list']);
    });
  }

  deleteEvent(eventId: string) {
    return this.http.delete(API_ENDPOINT_EVENT + eventId);
  }

  updateEvent(eventId: string, eventName: string, eventDate: Date, eventAddress: string) {
    const eventData = {
      id: eventId,
      eventName: eventName,
      eventDate: eventDate,
      eventAddress: eventAddress,
      eventCreator: null
    };
    console.log(eventData)
    this.http.put(API_ENDPOINT_EVENT + eventId, eventData)
    .subscribe(response => {
      this.router.navigate(['/events/list']);
    });
  }

}
