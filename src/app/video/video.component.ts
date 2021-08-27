import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { Video } from '../video';
import { VideoService, VideoServiceError } from '../video.service';
import { checkMediaUri } from '../lbry-media-uri';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css']
})
export class VideoComponent implements OnInit {
  video? : Video;
  streamUrl? : string;

  // Error conditions. Set to true to display the appropriate error message.
  notFound : boolean = false; // tried and failed to find a media item
  notVideo : boolean = false; // something other than a video found

  constructor(private videoService : VideoService, private route : ActivatedRoute, private router : Router) { }

  getAndShowVideo(mediaUri: string) {
    this.videoService.getVideo(mediaUri)
      .subscribe({
        next: (video) => {
          this.video = video
          this.videoService.getStreamUrl(video)
            .subscribe((streamUrl) => {
              this.streamUrl = streamUrl;
              this.updateUrl(video.canonicalUri)
              console.log("Stream URL = ", this.streamUrl);
            });
        },
        error: (error) => {
          if (error.type === VideoServiceError.NotFound) {
            this.notFound = true
          } else if (error.type === VideoServiceError.NotVideo) {
            this.notVideo = true
          } else {
            console.error("There was an error!", error);
          }
        },
      });
  }

  updateUrl(canonicalUri : string): void {
    // Check the validity of the uri before setting the URL bar to it.
    // Who knows, maybe the API sent us something funny.
    if(checkMediaUri(canonicalUri)) {
      this.router.navigateByUrl(canonicalUri);
    }
  }

  ngOnInit(): void {
    const mediaUri = this.route.snapshot.paramMap.get('mediaUri')

    if (mediaUri) {
      this.getAndShowVideo(mediaUri)
    } else {
      // I think the router will prevent this case, but the type system forces me to make
      // this if statement. In case the type system is right, I'm putting this here.
      this.notFound = true
    }
  }

}
