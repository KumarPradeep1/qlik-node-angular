import {Component, OnDestroy} from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators/takeWhile' ;
import { ApiService } from '../../@core/data/api.service';
import { StorageService } from '../../@core/data/storage.service';
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

  constructor(private themeService: NbThemeService,private apiservice:ApiService,private accessStorage:StorageService) {
    this.themeService.getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(theme => { 
        this.statusCards = this.statusCardsByThemes[theme.name];
    });

    this.getAppinfos();
  }
  getAppinfos(){
  let accessValue = this.accessStorage.getFromLocal('allInfos');
  if(!accessValue){ 
   this.apiservice.getAppinfos().subscribe(data=>{
     console.log("66666666666", data) 
      this.allinfos = data; 
      this.accessStorage.saveInLocal('allInfos',this.allinfos);
      this.allinfos.forEach(element => {
        if(element.type == 'kpi'){
          this.getKPI.push(element);
        }
      }); 
    }) 
   }else{ 
    console.log(accessValue);
      accessValue.forEach(element => {
        if(element.type == 'kpi'){
          this.getKPI.push(element);
        } 
      })
   } 
  }
  ngOnDestroy() {
    this.alive = false;
  }
}
