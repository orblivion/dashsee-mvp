import { TestBed } from '@angular/core/testing';

import { checkMediaUri, checkChannelUri } from './lbry-uris';

describe('lbry-uris.ts', () => {
  describe('checkMediaUri', () => {
    it('returns true for valid uris', () => {
      expect(checkMediaUri('@a/b')).toBeTrue()
      expect(checkMediaUri('@a:1/b')).toBeTrue()
      expect(checkMediaUri('@a/b:2')).toBeTrue()
      expect(checkMediaUri('@a:1/b:2')).toBeTrue()

      // Omitting channel, no @
      expect(checkMediaUri('b')).toBeTrue()
      expect(checkMediaUri('b:2')).toBeTrue()
    });

    it('returns false for invalid uris', () => {
      expect(checkMediaUri('')).toBeFalse()
      expect(checkMediaUri('/')).toBeFalse()
      expect(checkMediaUri('@a/')).toBeFalse()
      expect(checkMediaUri('@a/b/')).toBeFalse()
      expect(checkMediaUri('@a/b/c')).toBeFalse()
      expect(checkMediaUri('@a:/b')).toBeFalse()
      expect(checkMediaUri('@a/b:')).toBeFalse()

      // Too many colons
      expect(checkMediaUri('@a:1:3/b')).toBeFalse()
      expect(checkMediaUri('@a/b:2:4')).toBeFalse()
      expect(checkMediaUri('b:2:4')).toBeFalse()

      // Missing @ with two segments
      expect(checkMediaUri('a/b')).toBeFalse()
      expect(checkMediaUri('a:1/b:2')).toBeFalse()
    });
  });

  describe('checkChannelUri', () => {
    it('returns true for a valid uris', () => {
      expect(checkChannelUri('@a')).toBeTrue()
      expect(checkChannelUri('@a:1')).toBeTrue()
    });

    it('returns false for invalid uris', () => {
      expect(checkChannelUri('a')).toBeFalse()
      expect(checkChannelUri('@a:1/b:2')).toBeFalse()
      expect(checkChannelUri('@a:1:3')).toBeFalse()
    });
  });
});
