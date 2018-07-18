import {Component, OnDestroy} from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators/takeWhile' ;
import { ApiService } from '../../@core/data/api.service';
import { StorageService } from '../../@core/data/storage.service';
import { MasheyService } from '../../@core/data/mashey.service';

interface CardSettings {
  title: string;
  iconClass: string;
  type: string;
}

@Component({
  selector: 'ngx-dashboard',
  styleUrls: ['./dashboard.component.scss'],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnDestroy {

  private alive = true;
  private doclists:any = [];
  private allinfos:any = [];
  private getKPI:any = [];

  lightCard: CardSettings = {
    title: 'Light',
    iconClass: 'nb-lightbulb',
    type: 'primary',
  };
  rollerShadesCard: CardSettings = {
    title: 'Roller Shades',
    iconClass: 'nb-roller-shades',
    type: 'success',
  };
  wirelessAudioCard: CardSettings = {
    title: 'Wireless Audio',
    iconClass: 'nb-audio',
    type: 'info',
  };
  coffeeMakerCard: CardSettings = {
    title: 'Coffee Maker',
    iconClass: 'nb-coffee-maker',
    type: 'warning',
  };

  statusCards: string;

  commonStatusCardsSet: CardSettings[] = [
    this.lightCard,
    this.rollerShadesCard,
    this.wirelessAudioCard,
    this.coffeeMakerCard,
  ];

  statusCardsByThemes: {
    default: CardSettings[];
    cosmic: CardSettings[];
    corporate: CardSettings[];
  } = {
    default: this.commonStatusCardsSet,
    cosmic: this.commonStatusCardsSet,
    corporate: [
      {
        ...this.lightCard,
        type: 'warning',
      },
      {
        ...this.rollerShadesCard,
        type: 'primary',
      },
      {
        ...this.wirelessAudioCard,
        type: 'danger',
      },
      {
        ...this.coffeeMakerCard,
        type: 'secondary',
      },
    ],
  };

  constructor(private themeService: NbThemeService,private apiservice:ApiService,private accessStorage:StorageService,private masheyservice:MasheyService) {
    this.themeService.getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(theme => { 
        this.statusCards = this.statusCardsByThemes[theme.name];
    });
    this.getDoclists(); 
  }
  getDoclists(){
    this.masheyservice.loadSpinner_show();
    let docValue = this.accessStorage.getFromLocal('doclists');
    if(!docValue){
      this.apiservice.getDoclists().subscribe(docdata=>{
        this.returnDoclists(docdata); 
        this.accessStorage.saveInLocal('doclists',this.doclists);
      });
    }else{
      this.returnDoclists(docValue); 
    }
   
  }
  returnDoclists(docdata){
    this.doclists = docdata;  
    setTimeout(() => {
    this.masheyservice.loadSpinner_hide();
    },2000);
  }
  onAppChange(value){ 
    if(value){
      this.accessStorage.saveInLocal('appId',value);
    } 
  }
  getAppinfos(){
    let current_app = this.accessStorage.getFromLocal('current_app');

    if (current_app != undefined){
      let all_infos = this.accessStorage.getFromLocal('allInfos');
      let app_data = all_infos[current_app]
      this.getKPI = this.get_kpi_data(app_data)
    }else{
      this.apiservice.getAppinfos().subscribe(data=>{
        let appid = Object.keys(data)[0]
        this.accessStorage.saveInLocal('current_app',appid);
        this.accessStorage.saveInLocal('allInfos',data);
        this.getKPI = this.get_kpi_data(data[appid])
      })
    }
  }

  get_kpi_data(results){
    let data = []
    results.forEach(element => {
      if(element.type == 'kpi'){
        data.push(element);
      }
    });
    return data;
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
