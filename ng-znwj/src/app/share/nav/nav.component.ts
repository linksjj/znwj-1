import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavComponent {

  constructor() {
  }
}
