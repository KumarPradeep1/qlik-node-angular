import { Inject,Injectable } from '@angular/core';  
@Injectable()
export class StorageService {
  public data:any=[]  
  constructor() { 
  }
  saveInLocal(key, val) {
    localStorage.setItem(key, JSON.stringify(val));  
  } 
   getFromLocal(key) { 
    this.data = JSON.parse(localStorage.getItem(key)); 
      // return null;
    return this.data;
   }
}
