import { Component, OnDestroy } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { ApiService } from '../../../@core/data/api.service';
import { StorageService } from '../../../@core/data/storage.service';
import { MasheyService } from '../../../@core/data/mashey.service';

@Component({
  selector: 'ngx-d3-bar',
  templateUrl: './d3-bar.component.html',
  
})
export class D3BarComponent implements OnDestroy {

 // private results:any = []; 
  showLegend = true;
  showXAxis = true;
  showYAxis = true;
  xAxisLabel = 'Country';
  yAxisLabel = 'Population';
  colorScheme: any;
  themeSubscription: any; 
  public getBValues:any = [];
  private allinfos:any = [];
  private getBarchart:any = [];
  private objecttype:string = 'barchart';
  public emptyDataMessage:string = null; 

  constructor(private theme: NbThemeService,private apiservice:ApiService,private accessStorage:StorageService,private masheyservice:MasheyService) {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
      const colors: any = config.variables;
      this.colorScheme = {
        domain: [colors.primaryLight, colors.infoLight, colors.successLight, colors.warningLight, colors.dangerLight],
      };
    });  
    this.getAppData(this.accessStorage.getFromLocal('appId')); 
  }  

  async getAppData(value){
      let barValues= [];this.emptyDataMessage = null;
      let response = await this.masheyservice.loadAppinfos(value,this.objecttype); 
      console.log(response);
      if(response[0].hasOwnProperty("error")){
        this.emptyDataMessage = response[0].error; 
      }else{
        this.getBValues = response;
      }   
  } 
  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }
}
