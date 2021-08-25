import { NgModule } from '@angular/core';
import { RouterModule, Routes, UrlSegment } from '@angular/router';
import { VideoComponent } from './video/video.component';
import { VideoListComponent } from './video-list/video-list.component';
import { TmpVideoDemoComponent } from './tmp-video-demo/tmp-video-demo.component';
import { LBRYMediaIds, LBRYMediaClaims } from './mediaIds';

interface LBRYMediaUrlMaybeParts
{
  ids? : LBRYMediaIds,
  claims? : LBRYMediaClaims,
}

function getLBRYMediaUrlParts(url : UrlSegment[]) : LBRYMediaUrlMaybeParts {
  // Not a LBRYMedia media URL
  if (url.length !==2 ) {
    return {};
  }

  let usernameMatch = url[0].path.match(/^@?(?<username>\w+)(:(?<usernameClaim>\w+))?$/);
  let mediaHashMatch = url[1].path.match(/^(?<mediaHash>\w+)(:(?<mediaHashClaim>\w+))?$/);

  if (usernameMatch && mediaHashMatch && usernameMatch.groups && mediaHashMatch.groups) {
    return {
      ids: {
        username: usernameMatch.groups['username'],
        mediaHash: mediaHashMatch.groups['mediaHash'],
      },
      claims: {
        usernameClaim: usernameMatch.groups['usernameClaim'],
        mediaHashClaim: mediaHashMatch.groups['mediaHashClaim'],
      },
    };
  }

  return {};
}

function matchMediaUrl(url : UrlSegment[]) {
  let {ids, claims} = getLBRYMediaUrlParts(url)

  // We need at least the username and hash to go to the video component.
  if (ids) {
    if (claims) {
      return {
        consumed: url,
        posParams: {
          username: new UrlSegment(ids.username, {}),
          mediaHash: new UrlSegment(ids.mediaHash, {}),
          usernameClaim: new UrlSegment(claims.usernameClaim, {}),
          mediaHashClaim: new UrlSegment(claims.mediaHashClaim, {}),
        }
      };
    }
    // TODO - Sending in UrlSegment('', {}) for claims for lack of better idea.
    // Maybe this could be simplified.
    return {
      consumed: url,
      posParams: {
        username: new UrlSegment(ids.username, {}),
        mediaHash: new UrlSegment(ids.mediaHash, {}),
        usernameClaim: new UrlSegment('', {}),
        mediaHashClaim: new UrlSegment('', {}),
      }
    };
  }

  return null;
}

const routes: Routes = [
  { path: '', component: VideoListComponent },
  { path: 'demo', component: TmpVideoDemoComponent },
  { matcher: matchMediaUrl, component: VideoComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
