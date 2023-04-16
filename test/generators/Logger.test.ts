import { Logger } from '../../src/generators/Logger';

test('Logger', async () => {
  const logger = new Logger();

  logger.pipeConfigError(new Error('test error'));

  logger.pipeStartEvent({
    count: 99,
  });

  logger.pipeProcessEvent({
    index: 5,
    count: 99,
    stage: 'parsing',
    filePath: '',
    options: {
      cwd: '',
      dest: '',
      name: 'test',
      document: {
        info: {
          title: 'test',
          version: '1.0.0',
        },
        openapi: '3.0.0',
        paths: {},
      },
    },
  });

  logger.pipeEndEvent({
    count: 99,
  });

  logger.pipeErrorEvent(new Error('test error'), {
    count: 99,
  });

  expect(logger).toBeInstanceOf(Logger);
});
