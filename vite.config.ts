import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [react()],
    build: {
        lib: {
            formats: ['cjs', 'es'],
            entry: path.resolve(__dirname, 'src/index.ts'),
            name: 'nivo-sunburst',
            fileName: format => `nivo-sunburst.${format}.js`,
        },
        rollupOptions: {
            external: ['react', 'react-dom', '@nivo-core'],
        },
    },
});
