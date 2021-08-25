import { Injectable } from '@angular/core';
import { Video } from './video';
import { VIDEOS } from './mock-video';
import { Observable, of } from 'rxjs';
import { StatusService } from './status.service';
import { LBRYMediaClaims, LBRYMediaUrlParts } from './mediaIds';

@Injectable({
  providedIn: 'root'
})
export class VideoService {

  constructor(private statusService : StatusService) { }

  // TODO - Do I really want this bang operator?

  getVideo(urlParts : LBRYMediaUrlParts): Observable<Video> {
    const video = VIDEOS.find(v => (
      v.username === urlParts.ids.username &&
      v.usernameClaim === urlParts.claims.usernameClaim &&
      v.mediaHash === urlParts.ids.mediaHash &&
      v.mediaHashClaim === urlParts.claims.mediaHashClaim
    ))!;
    this.statusService.add("loaded")
    return of(video);
  }

  getVideos(): Observable<Video[]> {
    return of(VIDEOS);
  }

  getClaims(username : string, mediaHash : string) : Observable<LBRYMediaClaims> {
    const video = VIDEOS.find(v => (
      v.username === username &&
      v.mediaHash === mediaHash
    ))!;
    return of({
      usernameClaim: video.usernameClaim,
      mediaHashClaim: video.mediaHashClaim,
    });
  }
}
