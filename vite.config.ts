import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig, UserConfigExport } from 'vite';

export default defineConfig(({ command, mode }) => {
    const defaultConfig: UserConfigExport = {
        plugins: [react()],
        build: {
            sourcemap: 'inline',
        },
    };
    if (command === 'serve') {
        return defaultConfig;
    }
    return {
        ...defaultConfig,
        build: {
            ...defaultConfig.build,
            lib: {
                formats: ['cjs', 'es'],
                entry: path.resolve(__dirname, 'src/index.ts'),
                name: 'nivo-icicles',
                fileName: format => `nivo-icicles.${format}.js`,
            },
            rollupOptions: {
                external: ['react', 'react-dom', '@nivo-core'],
            },
        },
    };
});
