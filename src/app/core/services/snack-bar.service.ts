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
      case 210:
        error = 'Successfully login';
        break;
      case 211:
        error = 'Successfully added';
        break;
      case 300:
        error = 'The form contains errors';
        break;
      case 301:
        error = 'The username and password you entered did not match our records';
        break;
      case 500:
        error = 'Something went wrong';
        break;
      default:
        error = 'Unknown error';
        break;
    }
    return error;
  }
}
