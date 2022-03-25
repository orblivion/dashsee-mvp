import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  byTrendingMixed: string = "trending_mixed"
  byTimestamp: string = "timestamp"
  orderBy: string = "";

  // Set "trending" ordering
  setByTrendingMixed() {
    this.orderBy = this.byTrendingMixed
  }

  // Check if "trending" ordering
  isByTrendingMixed() {
    return this.orderBy == this.byTrendingMixed
  }

  // Set "by timestamp" ordering
  setByTimestamp() {
    this.orderBy = this.byTimestamp
  }

  // Check if "by timestamp" ordering
  isByTimestamp() {
    return this.orderBy == this.byTimestamp
  }

  constructor() { }

  ngOnInit(): void {
    this.orderBy = this.byTrendingMixed;
  }

}
