import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { Channel } from '../models';
import { LbryService, LbryServiceError } from '../lbry.service';
import { checkChannelUri } from '../lbry-uris';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.css']
})
export class ChannelComponent implements OnInit {
  channel? : Channel;
  byTimestamp: string = "timestamp"
  tab?: string | undefined;
  tabDescription: string = 'tabDescription';
  tabVideos: string = 'tabVideos';
  searchString?: string;

  // Error conditions. Set to true to display the appropriate error message.
  notFound : boolean = false; // tried and failed to find a media item

  @ViewChild('channelSearchInput') channelSearchInput?: ElementRef;
  @ViewChild('channelSearchInputSmall') channelSearchInputSmall?: ElementRef;

  constructor(private lbryService : LbryService, private route : ActivatedRoute, private router : Router) { }

  getAndShowChannel(channelUriEncoded: string) {
    this.lbryService.getChannel(channelUriEncoded)
      .subscribe({
        next: (channel) => {
          this.channel = channel
          this.updateUrl(channel.canonicalUri)
        },
        error: (error) => {
          if (error.type === LbryServiceError.NotFound) {
            this.notFound = true
          } else {
            console.error("getAndShowChannel: there was an error!", error);
          }
        },
      });
  }

  updateUrl(canonicalUri : string): void {
    // Check the validity of the uri before setting the URL bar to it.
    // Who knows, maybe the API sent us something funny.
    if(checkChannelUri(canonicalUri)) {
      this.router.navigateByUrl(canonicalUri);
    }
  }

  ngOnInit(): void {
    const channelUriEncoded = this.route.snapshot.paramMap.get('channelUriEncoded')
    this.tab = this.tabVideos

    if (channelUriEncoded) {
      this.getAndShowChannel(channelUriEncoded)
    } else {
      // I think the router will prevent this case, but the type system forces me to make
      // this if statement. In case the type system is right, I'm putting this here.
      this.notFound = true
    }
  }

  doSearch(): void {
    // TODO - I have to make this.channelSearchInput possibly undefined for lack of
    // initialization value, but from the StackOverflow example it didn't seem like
    // I would: https://stackoverflow.com/a/48226955
    if (this.channelSearchInput) {
      this.searchString = this.channelSearchInput.nativeElement.value
    }
  }

  doSearchSmall(): void {
    // TODO - I have to make this.channelSearchInput possibly undefined for lack of
    // initialization value, but from the StackOverflow example it didn't seem like
    // I would: https://stackoverflow.com/a/48226955
    if (this.channelSearchInputSmall) {
      this.searchString = this.channelSearchInputSmall.nativeElement.value
    }
  }

}
