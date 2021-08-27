import { NgModule } from '@angular/core';
import { RouterModule, Routes, UrlSegment } from '@angular/router';
import { checkMediaUri } from './lbry-media-uri';
import { VideoComponent } from './video/video.component';
import { VideoListComponent } from './video-list/video-list.component';

function matchLBRYMediaUri(url : UrlSegment[]) {
  // We'll just assume that any string is fine, so long as it's at most
  // one slash and one colon in each segment.

  let mediaUri = url.join('/')

  if (!checkMediaUri(mediaUri)) {
    return null;
  }

  return {
    consumed: url,
    posParams: {
      mediaUri: new UrlSegment(mediaUri, {}),
    }
  };
}

function matchLBRYChannelUri(url : UrlSegment[]) {
  if(url.length === 1 && url[0].path[0] === '@') {
    return {consumed: url};
  }
  return null;
}

const routes: Routes = [
  { path: '', component: VideoListComponent },

  // Catch anything with one segment that starts with @ as a channel.
  // Things with one segment that don't start with @ could be media uris.
  //
  // For now, redirect back to root. Eventually we get a @channel component.
  { matcher: matchLBRYChannelUri, redirectTo: '' },

  { matcher: matchLBRYMediaUri, component: VideoComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
