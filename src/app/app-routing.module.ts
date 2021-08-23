import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VideoComponent } from './video/video.component';
import { VideoListComponent } from './video-list/video-list.component';

const routes: Routes = [
  { path: '', component: VideoListComponent },

  // TODO: A full path looks something like:
  //
  // @Odysee:8/techAMA:f
  //
  // #1 We gotta make Angular expect but then ignore the leading @ to get the username
  // #2 We gotta make Angular okay with the : in the username and id.
  //
  // For #2, what comes after the : seems to be optional, but there's a right and wrong value.
  // The wrong value will lead to a 404. A missing value will lead to redirecting to the right
  // value. We could figure out how it works, or take the simplest path to get it to work and
  // acknowage it as a task for the full version.

  { path: ':username/:videoId', component: VideoComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
