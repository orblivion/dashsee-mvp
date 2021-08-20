import { Component, OnInit } from '@angular/core';
import { Video } from '../video';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css']
})
export class VideoComponent implements OnInit {
  video: Video = {
    id: 0,
    name: "video name",
    description: "video description"
  };

  constructor() { }

  ngOnInit(): void {
  }

}
