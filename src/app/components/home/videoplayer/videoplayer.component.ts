import { Component, EventEmitter, OnInit, Input, Output, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ImageElement } from '../../common/final-object.interface';
import { ElectronService } from '../../../providers/electron.service';
import { Globals } from '../../../../../main-globals';
import { PlayState } from '@angular/core/src/render3/interfaces/player';

@Component({
  selector: 'app-videoplayer-component',
  templateUrl: './videoplayer.component.html',
  styleUrls: ['./videoplayer.component.scss']
})
export class VideoPlayerComponent implements OnInit {
  @ViewChild('videoplayer') videoplayer: any;
  @ViewChild('playButton') playButton: any;
  @ViewChild('muteButton') muteButton: any;
  @ViewChild('seekBar') seekBar: any;
  @ViewChild('volumeBar') volumeBar: any;

  constructor(
    private route: ActivatedRoute,
    public electronService: ElectronService,
  ) { }

  video: ImageElement;
  globals: Globals;
  seek: number;
  currentTime: number = 0;
  sheetDisplay = false;
  httpfile: string;

  ngOnInit() {
    this.electronService.ipcRenderer.on('load-video', (event, video, globals, seek) => {
      if (video.fileName) {
        this.video = video;
        this.globals = globals;
        this.seek = seek;
        this.seekVideo();
        console.log('video!' + video);
      }
    });
  }

  openVideo(index, seek) {
    this.seek = seek;
    this.seekVideo();
    this.sheetDisplay = false;
  }

  playPauseVideo() {
    if (!this.videoplayer.nativeElement.paused) {
      this.videoplayer.nativeElement.pause();
      this.playButton.nativeElement.innerHTML = 'Play';
    } else {
      this.videoplayer.nativeElement.play();
      this.playButton.nativeElement.innerHTML = 'Pause';
    }
  }

  muteUnmuteVideo() {
    if (this.videoplayer.nativeElement.muted === false) {
      this.videoplayer.nativeElement.muted = true;
      this.muteButton.nativeElement.innerHTML = 'Unmute';
    } else {
      this.videoplayer.nativeElement.muted = false;
      this.muteButton.nativeElement.innerHTML = 'Mute';
    }
  }

  fullscreenVideo() {
    this.electronService.ipcRenderer.send("toggle-fullscreen");
  }

  seekBarChange() {
    this.seek = parseFloat(this.seekBar.nativeElement.value);
    this.seekVideo(!this.videoplayer.nativeElement.paused);
  }

  seekBarUpdate() {
    this.currentTime = parseFloat(this.videoplayer.nativeElement.currentTime) + this.seek;
    this.seekBar.nativeElement.value = this.currentTime;
  }

  seekVideo(play = false) {
    this.httpfile = 'http://localhost:3000/?file=' + this.globals.selectedSourceFolder + '/'
      + this.video.partialPath + '/' + this.video.fileName + '&seek=' + this.seek;
    if (this.videoplayer) {
      this.videoplayer.nativeElement.autoplay = play;
    }
  }

  volumeChange() {
    this.videoplayer.nativeElement.volume = this.volumeBar.nativeElement.value;
  }
}
