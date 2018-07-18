/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, OnInit } from '@angular/core'; 
@Component({
  selector: 'ngx-app',
  template: '<ngx-spinner  bdColor = "rgba(51, 51, 51, 0.8)"  size = "large"  color = "#fff"  type = "pacman"  ></ngx-spinner><router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {

  constructor( ) {
  }

  ngOnInit(): void {
     
  }
}
