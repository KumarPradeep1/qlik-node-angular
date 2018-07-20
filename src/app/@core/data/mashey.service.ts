import { Injectable } from '@angular/core'; 
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from './api.service';
import { HttpClient } from '@angular/common/http'; 
import { StorageService } from './storage.service';  
@Injectable()
export class MasheyService {  
  serviceurl:string; 
  
  getKPI:any = [];
  constructor(private http: HttpClient,private spinner: NgxSpinnerService,private accessStorage:StorageService) { 
    this.serviceurl = 'http://localhost:3005';
  }  
   
  getDoclists(){
    return this.http.get(this.serviceurl+'/doclists');
  }
  getAppinfos(appid){
    return this.http.get(this.serviceurl+'/appinfo/'+appid);
  }
  loadSpinner_show(){
    this.spinner.show();
  }
  loadSpinner_hide(){
    this.spinner.hide();
  }
 
  getObjectType(app_data,objecttype){
    let results_data = []; 
    let getData = [];
    let errorMessage = {error:'No data found'};
    
    if (app_data != undefined && app_data!='' && !app_data.error){   

      app_data.forEach(element => {
        if(element.type == objecttype){  
          if(objecttype == 'kpi'){
              results_data.push(element); 
          }
         
          else if(objecttype == 'table'){ 
              let elementData = element.data;
              let tabletitle = element.title;  
              var obj = {}; 
              console.log(element);
              if(element.tableproperty){ 
                let getHeader = element.tableproperty.qHyperCube.qDimensionInfo;
                getHeader.forEach(gH=>{
                let tableColumnvalue = {title: gH.qFallbackTitle,type: 'string'};
                let tableColumnname = tableColumnvalue.title.split(" ").join("").toLocaleLowerCase(); 
                obj[tableColumnname] = tableColumnvalue;   
                });
              }
              elementData.forEach(e => { 
                let info = {};
                Object.keys(obj).map(function(key, index) {  
                  info[key] = e[index].qText;
                }) ; 
                getData.push(info); 
              }); 
              results_data.push({columns: obj,data: getData,title:tabletitle});
          }
         
          else if(objecttype != 'kpi'){ 
              let elementData = element.data;   
              if(elementData!=''){ 
                elementData.forEach(e => {
                  let qValue = e[1].qNum == "NaN" ? 0 : e[1].qNum;
                  getData.push({name: e[0].qText,value: qValue}) 
                });  
                results_data.push({data:getData,title:element.title});   
              } 
              } 
          } 
      });
    }else{

      if(app_data.error){
        errorMessage = {error:app_data.error.message};
      }
      results_data.push(errorMessage);   
    } 
    if(results_data.length == 0){
      results_data.push(errorMessage);
    }
    this.loadSpinner_hide(); 
    return results_data;
  }
  async loadAppinfos(getappid,objecttype){ 
    this.loadSpinner_show();
    let app_data,results_data = [];
    this.accessStorage.saveInLocal('appId',getappid); 
    let current_app = this.accessStorage.getFromLocal('current_app');   
    if (current_app != undefined && current_app == getappid){ 
        let all_infos = this.accessStorage.getFromLocal('allInfos');
        app_data = all_infos[current_app];  
        return this.getObjectType(app_data,objecttype);  
    }else{  
      const response = await this.getAppinfos(getappid).toPromise();  
      if(response){
        let res_keys = Object.keys(response)
        if(res_keys.includes("error")){
          return this.getObjectType(response,objecttype); 
        }else{
          let appid = Object.keys(response)[0]
          this.accessStorage.saveInLocal('current_app',appid);
          this.accessStorage.saveInLocal('allInfos',response);
          app_data = response[appid];  
          return this.getObjectType(app_data,objecttype);  
        } 
      } 
    } 

  }
}
