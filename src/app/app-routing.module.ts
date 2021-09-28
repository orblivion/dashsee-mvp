import { NgModule } from '@angular/core';
import { RouterModule, Routes, UrlSegment } from '@angular/router';
import { checkMediaUri } from './lbry-media-uri';
import { VideoComponent } from './video/video.component';
import { HomePageComponent } from './home-page/home-page.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

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
  if(url.length === 1 && url[0].path[0] === '@') {
    return {consumed: url};
  }
  return null;
}

const routes: Routes = [
  { path: '', component: HomePageComponent },

  // Catch anything with one segment that starts with @ as a channel.
  // Things with one segment that don't start with @ could be media uris.
  //
  // For now, redirect back to root. Eventually we get a @channel component.
  { matcher: matchLBRYChannelUri, redirectTo: '' },
  { matcher: matchLBRYMediaUri, component: VideoComponent },
  { path: "$/login", component: LoginComponent },
  { path: "$/signup", component: SignupComponent },
  { path: "**", redirectTo: '' }, // TODO maybe a proper 404
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
