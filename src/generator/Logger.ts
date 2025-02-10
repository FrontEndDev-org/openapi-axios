/* eslint-disable no-console */
import type { GeneratingStage, GeneratorEmits } from './types';
import path from 'node:path';
import chalk from 'chalk';

const stateOrders: Record<GeneratingStage, number> = {
  reading: 1,
  printing: 2,
  writing: 3,
  generated: 4,
};

export class Logger {
  pipeStartEvent(...[payload]: GeneratorEmits['start']) {
    console.log(chalk.magenta('▶'), `即将处理 ${payload.count} 个 openAPI 文档`);
  }

  pipeProcessEvent(...[payload]: GeneratorEmits['process']) {
    const width = payload.count.toString().length;
    const step = (payload.index + 1).toString().padStart(width, '0');
    const order = stateOrders[payload.stage];

    console.log(
      chalk.magenta('▷'),
      chalk.yellow(`[${step}/${payload.count}]`),
      chalk.cyan(`<${payload.name}>`),
      payload.stage,
      chalk.green(payload.stage === 'generated' ? path.relative(payload.options.cwd, payload.file) : ''),
    );
  }

  pipeEndEvent(...[payload]: GeneratorEmits['end']) {
    console.log(chalk.magenta('■'), chalk.green('处理完成'));
  }

  pipeErrorEvent(...[err]: GeneratorEmits['error']) {
    console.log(chalk.magenta('●'), '处理失败');
    console.log(chalk.red(err.message));
  }

  pipeConfigError(err: Error) {
    console.log(chalk.magenta('○'), '配置错误');
    console.log(chalk.red(err.message));
  }
}
