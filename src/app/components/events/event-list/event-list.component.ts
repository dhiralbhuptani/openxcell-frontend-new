import { Component, OnInit, ViewChild, AfterViewInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/_core/services/auth.service';
import { EventService } from 'src/app/_core/services/event.service';
import { EventModel } from 'src/app/_shared/models/events.model';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit, AfterViewInit, OnDestroy {

  displayedColumns: string[] = ['eventName', 'eventDate', 'eventAddress', 'actions'];
  dataSource = new MatTableDataSource([]);
  eventsData: any[] = [];
  private eventsSubscribe: Subscription;
  public totalEvents: number = 0;
  public eventsPerPage: number = 30;
  private currentPage: number = 1;
  public pageSizeOptions: any[] = [1, 5, 10, 30];
  private authListenerSubs: Subscription;
  public isUserAuthenticated: boolean = false;
  public userId: string;
  isLoading: boolean = false;
  @Output() public searchEvent = new EventEmitter();
  searchControl = new FormControl();
  public searchOptions: any[] = [];
  eventsTitle: string[] = [];
  @ViewChild(MatSort) sort: MatSort;
  public pageTitle: string = 'Events';

  constructor(
    private eventService: EventService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.eventService.getEvents(this.eventsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.eventsSubscribe = this.eventService.getEventsUpdated()
    .subscribe((eventNewData: { events: EventModel[], eventsCount: number }) => {
      this.isLoading = false;
      this.totalEvents = eventNewData.eventsCount;
      this.eventsData = eventNewData.events;
    });
    this.isUserAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
    .getAuthStatusListener()
    .subscribe(isAuthenticated => {
      this.isUserAuthenticated = isAuthenticated;
      this.userId = this.authService.getUserId();
    });
  }

  ngOnDestroy(): void {
    this.eventsSubscribe.unsubscribe();
    this.authListenerSubs.unsubscribe();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  onPageChange(pageData: PageEvent) {
    this.eventsPerPage = pageData.pageSize;
    this.currentPage = pageData.pageIndex + 1;
    this.eventService.getEvents(this.eventsPerPage, this.currentPage);
  }

  onDeletePost(eventId: string) {
    this.eventService.deleteEvent(eventId).subscribe(() => {
      this.eventService.getEvents(this.eventsPerPage, this.currentPage);
    });
  }

}
