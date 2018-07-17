import { Component, OnDestroy } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { ApiService } from '../../../@core/data/api.service';
import { StorageService } from '../../../@core/data/storage.service';

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
  private getBValues:any = [];
  private allinfos:any = [];
  private getBarchart:any = [];
  private chartsType:any = ['barchart','combochart'];


  constructor(private theme: NbThemeService,private apiservice:ApiService,private accessStorage:StorageService) {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
      const colors: any = config.variables;
      this.colorScheme = {
        domain: [colors.primaryLight, colors.infoLight, colors.successLight, colors.warningLight, colors.dangerLight],
      };
    });
    this.getAppinfos();
  }
  getAppinfos(){
    let accessValue = this.accessStorage.getFromLocal('allInfos');
    console.log(accessValue);
    if(accessValue == ''){ 
    this.apiservice.getAppinfos().subscribe(data=>{ 
        this.allinfos = data; 
        this.allinfos.forEach(element => {
          if(element.type == 'barchart'){
            let elementData = element.data;
            elementData.forEach(e => {
              this.getBarchart.push({name: e[0].qText,value: e[1].qText}) 
            });
            
          }
        }); 
    })
    }else{
      accessValue.forEach(element => { 
        console.log(element.type);
        if(this.chartsType.includes(element.type)){
            let elementData = element.data; 
            this.getBarchart = [];
            if(elementData!=''){ 
              elementData.forEach(e => {
                this.getBarchart.push({name: e[0].qText,value: e[1].qText}) 
              });  
              this.getBValues.push({data:this.getBarchart,title:element.title});  
            } 
        }    
       // this.results = this.getBarchart;
      })
      console.log(this.getBValues); 
    }
   }
  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }
}
