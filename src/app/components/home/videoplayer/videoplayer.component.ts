import { Component, EventEmitter, OnInit, Input, Output, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ImageElement } from '../../common/final-object.interface';
import { ElectronService } from '../../../providers/electron.service';
import { Globals } from '../../../../../main-globals';

@Component({
  selector: 'app-videoplayer-component',
  templateUrl: './videoplayer.component.html',
  styleUrls: ['./videoplayer.component.scss']
})
export class VideoPlayerComponent implements OnInit {
  @ViewChild('videoplayer') videoplayer: any;

  constructor(
    private route: ActivatedRoute,
    public electronService: ElectronService,
  ) {}

  video: ImageElement;
  globals: Globals;
  seek: number;

  ngOnInit() {
    this.electronService.ipcRenderer.on('load-video', (event, video, globals, seek) => {
      this.video = video;
      this.globals = globals;
      this.seek = seek;
      this.seekVideo();
      console.log('video!' + video);
    });
  }

  seekVideo() {
    this.videoplayer.nativeElement.currentTime = this.seek;
  }
}
