import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserI } from 'src/app/interfaces/userI';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  private isLogged = new BehaviorSubject<boolean>(this.hasToken());
  user: UserI;

  /**
   * if we have token the user is loggedIn
   * @returns: boolean
   */
  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  /**
   * Get login status
   * @returns boolean
   */
  isLoggedIn(): boolean {
    let status = false;
    this.isLogged.asObservable().subscribe(res => status = res);
    return status;
  }

  /**
   * Login the user then tell all the subscribers about the new status
   */
  login(jwt: string): void {
    localStorage.setItem('token', jwt);
    this.isLogged.next(true);
  }

  /**
   * Log out the user then tell all the subscribers about the new status
   */
  logout(): void {
    localStorage.removeItem('token');
    this.isLogged.next(false);
  }

  /**
   * Get rol of user
   * @returns boolean
   */
  isShipper(): boolean {
    let isShipper = false;

    const jwt: string = localStorage.getItem('token');
    if (jwt == undefined) { return isShipper; }

    const jwtData = jwt.split('.')[1];
    const decodedJwtJsonData = window.atob(jwtData);
    const decodedJwtData = JSON.parse(decodedJwtJsonData);
    const role = decodedJwtData.role;

    role.forEach(element => {
      if (element === 'SHIPPER') {
        isShipper = true;
      }
    });

    return isShipper;
  }
}
