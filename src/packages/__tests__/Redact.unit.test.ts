import Redact from '../Redact';

describe('Redact', () => {
  const redact = new Redact();

  test('redact.key true', async () => {
    expect(redact.key('pass')).toBeTruthy();
    expect(redact.key('password')).toBeTruthy();
    expect(redact.key('api-key')).toBeTruthy();
    expect(redact.key('api.key')).toBeTruthy();
    expect(redact.key('api_key')).toBeTruthy();
    expect(redact.key('apikey')).toBeTruthy();
  });

  test('redact.key false', async () => {
    expect(redact.key('passport')).toBeFalsy();
    expect(redact.key('copenhagen')).toBeFalsy();
    expect(redact.key('api*key')).toBeFalsy();
  });

  test('redact.value credt card number', () => {
    expect(redact.value('1234 1234 1234 1234')).toBeTruthy();
    expect(redact.value('1234-1234-1234-1234')).toBeTruthy();
    expect(redact.value('1234123412341234')).toBeTruthy();
  });

  test('redact.value false', () => {
    expect(redact.value('foobar')).toBeFalsy();
  });


  test('redact.map', async () => {
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
