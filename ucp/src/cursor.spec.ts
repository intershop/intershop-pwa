import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { decodeCursor, encodeCursor } from './cursor';

describe('cursor', () => {
  it('round-trips an offset', () => {
    assert.equal(decodeCursor(encodeCursor(30)), 30);
    assert.equal(decodeCursor(encodeCursor(0)), 0);
  });

  it('defaults to 0 for an absent cursor', () => {
    assert.equal(decodeCursor(undefined), 0);
    assert.equal(decodeCursor(''), 0);
  });

  it('defaults to 0 for a malformed or negative cursor', () => {
    assert.equal(decodeCursor('not-a-number'), 0);
    assert.equal(decodeCursor(encodeCursor(-5)), 0);
  });
});
