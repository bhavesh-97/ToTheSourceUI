import { Component, inject } from '@angular/core';

import { NbMenuModule, NbIconLibraries } from '@nebular/theme';
@Component({
  selector: 'app-main',
  imports: [NbMenuModule],
  templateUrl: './main.html',
  styleUrl: './main.css'
})
export class Main {
 public menu: any = [];
 private iconsLibrary = inject(NbIconLibraries);
 
  constructor() { 
    this.iconsLibrary.registerSvgPack('myicon', { 
    'GeneralConfiguration': '<img src="./assets/images/menu/pns/GeneralConfiguration.svg">',
    'general': '<img src="./assets/images/menu/pns/SystemConfiguration.svg">',
    'DispatchManagement': '<img src="./assets/images/menu/pns/DispatchManagement.svg">',
    'TripGeneration': '<img src="./assets/images/menu/pns/TripGeneration.svg">',
    'MonthlyRostergeneration': '<img src="./assets/images/menu/pns/MonthlyRostergeneration.svg">',
    'TimeChartGeneration': '<img src="./assets/images/menu/pns/TimeChartGeneration.svg">',
    'Reports': '<img src="./assets/images/menu/pns/Reports.svg">',
    'logsheet': '<img src="./assets/images/menu/pns/logsheetmanagement.svg">',
  });
}
}
