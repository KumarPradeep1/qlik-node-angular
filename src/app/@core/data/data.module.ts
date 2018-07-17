import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from './api.service';
import { StorageService } from './storage.service';
import { UserService } from './users.service'; 
import { StateService } from './state.service';
import { SmartTableService } from './smart-table.service'; 

const SERVICES = [
  ApiService,
  StorageService,
  UserService, ,
  StateService,
  SmartTableService, 

];

@NgModule({
  imports: [
    CommonModule,
  ],
  providers: [
    ...SERVICES,
  ],
})
export class DataModule {
  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: DataModule,
      providers: [
        ...SERVICES,
      ],
    };
  }
}
