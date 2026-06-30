import Birrjs from '@birrjs/core';
import { env } from './env.js';

export const birrjs = new Birrjs({
  secretKey: env.birrjsSecretKey,
})
