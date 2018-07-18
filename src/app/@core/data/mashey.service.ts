import { Injectable } from '@angular/core'; 
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from './api.service';
import { HttpClient } from '@angular/common/http'; 
import { StorageService } from './storage.service'; 

@Injectable()
export class MasheyService {  
  serviceurl:string;
  getKPI:any = [];
  constructor(private http: HttpClient,private spinner: NgxSpinnerService,private apiservice:ApiService,private accessStorage:StorageService) { 
    this.serviceurl = 'http://localhost:3005';
  }  
  getDoclists(){
    return this.http.get(this.serviceurl+'/doclists');
  }
  getAppinfos(appid){
    return this.http.get(this.serviceurl+'/appinfo?appId='+appid);
  }
  loadSpinner_show(){
    this.spinner.show();
  }
  loadSpinner_hide(){
    this.spinner.hide();
  }
 
  getObjectType(app_data,objecttype){
    let results_data = [];
    if (app_data != undefined){   
      app_data.forEach(element => {
        if(element.type == objecttype){
          results_data.push(element);
        }
      });
    }
    return results_data;
  }
  async loadAppinfos(getappid,objecttype){ 
    let app_data,results_data = [];
    this.accessStorage.saveInLocal('appId',getappid); 
    let current_app = this.accessStorage.getFromLocal('current_app');   

    if (current_app != undefined && current_app == getappid){ 
      let all_infos = this.accessStorage.getFromLocal('allInfos');
          app_data = all_infos[current_app];  
          return app_data;     
    }else{  
      const response = await this.getAppinfos(getappid).toPromise(); 
      if(response){
        let appid = Object.keys(response)[0]
        this.accessStorage.saveInLocal('current_app',appid);
        this.accessStorage.saveInLocal('allInfos',response);
        app_data = response[appid];  
        return this.getObjectType(app_data,objecttype);  
      } 
    } 

  }
}
