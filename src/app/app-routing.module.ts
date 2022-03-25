import { NgModule } from '@angular/core';
import { RouterModule, Routes, UrlSegment } from '@angular/router';
import { checkMediaUri } from './lbry-media-uri';
import { VideoComponent } from './video/video.component';
import { HomePageComponent } from './home-page/home-page.component';

/*
LBRY's URL scheme is a little involved. You can learn about it here: https://spec.lbry.com/
In short, names of channels and videos are determined by "claims" in the blockchain, and
claims have IDs. A given name can have multiple claims on it by different parties. If a
claim ID is not specified in a URL, the claim with the largest amount of LBC supporting it will
"win" and you will be shown that video or channel.

Also note that a full claim ID is generally not needed in the URL. If there is more than one
claim on a URL, only the first characters of the claim ID show up in the URL. We only need
enough characters to distinguish it from all other claims on that name. Usually one or two.

A full video URL includes a channel name and a video name:

@my-channel:c1/my-video:c2 - where c1 and c2 are (partial) claim IDs. This brings you to a video page (assuming the claims are valid)
@my-channel/my-video - This will redirect to add the winning claim IDs for the channel name and video name

A single name beginning with a @ is a channel URL:

@my-channel - This will redirect to add a claim ID of the winning claim for this channel name

A single name not beginning with a @ is either a channel or a video URL depending on what the winning claim is.

my-name - If this is a video name, it'll show the video. I don't recall what this app will do in this case if this refers to a channel
  name. It might redirect to add the @. And of course it would also add the claim IDs. I just don't remember, as I write this comment.

Since the URL scheme is not conventional, I wrote cutsom matching functions: `matchLBRYMediaUri` and `matchLBRYChannelUri`.
*/

function matchLBRYMediaUri(url : UrlSegment[]) {
  // We'll just assume that any string is fine, so long as it's at most
  // one slash and one colon in each segment.

  // `url` is an array of url segments formerly separated by slashes.
  // We're just going to put the slash back in and rejoin them.
  let mediaUriEncoded = url.join('/')

  // Is it a valid media URI?
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

// I think this is incomplete.
function matchLBRYChannelUri(url : UrlSegment[]) {
  if(url.length === 1 && url[0].path[0] === '@') {
    return {consumed: url};
  }
  return null;
}

const routes: Routes = [
  { path: '', component: HomePageComponent },

  /*
  The plan is:

  Catch anything with one segment that starts with @ as a channel.
    For now, channels redirect back to root. Eventually we get a @channel component.
  URLs with one segment that don't start with @ could be media uris.

  */

  { matcher: matchLBRYChannelUri, redirectTo: '' },
  { matcher: matchLBRYMediaUri, component: VideoComponent },
  { path: "**", redirectTo: '' }, // TODO maybe a proper 404
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
