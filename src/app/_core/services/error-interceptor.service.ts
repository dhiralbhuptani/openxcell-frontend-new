import { Injectable } from '@angular/core';
import {
  HttpHandler,
  HttpRequest,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../../components/error-dialog/error-dialog.component';


@Injectable()
export class ErrorInterceptorService implements HttpInterceptor {

  constructor(private dialog: MatDialog) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An unknown error occurred!';
        if (error.error.message) {
          errorMessage = error.error.message;
        }
        this.dialog.open(ErrorDialogComponent, {
          data: {message: errorMessage},
          width: '400px',
          hasBackdrop: true
        });
        return throwError(error);
      })
    );
  }
}
