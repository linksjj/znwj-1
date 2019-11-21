import {animate, query, style, transition, trigger} from '@angular/animations';
import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {RouterOutlet} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {EventBusService} from './service/event-bus.service';

export const fadeAnimation = trigger('sideAnimation', [

  transition('* => *', [

    query(':enter', [
        style({
          opacity: 0
        })
      ],
      {optional: true}
    ),
    query(':leave', animate('0.4s ease-in-out', style({
        opacity: 0
      })),
      {optional: true}
    ),
    query(':enter', animate('0.4s ease-in-out', style({
        opacity: 1
      })),
      {optional: true}
    )
  ])
]);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
  animations: [fadeAnimation]
})
export class AppComponent implements OnInit {

  constructor(private title: Title,
              eb: EventBusService,
              private translate: TranslateService) {
    this.translate.setDefaultLang('zh_CN');
    this.translate.get('title').subscribe(it => title.setTitle(it));
    eb.start();
  }

  ngOnInit() {
  }

  getState(outlet: RouterOutlet) {
    return outlet.isActivated ? outlet.activatedRoute : '';
  }

}
