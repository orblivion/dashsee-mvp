export function checkMediaUri(uri: string) {
  // We'll just assume that any string is fine, so long as it's at most
  // one slash and one colon in each segment, and it starts with a @ if
  // there are two segments.

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

  if (segments.length > 1 && segments[0][0] != '@') {
    return false;
  }

  // Make sure there are no empty names or claims
  for(let x = 0; x < segments.length; x++) {
    for(let y = 0; y < segments[x].split(':').length; y++) {
      if (segments[x].split(':')[y].length === 0) {
        return false
      }
    }
  }

  return true
}

export function checkChannelUri(uri: string) {
  // We'll just assume that any string is fine, so long as it's no slashes,
  // at most one colon, and it starts with a @

  let segments = uri.split('/')

  if (segments.length !== 1) {
    return false;
  }

  if (segments[0].split(':').length > 2) {
    return false;
  }

  if (segments[0][0] != '@') {
    return false;
  }

  // Make sure there's not an empty name or claim
  for(let y = 0; y < segments[0].split(':').length; y++) {
    if (segments[0].split(':')[y].length === 0) {
      return false
    }
  }

  return true
}
