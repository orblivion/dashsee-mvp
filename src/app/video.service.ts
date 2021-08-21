import { Injectable } from '@angular/core';
import { Video } from './video'
import { VIDEO } from './mock-video'

@Injectable({
  providedIn: 'root'
})
export class VideoService {

  constructor() { }

  getVideo(): Video {
    return VIDEO;
  }
}
