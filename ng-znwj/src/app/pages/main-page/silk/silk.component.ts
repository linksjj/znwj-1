import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {Gallery, GalleryComponent} from '@ngx-gallery/core';
import {Lightbox} from '@ngx-gallery/lightbox';
import {Silk} from '../../../model/silk';

const data = [
  {
    srcUrl: 'https://preview.ibb.co/jrsA6R/img12.jpg',
    previewUrl: 'https://preview.ibb.co/jrsA6R/img12.jpg'
  },
  {
    srcUrl: 'https://preview.ibb.co/kPE1D6/clouds.jpg',
    previewUrl: 'https://preview.ibb.co/kPE1D6/clouds.jpg'
  }
];

@Component({
  selector: 'app-silk',
  templateUrl: './silk.component.html',
  styleUrls: ['./silk.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SilkComponent implements OnInit {
  @Input()
  silk: Silk;

  constructor(private gallery: Gallery,
              private lightbox: Lightbox) {
  }

  ngOnInit(): void {
  }

  showLightbox(i: number, galleryComp: GalleryComponent) {
    this.gallery.ref(this.silk.id).load(galleryComp.items);
    this.lightbox.open(0, this.silk.id);
  }
}
