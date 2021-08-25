import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { Video } from '../video';
import { VideoService} from '../video.service';
import { LBRYMediaIds, LBRYMediaClaims, LBRYMediaUrlParts } from '../mediaIds';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css']
})
export class VideoComponent implements OnInit {
  video? : Video;
  notFound : boolean = false; // set to true if it tried and failed to find a media item

  constructor(private videoService : VideoService, private route : ActivatedRoute, private router : Router) { }

  getVideoWithClaims(urlParts: LBRYMediaUrlParts): void {
    this.videoService.getVideo(urlParts)
      .subscribe(video => {
        if (video) {
          this.video = video;
        } else {
          this.notFound = true;
        }
      });
  }

  redirect(urlParts : LBRYMediaUrlParts): void {
    this.router.navigateByUrl(`@${urlParts.ids.username}:${urlParts.claims.usernameClaim}/${urlParts.ids.mediaHash}:${urlParts.claims.mediaHashClaim}`);
  }

  getVideoWithoutClaims(ids : LBRYMediaIds): void {
    // For now, don't bother handling the case where only one of usernameClaim or mediaHashClaim
    // is supplied. If one or both are missing, this function will be called, and we grab the
    // recommendation for both from the API.

    // TODO - for now I'm just guessing at how this endpoint works

    this.videoService.getClaims(ids.username, ids.mediaHash)
      .subscribe(
        (claims : LBRYMediaClaims) => {
          if (claims) {
            let urlParts = {ids, claims};
            this.redirect(urlParts);
            this.getVideoWithClaims(urlParts);
          } else {
            this.notFound = true;
          }
        }
      )
  }

  ngOnInit(): void {
    const username = this.route.snapshot.paramMap.get('username')
    const mediaHash = this.route.snapshot.paramMap.get('mediaHash')

    if (username && mediaHash) {
      const ids : LBRYMediaIds = {username, mediaHash}

      const usernameClaim = this.route.snapshot.paramMap.get('usernameClaim')
      const mediaHashClaim = this.route.snapshot.paramMap.get('mediaHashClaim')
      if (usernameClaim && mediaHashClaim) {
        const claims : LBRYMediaClaims = {usernameClaim, mediaHashClaim}
        const urlParts : LBRYMediaUrlParts = {claims, ids}
        this.getVideoWithClaims(urlParts);
      } else {
        this.getVideoWithoutClaims(ids)
      }
    } else {
      // I think the router will prevent this case, but the type system forces me to make
      // this if statement. In case the type system is right, I'm putting this here.
      this.notFound = true
    }
  }

}
