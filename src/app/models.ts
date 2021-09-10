export interface Channel {
  handle: string;
  name: string;
  description: string | undefined;
  thumbnailUrl: string | undefined;
  canonicalUri: string;
}

export interface Video {
  channel: Channel | undefined;

  title: string;
  thumbnailUrl: string;
  description: string | undefined;

  confirmedUri: string;
  canonicalUri: string;
}

export interface VideoPage{
  videos: Video[];
  page: number;
  totalPages: number;
}
