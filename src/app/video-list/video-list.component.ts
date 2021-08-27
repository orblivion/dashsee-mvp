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

  getAndShowMostRecentVideos() {
    this.videoService.getRecentVideos(["tech"])
      .subscribe((vidList) => this.videos = vidList.slice(0, 5))
  }

  ngOnInit(): void {
    this.getAndShowMostRecentVideos()
  }

}
