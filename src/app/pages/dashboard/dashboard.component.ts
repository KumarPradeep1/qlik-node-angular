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
  public doclists:any = [];
  private docReturn:any = [];
  private allinfos:any = [];
  public getKPI:any = []; 
  private objecttype:string = 'kpi'; 
  public emptyDataMessage:string = null;
  public showkpi:boolean = false;

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
    //localStorage.clear() 
    this.getDoclists();
  }

  getDoclists(){
    this.masheyservice.loadSpinner_show();
    let docValue = this.accessStorage.getFromLocal('doclists');
    if(!docValue){
      this.masheyservice.getDoclists().subscribe(docdata=>{
        this.docReturn = docdata;
        if(!this.docReturn.error){
          this.returnDoclists(docdata);
          this.accessStorage.saveInLocal('doclists',this.doclists);
        }else{ 
          this.returnDoclists({error: "Error on API --- "+this.docReturn.error.severity});
        }
      },error=>{
        this.masheyservice.loadSpinner_hide(); 
        console.log(error);
      });
    }else{
      this.returnDoclists(docValue);
    }
  }

  returnDoclists(docdata){
    this.doclists = docdata;
    this.masheyservice.loadSpinner_hide();
  }

  onAppChange(value){
    if(value){
      this.showkpi = false; 
      this.getAppData(value);
    }
  }

  async getAppData(value){
    this.emptyDataMessage = null; this.getKPI = [];
    let response = await this.masheyservice.loadAppinfos(value,this.objecttype);
    this.showkpi = true; 
    if(response[0].hasOwnProperty("error")){
      this.emptyDataMessage = response[0].error; 
    }else{
      this.getKPI = response;
    } 
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
