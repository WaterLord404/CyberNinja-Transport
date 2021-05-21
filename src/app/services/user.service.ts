import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserI } from '../interfaces/userI';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  url = 'user/login';

  constructor(
    private http: HttpClient
  ) { }

  /**
   * Loguea a un usuario (devuelve un jwt en el header)
   * @param user
   */
  login(user: UserI): Observable<any> {
    return this.http.post(this.url, user, {observe: 'response' });
  }
}
