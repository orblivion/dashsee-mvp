import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css']
})
export class VideoComponent implements OnInit {
  name = "video name"
  description = "video description"

  constructor() { }

  ngOnInit(): void {
  }

}
