import fs from 'fs/promises';

export async function isFile(p: string) {
    try {
        const state = await fs.stat(p);
        return state.isFile();
    } catch (err) {
        return false;
    }
}

export async function cleanDir(p: string) {
    await fs.rm(p, { recursive: true, force: true });
}
