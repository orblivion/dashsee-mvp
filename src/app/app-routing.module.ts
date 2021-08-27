import { NgModule } from '@angular/core';
import { RouterModule, Routes, UrlSegment } from '@angular/router';
import { checkMediaUri } from './lbry-media-uri';
import { VideoComponent } from './video/video.component';
import { VideoListComponent } from './video-list/video-list.component';
import { TmpVideoDemoComponent } from './tmp-video-demo/tmp-video-demo.component';

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

const routes: Routes = [
  { path: '', component: VideoListComponent },
  { path: 'demo', component: TmpVideoDemoComponent },
  { matcher: matchLBRYMediaUri, component: VideoComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
