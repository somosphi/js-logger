import traverse from 'traverse';
import * as R from 'ramda';
import { RedactClass } from '../../types';

const KEYS = [
  // generic
  /passw(or)?d/i,
  /^pw$/,
  /^pass$/i,
  /secret/i,
  /token/i,
  /authorization/i,
  /api[-._]?key/i,
  /session[-._]?id/i,

  // specific
  /^connect\.sid$/, // https://github.com/expressjs/session
];

const VALUES = [
  /^\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}$/, // credit card number
];

/**
 * @see https://github.com/watson/redact-secrets
 */
class Redact implements RedactClass {
  keys: RegExp[];
  values: RegExp[];
  redacted: string;

  constructor(redacted = '[REDACTED]') {
    this.keys = [...KEYS];
    this.values = [...VALUES];
    this.redacted = redacted;
  }

  key(str: string): boolean {
    return this.keys.some((regex: RegExp) => {
      return regex.test(String(str));
    });
  }

  value(str: string): boolean {
    return this.values.some((regex: RegExp) => {
      return regex.test(String(str));
    });
  }

  map<T>(obj: T): T {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;
    // eslint-disable-next-line array-callback-return
    return traverse<T>(obj).map(function _nameless(value: unknown): void {
      const key: string | null = R.pathOr(null, ['key'], this);

      if (key && self.key(key)) {
        this.update(self.redacted);
        return;
      }

      if (typeof value === 'string' && self.value(value)) {
        this.update(self.redacted);
      }
    });
  }

  addKey(key: RegExp): void {
    this.keys.push(key);
  }

  addValue(value: RegExp): void {
    this.values.push(value);
  }
}

export default Redact;
