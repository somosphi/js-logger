import traverse from 'traverse';
import { RedactClass } from '../types';

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
      return regex.test(str);
    });
  }

  value(str: string): boolean {
    return this.values.some((regex: RegExp) => {
      return regex.test(str);
    });
  }

  map(obj: unknown): unknown {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;
    // eslint-disable-next-line array-callback-return
    return traverse(obj).map(function _nameless(value): void {
      if (self.key(this.key || '') || self.value(value)) {
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
