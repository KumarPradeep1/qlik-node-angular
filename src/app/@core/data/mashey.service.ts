import { Injectable } from '@angular/core'; 
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable()
export class MasheyService {  
  constructor(private spinner: NgxSpinnerService) { 
  }  
  loadSpinner_show(){
    this.spinner.show();
  }
  loadSpinner_hide(){
    this.spinner.hide();
  }
}
