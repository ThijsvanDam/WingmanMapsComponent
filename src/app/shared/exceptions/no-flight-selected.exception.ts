import { ErrorHandler } from '@angular/core';


export class NoFlightSelectedException extends ErrorHandler{

    public handleError(error){
        console.error(error);
    }
}
