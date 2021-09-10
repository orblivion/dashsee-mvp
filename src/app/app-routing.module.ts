import { NgModule } from '@angular/core';
import { RouterModule, Routes, UrlSegment } from '@angular/router';
import { checkMediaUri, checkChannelUri } from './lbry-uris';
import { VideoComponent } from './video/video.component';
import { ChannelComponent } from './channel/channel.component';
import { HomePageComponent } from './home-page/home-page.component';

function matchLBRYMediaUri(url : UrlSegment[]) {
  // We'll just assume that any string is fine, so long as it's at most
  // one slash and one colon in each segment.

  let mediaUriEncoded = url.join('/')

  if (!checkMediaUri(mediaUriEncoded)) {
    return null;
  }

  return {
    consumed: url,
    posParams: {
      mediaUriEncoded: new UrlSegment(mediaUriEncoded, {}),
    }
  };
}

function matchLBRYChannelUri(url : UrlSegment[]) {
  let channelUriEncoded = url.join('/')

  if (!checkChannelUri(channelUriEncoded)) {
    return null;
  }
  return {
    consumed: url,
    posParams: {
      channelUriEncoded: new UrlSegment(channelUriEncoded, {}),
    }
  };
}

const routes: Routes = [
  { path: '', component: HomePageComponent },

  // Catch anything with one segment that starts with @ as a channel.
  // Things with one segment that don't start with @ could be media uris.
  //
  // For now, redirect back to root. Eventually we get a @channel component.
  { matcher: matchLBRYChannelUri, component: ChannelComponent },
  { matcher: matchLBRYMediaUri, component: VideoComponent },
  { path: "**", redirectTo: '' }, // TODO maybe a proper 404
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
