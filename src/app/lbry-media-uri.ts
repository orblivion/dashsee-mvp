// Is this a valid URI?
export function checkMediaUri(uri: string) {
  // We'll just assume that any string is fine, so long as it's at most
  // one "/" and one ":" in each segment.

  let segments = uri.split('/')

  // can have one or two segments. If two, the first one should be the channel, the second the video.
  if (segments.length > 2 || segments.length < 1) {
    return false;
  }

  // the first segment can be split by at most one ":". what comes after the ":" should be the claim ID.
  if (segments[0].split(':').length > 2) {
    return false;
  }

  // If we have two segments, the second segment should have at most one ":", again splitting name from claim id
  if (segments.length > 1 && segments[1].split(':').length > 2) {
    return false;
  }

  // If we have two segments, the first one is a channel and should have a @
  if (segments.length > 1 && segments[0][0] != '@') {
    return false;
  }

  return true
}
