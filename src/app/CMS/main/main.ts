import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NbMenuModule, NbIconLibraries, NbMenuItem, NbThemeService } from '@nebular/theme';
import { RouterOutlet } from "@angular/router";
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
@Component({
  selector: 'app-main',
  imports: [CommonModule, NbMenuModule, RouterOutlet,CardModule,ButtonModule,MenuModule],
  templateUrl: './main.html',
  styleUrl: './main.css'
})
export class Main {
//  public menu: any = [];
  private iconsLibrary = inject(NbIconLibraries);
  private readonly themeService = inject(NbThemeService);

  changeTheme(name: 'default' | 'cosmic' | 'corporate' | 'dark') {
    this.themeService.changeTheme(name);
  }
   menuItems: NbMenuItem[] = [
    {
      title: 'General Configuration',
      icon: { icon: 'GeneralConfiguration', pack: 'myicon' },
      link: '/cms/general',
    },
    {
      title: 'System Configuration',
      icon: { icon: 'general', pack: 'myicon' },
      link: '/cms/system',
    },
    {
      title: 'Dispatch Management',
      icon: { icon: 'DispatchManagement', pack: 'myicon' },
      expanded: true,
      children: [
        {
          title: 'Trip Generation',
          icon: { icon: 'TripGeneration', pack: 'myicon' },
          link: '/cms/trip',
        },
        {
          title: 'Monthly Roster',
          icon: { icon: 'MonthlyRostergeneration', pack: 'myicon' },
          link: '/cms/roster',
        },
        {
          title: 'Time Chart',
          icon: { icon: 'TimeChartGeneration', pack: 'myicon' },
          link: '/cms/timechart',
        },
      ],
    },
    {
      title: 'Reports',
      icon: { icon: 'Reports', pack: 'myicon' },
      link: '/cms/reports',
    },
    {
      title: 'Log Sheet',
      icon: { icon: 'logsheet', pack: 'myicon' },
      link: '/cms/logsheet',
    },
  ];

  ngOnInit(): void {
    // Register the SVG pack **once** (constructor also works, ngOnInit is safer)
    this.iconsLibrary.registerSvgPack('myicon', {
      GeneralConfiguration: '/assets/images/menu/pns/GeneralConfiguration.svg',
      general: '/assets/images/menu/pns/SystemConfiguration.svg',
      DispatchManagement: '/assets/images/menu/pns/DispatchManagement.svg',
      TripGeneration: '/assets/images/menu/pns/TripGeneration.svg',
      MonthlyRostergeneration: '/assets/images/menu/pns/MonthlyRostergeneration.svg',
      TimeChartGeneration: '/assets/images/menu/pns/TimeChartGeneration.svg',
      Reports: '/assets/images/menu/pns/Reports.svg',
      logsheet: '/assets/images/menu/pns/logsheetmanagement.svg',
    });
  }
}
