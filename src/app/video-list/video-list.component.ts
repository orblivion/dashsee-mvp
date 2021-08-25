import { Component, OnInit } from '@angular/core';
import { Video } from '../video';
import { VideoService } from '../video.service';

@Component({
  selector: 'app-video-list',
  templateUrl: './video-list.component.html',
  styleUrls: ['./video-list.component.css']
})
export class VideoListComponent implements OnInit {
  videos : Video[] = [];

  constructor(private videoService : VideoService) { }

  getVideos(): void {
    this.videoService.getVideos()
      .subscribe(videos => this.videos = videos)
  }

  ngOnInit(): void {
    this.getVideos()
  }

}
