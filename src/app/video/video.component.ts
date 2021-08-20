import { Component, OnInit } from '@angular/core';
import { Video } from '../video';
import { VIDEO } from '../mock-video';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css']
})
export class VideoComponent implements OnInit {
  video = VIDEO;

  constructor() { }

  ngOnInit(): void {
  }

}
