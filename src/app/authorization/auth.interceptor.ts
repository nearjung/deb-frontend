import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import Swal from 'sweetalert2'

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  public userInfo: any = JSON.parse(localStorage.getItem("userInfo"));
  public publisherInfo: any = JSON.parse(localStorage.getItem("publisherInfo"));
  constructor(private router: Router, private authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    req = req.clone({
      setHeaders: {
        // 'Content-Type': 'application/x-www-form-urlencoded',
        // 'Accept': 'application/json',
        'Authorization': (this.userInfo?.token) ? this.userInfo?.token : `Bearer ${(this.authService.getJwtToken()) ? this.authService.getJwtToken() : 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.IjIwMjItMDMtMDYi.Jid9NnLrsDIlv7acYhCQtoZzsnEcUfD24mIMKFW1WFI'}`,
      },
    });

    return next.handle(req);
  }
}