import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {

  constructor(private snackBar: MatSnackBar) { }

  /**
   * Crea un SnakBar con un mensaje
   * @param msg
   */
  popup(option: number): void {
    const msg = this.getError(option);
    this.snackBar.open(msg, '', {
      duration: 3500,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }

  private getError(option: number): string {
    let error = '';
    switch (option) {
      case 203:
        error = 'Successfully removed';
        break;
      case 201:
        error = 'Successfully created';
        break;
      case 205:
        error = 'Successfully updated';
        break;
      case 210:
        error = 'Successfully login';
        break;
      case 211:
        error = 'Successfully logout';
        break;
      case 212:
        error = 'Successfully registration';
        break;
      case 213:
        error = 'Check your email to confirm your account';
        break;
      case 220:
        error = 'Successfully purchase';
        break;
      case 300:
        error = 'The form contains errors';
        break;
      case 301:
        error = 'The username and password you entered did not match our records';
        break;
      case 302:
        error = 'Username not available';
        break;
      case 403:
        error = 'Access denied';
        break;
      case 500:
        error = 'something went wrong';
        break;
      case 800:
        error = 'One product in your cart now does not exist';
        break;
      case 801:
        error = 'Invalid coupon';
        break;
      case 802:
        error = 'Please select product details';
        break;
      default:
        error = 'Unknown error';
        break;
    }
    return error;
  }
}
