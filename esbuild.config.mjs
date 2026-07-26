// esbuild configuration
// Bundles js/main.js (ES6 modules) into script.js (browser-ready)

import * as esbuild from 'esbuild';

const isWatch = process.argv.includes('--watch');

const buildOptions = {
    entryPoints: ['js/main.js'],
    bundle: true,
    outfile: 'script.js',
    format: 'iife',
    platform: 'browser',
    target: ['es2020'],
    minify: false,
    sourcemap: true,
    logLevel: 'info',
    metafile: true,
};

if (isWatch) {
    const ctx = await esbuild.context(buildOptions);
    await ctx.watch();
    console.log('Watching for changes...');
} else {
    const result = await esbuild.build(buildOptions);
    if (result.metafile) {
        const text = await esbuild.analyzeMetafile(result.metafile, { verbose: false });
        console.log(text);
    }
    console.log('Build complete: script.js');
}