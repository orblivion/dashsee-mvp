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
    this.videoService.getVideo()
      .subscribe(video => this.video = video);
  }

  ngOnInit(): void {
    this.getVideo();
  }

}
