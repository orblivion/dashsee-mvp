import { Component, OnInit } from '@angular/core';
import { Video } from '../video';
import { VideoService } from '../video.service';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css']
})
export class VideoComponent implements OnInit {
  video? : Video;

  constructor(private videoService : VideoService) { }

  getVideo(): void {
    this.video = this.videoService.getVideo()
  }

  ngOnInit(): void {
    this.getVideo();
  }

}
