import Redact from '../Redact';

class RedactExt extends Redact {
  key(v: string): boolean {
    return super.key(v);
  }

  value(v: string): boolean {
    return super.value(v);
  }
}

describe('Redact', () => {
  describe('# key', () => {
    test('redact.key true', async () => {
      const redact = new RedactExt();
      expect(redact.key('pass')).toBeTruthy();
      expect(redact.key('password')).toBeTruthy();
      expect(redact.key('api-key')).toBeTruthy();
      expect(redact.key('api.key')).toBeTruthy();
      expect(redact.key('api_key')).toBeTruthy();
      expect(redact.key('apikey')).toBeTruthy();
      expect(redact.key('adminKey')).toBeTruthy();
      expect(redact.key('authorization')).toBeTruthy();
    });

    test('redact.key false', async () => {
      const redact = new RedactExt();
      expect(redact.key('passport')).toBeFalsy();
      expect(redact.key('copenhagen')).toBeFalsy();
      expect(redact.key('api*key')).toBeFalsy();
    });

    test('redact.key false', async () => {
      const redact = new RedactExt();
      expect(redact.key('passport')).toBeFalsy();
      expect(redact.key('copenhagen')).toBeFalsy();
      expect(redact.key('api*key')).toBeFalsy();
    });

    test('redact.key false', async () => {
      const redact = new RedactExt();
      expect(redact.key('passport')).toBeFalsy();
      expect(redact.key('copenhagen')).toBeFalsy();
      expect(redact.key('api*key')).toBeFalsy();
    });

    test('redact.key whitelist true', async () => {
      const redact = new RedactExt();
      redact.addToWhitelist('authorizationInfo');

      expect(redact.key('authorization')).toBeTruthy();
    });

    test('redact.key whitelist false', async () => {
      const redact = new RedactExt();
      redact.addToWhitelist('authorizationInfo');

      expect(redact.key('authorizationInfo')).toBeFalsy();
    });
  });

  describe('# value', () => {
    test('redact.value credt card number', () => {
      const redact = new RedactExt();
      expect(redact.value('1234 1234 1234 1234')).toBeTruthy();
      expect(redact.value('1234-1234-1234-1234')).toBeTruthy();
      expect(redact.value('1234123412341234')).toBeTruthy();
    });

    test('redact.value false', () => {
      const redact = new RedactExt();
      expect(redact.value('foobar')).toBeFalsy();
    });
  });

  describe('# map', () => {
    test('redact.map', async () => {
      const redact = new RedactExt();

      const input = {
        foo: 'non-secret',
        secret: 'secret',
        sub1: {
          foo: 'non-secret',
          password: 'secret',
          authorization: 'secret',
        },
        sub2: [{
          foo: 'non-secret',
          token: 'secret',
        }],
      };

      const expected = {
        foo: 'non-secret',
        secret: '[REDACTED]',
        sub1: {
          foo: 'non-secret',
          password: '[REDACTED]',
          authorization: '[REDACTED]',
        },
        sub2: [{
          foo: 'non-secret',
          token: '[REDACTED]',
        }],
      };

      const result = redact.map(input);
      expect(result).toMatchObject(expected);
      expect(input).toMatchObject(input);
    });
  });

  describe('# deactivate', () => {
    it('doesn\'t apply the redact', () => {
      const redact = new RedactExt();
      redact.deactivate();

      expect(redact.key('pass')).toBeFalsy();
      expect(redact.key('password')).toBeFalsy();
      expect(redact.key('api-key')).toBeFalsy();
      expect(redact.key('api.key')).toBeFalsy();
      expect(redact.key('api_key')).toBeFalsy();
      expect(redact.key('apikey')).toBeFalsy();
      expect(redact.key('adminKey')).toBeFalsy();
      expect(redact.key('authorization')).toBeFalsy();
      expect(redact.key('passport')).toBeFalsy();
      expect(redact.key('copenhagen')).toBeFalsy();
      expect(redact.key('api*key')).toBeFalsy();
    });
  });

  describe('# activate', () => {
    it('apply the redact', () => {
      const redact = new RedactExt();
      redact.activate();

      expect(redact.key('pass')).toBeTruthy();
      expect(redact.key('password')).toBeTruthy();
      expect(redact.key('api-key')).toBeTruthy();
      expect(redact.key('api.key')).toBeTruthy();
      expect(redact.key('api_key')).toBeTruthy();
      expect(redact.key('apikey')).toBeTruthy();
      expect(redact.key('adminKey')).toBeTruthy();
      expect(redact.key('authorization')).toBeTruthy();
      expect(redact.key('passport')).toBeFalsy();
      expect(redact.key('copenhagen')).toBeFalsy();
      expect(redact.key('api*key')).toBeFalsy();
    });
  });
});
