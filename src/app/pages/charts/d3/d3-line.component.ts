import { Component, OnDestroy } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { ApiService } from '../../../@core/data/api.service';
import { StorageService } from '../../../@core/data/storage.service';

@Component({
  selector: 'ngx-d3-line',
  template: `
    <ngx-charts-line-chart
      [scheme]="colorScheme"
      [results]="multi"
      [xAxis]="showXAxis"
      [yAxis]="showYAxis"
      [legend]="showLegend"
      [showXAxisLabel]="showXAxisLabel"
      [showYAxisLabel]="showYAxisLabel"
      [xAxisLabel]="xAxisLabel"
      [yAxisLabel]="yAxisLabel">
    </ngx-charts-line-chart>
  `,
})
export class D3LineComponent implements OnDestroy {
  multi = [
    {
      name: 'Germany',
      series: [
        {
          name: '2010',
          value: 7300,
        },
        {
          name: '2011',
          value: 8940,
        },
      ],
    },
    {
      name: 'USA',
      series: [
        {
          name: '2010',
          value: 7870,
        },
        {
          name: '2011',
          value: 8270,
        },
      ],
    },
    {
      name: 'France',
      series: [
        {
          name: '2010',
          value: 5002,
        },
        {
          name: '2011',
          value: 5800,
        },
      ],
    },
  ];
  showLegend = true;
  showXAxis = true;
  showYAxis = true;
  showXAxisLabel = true;
  xAxisLabel = 'Country';
  showYAxisLabel = true;
  yAxisLabel = 'Population';
  colorScheme: any;
  themeSubscription: any;
  private allinfos:any = [];
  private getLinechart:any = [];

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
    if(accessValue == ''){ 
    this.apiservice.getAppinfos('test').subscribe(data=>{ 
        this.allinfos = data; 
        this.allinfos.forEach(element => {
          if(element.type == 'linechart'){
            let elementData = element.data;
            elementData.forEach(e => {
              this.getLinechart.push({name: e[0].qText,value: e[1].qText}) 
            });
            
          }
        }); 
    })
    }else{
      accessValue.forEach(element => {
        if(element.id == 'hRZaKk'){
          let elementData = element.data;
          console.log(elementData);
            // elementData.forEach(e => {
            //   this.getLinechart.push({name: e[0].qText,value: e[1].qText}) 
            // });
        }  
      })
    }
   }
  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }
}
