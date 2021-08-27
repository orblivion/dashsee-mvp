export interface Channel {
  handle: string;
  name: string;
  thumbnailUrl: string;
}
export interface Video {
  channel: Channel | undefined;

  title: string;
  thumbnailUrl: string;
  description: string | undefined;

  confirmedUri: string;
  canonicalUri: string;
}
