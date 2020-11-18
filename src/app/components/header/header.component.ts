import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/_core/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  public isUserAuthenticated: boolean = false;
  private authListenerSubs: Subscription;
  public user: string;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.isUserAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
    .getAuthStatusListener()
    .subscribe(isAuthenticated => {
      this.isUserAuthenticated = isAuthenticated;
      this.user = this.authService.getUserName();
    });
  }

  ngOnDestroy(): void {
    this.authListenerSubs.unsubscribe();
  }

  logout() {
    this.isUserAuthenticated = this.authService.getIsAuth();
    this.authService.userLogout();
  }

}
