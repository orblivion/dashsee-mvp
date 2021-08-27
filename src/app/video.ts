export interface VideoNew {
  channelName: string | undefined;

  title: string;
  thumbnailUrl: string;
  description: string | undefined;

  confirmedUri: string;
  canonicalUri: string;
}
