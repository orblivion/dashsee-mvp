import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  trendingMixed: string = "trending_mixed"
  releaseTime: string = "release_time"
  orderBy: string = "";

  setTrendingMixed() {
    this.orderBy = this.trendingMixed
  }

  isTrendingMixed() {
    return this.orderBy == this.trendingMixed
  }

  setReleaseTime() {
    this.orderBy = this.releaseTime
  }

  isReleaseTime() {
    return this.orderBy == this.releaseTime
  }

  constructor() { }

  ngOnInit(): void {
    this.orderBy = this.trendingMixed;
  }

}
