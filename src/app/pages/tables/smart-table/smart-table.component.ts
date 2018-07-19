import { Component } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';

import { SmartTableService } from '../../../@core/data/smart-table.service';
import { ApiService } from '../../../@core/data/api.service';
import { StorageService } from '../../../@core/data/storage.service';

@Component({
  selector: 'ngx-smart-table',
  templateUrl: './smart-table.component.html',
  styles: [`
    nb-card {
      transform: translate3d(0, 0, 0);
    }
  `],
})
export class SmartTableComponent {

  private allinfos:any = []; 
  private tabledata:any = []; 
  private tablesize:any = []; 
  private newColumnData:any = [];
  public tabletitle:string = 'title';
 settings = {
    actions: false,
    columns: {}
  }; 

  source: LocalDataSource = new LocalDataSource();

  constructor(private service: SmartTableService,private apiservice:ApiService,private accessStorage:StorageService) { 
    this.getAppinfos();
  }
  getAppinfos(){
    let accessValue = this.accessStorage.getFromLocal('allInfos'); 
    if(!accessValue){ 
     this.apiservice.getAppinfos('test').subscribe(data=>{ 
        this.allinfos = data; 
        this.accessStorage.saveInLocal('allInfos',this.allinfos);
        this.allinfos.forEach(element => {
          if(element.type == 'table'){ 
            let elementData = element.data;
            this.tabletitle = element.title;
            //this.tablesize = element.tableproperty.qHyperCube.qSize.qcx;
            let getHeader = element.tableproperty.qHyperCube.qDimensionInfo;
            var obj = {}; 
            getHeader.forEach(gH=>{
             let tableColumnvalue = {title: gH.qFallbackTitle,type: 'string'};
             let tableColumnname = tableColumnvalue.title.split(" ").join("").toLocaleLowerCase(); 
             obj[tableColumnname] = tableColumnvalue;   
            })
            this.settings.columns = obj; 
            elementData.forEach(e => { 
              let info = {};
              Object.keys(obj).map(function(key, index) {  
                info[key] = e[index].qText;
              }) ; 
              this.tabledata.push(info); 
            });  
           this.source.load(this.tabledata);
          }
        }); 
      }) 
     }else{  
        accessValue.forEach(element => { 
          if(element.type == 'table'){ 
            let elementData = element.data;
            this.tabletitle = element.title;
            //this.tablesize = element.tableproperty.qHyperCube.qSize.qcx;
            let getHeader = element.tableproperty.qHyperCube.qDimensionInfo;
            var obj = {}; 
            getHeader.forEach(gH=>{
             let tableColumnvalue = {title: gH.qFallbackTitle,type: 'string'};
             let tableColumnname = tableColumnvalue.title.split(" ").join("").toLocaleLowerCase(); 
             obj[tableColumnname] = tableColumnvalue;   
            })
            this.settings.columns = obj; 
            elementData.forEach(e => { 
              let info = {};
              Object.keys(obj).map(function(key, index) {  
                info[key] = e[index].qText;
              }) ; 
              this.tabledata.push(info); 
            });  
           this.source.load(this.tabledata);
          } 
        })
         
     } 
    }
  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }
}
