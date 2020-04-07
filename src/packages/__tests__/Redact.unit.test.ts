import Redact from '../Redact';

describe('Redact', () => {
  test('redact.key true', async () => {
    const redact = new Redact();
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
    const redact = new Redact();
    expect(redact.key('passport')).toBeFalsy();
    expect(redact.key('copenhagen')).toBeFalsy();
    expect(redact.key('api*key')).toBeFalsy();
  });

  test('redact.key false', async () => {
    const redact = new Redact();
    expect(redact.key('passport')).toBeFalsy();
    expect(redact.key('copenhagen')).toBeFalsy();
    expect(redact.key('api*key')).toBeFalsy();
  });

  test('redact.key false', async () => {
    const redact = new Redact();
    expect(redact.key('passport')).toBeFalsy();
    expect(redact.key('copenhagen')).toBeFalsy();
    expect(redact.key('api*key')).toBeFalsy();
  });

  test('redact.key whitelist true', async () => {
    const redact = new Redact();
    redact.addWhitelist('authorizationInfo');

    expect(redact.key('authorization')).toBeTruthy();
  });

  test('redact.key whitelist false', async () => {
    const redact = new Redact();
    redact.addWhitelist('authorizationInfo');

    expect(redact.key('authorizationInfo')).toBeFalsy();
  });

  test('redact.value credt card number', () => {
    const redact = new Redact();
    expect(redact.value('1234 1234 1234 1234')).toBeTruthy();
    expect(redact.value('1234-1234-1234-1234')).toBeTruthy();
    expect(redact.value('1234123412341234')).toBeTruthy();
  });

  test('redact.value false', () => {
    const redact = new Redact();
    expect(redact.value('foobar')).toBeFalsy();
  });


  test('redact.map', async () => {
    const redact = new Redact();

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
