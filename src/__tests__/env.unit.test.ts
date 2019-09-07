describe('Env file', () => {
  it('Should have the basic properties', () => {
    const { env } = require('../env');
    expect(env).toBeInstanceOf(Object);
    expect(env.OMIT_ROUTES).toBeDefined();
    expect(env.PROJECT_NAME).toBeDefined();
  });

  it('Should have the default properties values', () => {
    const { env } = require('../env');
    expect(env).toBeInstanceOf(Object);

    expect(env.OMIT_ROUTES).toBeDefined();
    const omitRoutes = env.OMIT_ROUTES;
    expect(omitRoutes).toBeInstanceOf(Array);
    expect(omitRoutes).toEqual(['/status', '/info']);

    expect(env.PROJECT_NAME).toBeDefined();
    const projectName = env.PROJECT_NAME;
    expect(typeof projectName).toEqual('string');
    expect(projectName).toEqual('logger');
  });
});
