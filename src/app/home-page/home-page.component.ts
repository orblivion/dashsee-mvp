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

  setByTrendingMixed() {
    this.orderBy = this.byTrendingMixed
  }

  isByTrendingMixed() {
    return this.orderBy == this.byTrendingMixed
  }

  setByTimestamp() {
    this.orderBy = this.byTimestamp
  }

  isByTimestamp() {
    return this.orderBy == this.byTimestamp
  }

  constructor() { }

  ngOnInit(): void {
    this.orderBy = this.byTrendingMixed;
  }

}
