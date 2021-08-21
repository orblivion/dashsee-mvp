import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VideoComponent } from './video/video.component';
import { VideoListComponent } from './video-list/video-list.component';

const routes: Routes = [
  { path: 'video', component: VideoComponent },
  { path: '', component: VideoListComponent },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
