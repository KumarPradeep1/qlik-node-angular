import { Component } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';

import { SmartTableService } from '../../../@core/data/smart-table.service';
import { ApiService } from '../../../@core/data/api.service';
import { StorageService } from '../../../@core/data/storage.service';
import { MasheyService } from '../../../@core/data/mashey.service';

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
  public tabletitle:string  = null; 
  private objecttype:string = 'table';
  public emptyDataMessage:string = null;
 settings = {
    actions: false,
    columns: {}
  }; 

  source: LocalDataSource = new LocalDataSource();

  constructor(private service: SmartTableService,private apiservice:ApiService,private accessStorage:StorageService,private masheyservice:MasheyService) { 
    this.getAppData(this.accessStorage.getFromLocal('appId'));
  }
  async getAppData(value){
    let tabledata = await this.masheyservice.loadAppinfos(value,this.objecttype);  
    
    if(tabledata){
      tabledata.forEach(data=>{ 
        if(data.error){
          this.emptyDataMessage = data.error; 
        }else{ 
          this.tabletitle = data.title;
          this.settings.columns = data.columns; 
          this.source.load(data.data);
        } 
      })
    }
  } 
}
