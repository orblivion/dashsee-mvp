// TODO delete me
export interface Video {
  username: string;
  usernameClaim: string;
  mediaHash: string;
  mediaHashClaim: string;
  name: string;
  description: string;
}


export interface VideoNew {
  channelName: string | undefined;

  title: string;
  thumbnailUrl: string;
  description: string | undefined;

  confirmedUri: string;
  canonicalUri: string;
}
