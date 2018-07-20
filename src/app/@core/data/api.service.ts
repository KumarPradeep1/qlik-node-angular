import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ApiService {
 
  serviceurl:string;
  constructor(private http: HttpClient) {
    // this.serviceurl = 'http://localhost:3005';
    this.serviceurl = 'http://34.211.167.145:3005';
  } 
  getDoclists(){
    return this.http.get(this.serviceurl+'/doclists');
  }
  getAppinfos(appid){
    return this.http.get(this.serviceurl+'/appinfo?appid='+appid);
  }
}
