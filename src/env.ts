import {
  split,
  pipe,
  propOr,
  map,
  trim,
} from 'ramda';

import { Environment } from '../types';

export const env: Environment = {
  PROJECT_NAME: process.env.PROJECT_NAME || 'logger',
  OMIT_ROUTES: pipe(
    propOr('/status, /info', 'OMIT_ROUTES'),
    split(','),
    map(trim),
  )(process.env),
};
