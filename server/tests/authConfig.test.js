import test from 'node:test';
import assert from 'node:assert/strict';
import { isGoogleAuthConfigured } from '../utils/authConfig.js';

test('detects Google OAuth as configured when client credentials are present', () => {
  assert.equal(
    isGoogleAuthConfigured({ GOOGLE_CLIENT_ID: 'abc', GOOGLE_CLIENT_SECRET: 'def' }),
    true
  );
});

test('detects Google OAuth as not configured when credentials are missing', () => {
  assert.equal(isGoogleAuthConfigured({}), false);
  assert.equal(isGoogleAuthConfigured({ GOOGLE_CLIENT_ID: 'abc' }), false);
  assert.equal(isGoogleAuthConfigured({ GOOGLE_CLIENT_SECRET: 'def' }), false);
});
