import { Component, OnInit, Input } from '@angular/core';
import { Video } from '../models';
import { LbryService } from '../lbry.service';

const pageSize = 20; // As of this writing, the default from LBRY's API is 20.

@Component({
  selector: 'app-video-list',
  templateUrl: './video-list.component.html',
  styleUrls: ['./video-list.component.css']
})
export class VideoListComponent implements OnInit {
  totalPages : number | undefined;
  currentPage : number = 0; // 1-indexed, but we add 1 before we pass in to the API
  videos : Video[] = [];
  requestError : Boolean = false;
  loading : Boolean = false;

  @Input() orderBy?: string;
  @Input() channelUri?: string;
  @Input() searchString?: string;

  constructor(private lbryService : LbryService) { }

  getAndShowNextVideos() {
    // This should always be set by the parent component
    if (this.orderBy === undefined) {
      return
    }

    this.loading = true;

    // Just in case of concurrency issues with clicks etc, put a limit on it
    if (this.totalPages === undefined || this.currentPage < this.totalPages) {
      this.lbryService.getVideos(this.orderBy, this.searchString, this.channelUri, this.currentPage + 1, pageSize)
        .subscribe({
          next: ({videos, page, totalPages}) => {
            this.videos = this.videos.concat(videos);
            this.currentPage = page;
            this.totalPages = totalPages;
            this.loading = false;
          },
          error: (error) => {
            this.requestError = true,
            this.loading = false;
          }
        })
    }
  }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    this.totalPages = undefined;
    this.currentPage = 0;
    this.videos = [];
    this.requestError = false;
    this.loading = false;

    this.getAndShowNextVideos()
  }

}
