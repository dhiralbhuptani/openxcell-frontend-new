import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_ENDPOINT_USER } from '../constants/api-endpoint.constant';
import { AuthData, newUser } from '../../_shared/models/auth.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isAuthenticated: boolean = false;
  private token: string;
  private authStatusListener = new Subject<boolean>();
  private tokenTimer: any;
  private userId: string;
  private user: string;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getUserId() {
    return this.userId;
  }

  getUserName() {
    return this.user;
  }

  createUser(userName: string, email: string, password: string) {
    const authData: newUser = {
      userName: userName,
      email: email,
      password: password
    };
    this.http
    .post(API_ENDPOINT_USER + 'register', authData)
    .subscribe(response => {
      this.router.navigate(['/auth/login']);
    }, error => {
      this.authStatusListener.next(false);
    });
  }

  userLogin(email: string, password: string) {
    const authData: AuthData = {
      email: email,
      password: password
    };
    this.http
    .post<{
      token: string,
      expiresIn: number,
      userId: string
    }>(API_ENDPOINT_USER + 'login', authData)
    .subscribe(response => {
      const apiToken = response.token;
      this.token = apiToken;
      if (apiToken) {
        const expiresInDuration = response.expiresIn;
        this.tokenTimer = setTimeout(() => {
          this.userLogout();
        }, expiresInDuration * 1000);
        this.setAuthTimer(expiresInDuration);
        this.isAuthenticated = true;
        this.userId = response.userId;
        this.authStatusListener.next(true);
        const now = new Date();
        // console.log('now', now)
        const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
        // console.log(expirationDate)
        this.saveAuthData(apiToken, expirationDate, this.userId);
        this.getSingleUser(this.userId);
        this.router.navigate(['/home']);
      }
    }, error => {
      this.authStatusListener.next(false);
    });
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation)
      return;
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    // console.log('expiresIn', expiresIn)
    if (expiresIn) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.getSingleUser(this.userId);
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  userLogout() {
    this.token = null;
    this.isAuthenticated = false;
    this.userId = null;
    this.clearAuthData();
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.router.navigate(['/auth/logout']);
  }

  setAuthTimer(duration: number) {
    // console.log('Setting Timer ', duration)
    this.tokenTimer = setTimeout(() => {
      this.userLogout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if (!token || !expirationDate)
      return;
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    }
  }

  getSingleUser(loggedUserId: string) {
    return this.http.get<newUser>(
      API_ENDPOINT_USER + loggedUserId
    )
    .subscribe(getUserData => {
      this.user = getUserData.userName;
      // console.log(this.user);
      this.authStatusListener.next(true);
    });
  }

}
