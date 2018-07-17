import { Component, Input } from '@angular/core';

@Component({
  selector: 'ngx-status-card',
  styleUrls: ['./status-card.component.scss'],
  template: `
    <nb-card>
    <div class="details">
        <div class="title">{{ title }}<span>{{ qText }} </span></div> 
      </div> 
        <div class="block">
          <ng-content></ng-content>
        </div> 
    </nb-card>
  `,
})
export class StatusCardComponent {

  @Input() title: string;
  @Input() type: string;
  @Input() on = true;
}
