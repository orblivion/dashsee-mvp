import { Injectable } from '@angular/core';
import { Video } from './video';
import { VIDEO } from './mock-video';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VideoService {

  constructor() { }

  getVideo(): Observable<Video> {
    const video = of(VIDEO);
    return video;
  }
}
