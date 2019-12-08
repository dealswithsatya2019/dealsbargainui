import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  public snackBarConfig: MatSnackBarConfig;
  constructor(private _snackBar: MatSnackBar) { 
    this.snackBarConfig = new MatSnackBarConfig();
    this.snackBarConfig.horizontalPosition = "center";
    this.snackBarConfig.verticalPosition = "top";
    this.snackBarConfig.duration = 2000;
  }

  raiseAlert(message: string) {
    this._snackBar.open(message, "", this.snackBarConfig);
  }
}
