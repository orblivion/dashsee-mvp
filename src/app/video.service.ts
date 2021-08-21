import { Injectable } from '@angular/core';
import { Video } from './video';
import { VIDEO } from './mock-video';
import { Observable, of } from 'rxjs';
import { StatusService } from './status.service';

@Injectable({
  providedIn: 'root'
})
export class VideoService {

  constructor(private statusService : StatusService) { }

  getVideo(): Observable<Video> {
    const video = of(VIDEO);
    this.statusService.add("loaded")
    return video;
  }
}
