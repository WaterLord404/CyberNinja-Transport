import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {

  constructor() { }

  /**
   * Intercepta la petición, le añade el jwt
   * @param req
   * @param next
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let token: string = localStorage.getItem('token');
    let request = req;

    if (req.headers.get("skip")) { return next.handle(request); }
    if (token == null) { token = ''; }

    request = req.clone({
      url: environment.domain + req.url,
      setHeaders: {
        authorization: token
      }
    });

    return next.handle(request);
  }
}
