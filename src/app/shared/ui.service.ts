import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable()
export class UiService {

    constructor(private snackBar: MatSnackBar) {}

    showSnackbar(message: string, duration: number, action: string | undefined = undefined) {
        this.snackBar.open(message, action, {
            duration: duration
        });
    }
}