export function checkMediaUri(uri: string) {
  // We'll just assume that any string is fine, so long as it's at most
  // one slash and one colon in each segment.

  let segments = uri.split('/')

  if (segments.length > 2 || segments.length < 1) {
    return false;
  }

  if (segments[0].split(':').length > 2) {
    return false;
  }

  if (segments.length > 1 && segments[1].split(':').length > 2) {
    return false;
  }

  return true
}
