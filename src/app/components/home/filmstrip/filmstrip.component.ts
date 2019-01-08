import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { galleryItemAppear, metaAppear, textAppear } from '../../common/animations';

@Component({
  selector: 'app-filmstrip-item',
  templateUrl: './filmstrip.component.html',
  styleUrls: ['./filmstrip.component.scss'],
  animations: [ galleryItemAppear,
                textAppear,
                metaAppear ]
})
export class FilmstripComponent implements OnInit {

  @ViewChild('filmstripHolder') filmstripHolder: ElementRef;

  @Input() darkMode: boolean;
  @Input() elHeight: number;
  @Input() fileSize: number;
  @Input() folderPath: string;
  @Input() hoverScrub: boolean;
  @Input() hubName: string;
  @Input() imgHeight: number;
  @Input() imgId: any;
  @Input() largerFont: boolean;
  @Input() numOfScreenshots: number;
  @Input() rez: string;
  @Input() showMeta: boolean;
  @Input() time: string;
  @Input() title: string;

  fullFilePath: string = '';
  filmXoffset: number = 0;

  constructor(
    public sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.fullFilePath =  'file://' + this.folderPath + '/' + 'vha-' + this.hubName + '/filmstrips/' + this.imgId + '.jpg';
  }

  updateFilmXoffset($event) {
    if (this.hoverScrub) {
      const imgWidth = this.imgHeight * (16 / 9); // hardcoded aspect ratio
      const containerWidth = this.filmstripHolder.nativeElement.getBoundingClientRect().width;
      const visibleScreens = Math.floor(containerWidth / imgWidth);
      const howManyScreensOutsideCutoff = this.numOfScreenshots - visibleScreens;

      const cursorX = $event.layerX; // cursor's X position inside the filmstrip element
      this.filmXoffset = imgWidth * Math.floor(cursorX / (containerWidth / (howManyScreensOutsideCutoff + 1)));
      if (this.filmXoffset > imgWidth * (howManyScreensOutsideCutoff - 1)) {
        const overlap = containerWidth - imgWidth * visibleScreens;
        this.filmXoffset = imgWidth * (howManyScreensOutsideCutoff) - overlap;
      }
    }
  }
}
