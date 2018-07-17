import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Dashboard',
    icon: 'nb-home',
    link: '/pages/dashboard',
    home: true,
  },
  {
    title: 'Charts',
    icon: 'nb-bar-chart',
    link: '/pages/charts/d3',
  },
   {
    title: 'Tables',
    icon: 'nb-tables',
    link: '/pages/tables/smart-table',
  }, 
];
