import traverse from 'traverse';
import * as R from 'ramda';
import { RedactClass } from '../../types';

const KEYS: RegExp[] = [
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
  /admin[-._]?key/i,
];

const VALUES: RegExp[] = [
  /^\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}$/, // credit card number
];

/**
 * @see https://github.com/watson/redact-secrets
 */
class Redact implements RedactClass {
  keys: RegExp[];
  values: RegExp[];
  whitelist: string[];
  redacted: string;
  private _isActive: boolean;

  constructor(redacted = '[REDACTED]') {
    this._isActive = true;
    this.keys = [...KEYS];
    this.values = [...VALUES];
    this.whitelist = [];
    this.redacted = redacted;
  }

  protected key(str: string): boolean {
    const el = String(str);

    return this.keys.some((regex: RegExp) => {
      if (!this._isActive || this.whitelist.includes(el)) {
        return false;
      }

      return regex.test(el);
    });
  }

  protected value(str: string): boolean {
    const el = String(str);

    return this.values.some((regex: RegExp) => {
      return regex.test(el);
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

  addToWhitelist(key: string): void {
    this.whitelist.push(key);
  }

  addValue(value: RegExp): void {
    this.values.push(value);
  }

  deactivate(): void {
    this._isActive = false;
  }

  activate(): void {
    this._isActive = true;
  }
}

export default Redact;
