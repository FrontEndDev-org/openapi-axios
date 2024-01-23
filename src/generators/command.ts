import fs from 'fs';
import path from 'path';
import process from 'process';
import { tryFlatten } from 'try-flatten';
import { z } from 'zod';
import { Generator } from './Generator';
import { Logger } from './Logger';
import type { GeneratorOptions } from './types';

export function defineConfig(options: GeneratorOptions): GeneratorOptions {
    return options;
}

export const configFileNameOrder = [
    //
    'openapi.config.cjs',
    'openapi.config.js',
];

export function resolveConfigFile(cwd: string) {
    for (const fileName of configFileNameOrder.values()) {
        const filePath = path.join(cwd, fileName);

        if (fs.existsSync(filePath)) {
            return filePath;
        }
    }
}

export function resolveConfig(cwd: string): GeneratorOptions {
    const configFile = resolveConfigFile(cwd);

    if (!configFile) {
        throw new Error(`配置文件未找到，配置文件可以是 ${configFileNameOrder.join('、')} 之一`);
    }

    const configFileName = path.relative(cwd, configFile);

    const [err, config] = tryFlatten(() => {
        delete require.cache[require.resolve(configFile)];
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        return require(configFile) as GeneratorOptions;
    });

    if (err) {
        throw err;
    }

    const schema = z
        .object({
            cwd: z.string(),
            dest: z.string(),
            openAPIs: z
                .array(
                    z.object({
                        name: z.string(),
                        document: z.union([z.object({}), z.string()]),
                    }),
                )
                .min(1),
        })
        .partial({
            cwd: true,
            dest: true,
        });
    const result = schema.safeParse(config);

    if (result.success) return config;

    if (result.error.isEmpty) return config;

    const firstIssue = result.error.issues[0];

    if (!firstIssue) return config;

    throw new Error(`${configFileName}: #/${firstIssue.path.join('/')} - ${firstIssue.message}`);
}

export async function run(cwd = process.cwd()) {
    const logger = new Logger();
    const [err, config] = tryFlatten(() => resolveConfig(cwd));

    if (err) return logger.pipeConfigError(err);

    config.cwd = config.cwd || cwd;
    const generator = new Generator(config);

    generator.on('start', logger.pipeStartEvent);
    generator.on('end', logger.pipeEndEvent);
    generator.on('error', logger.pipeErrorEvent);
    generator.on('process', logger.pipeProcessEvent);

    await tryFlatten(generator.generate());
}
