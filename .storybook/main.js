// const react = require('@vitejs/plugin-react');
// const { mergeConfig } = require('vite');


/** @type {import("@storybook/core-common").CoreConfig} */
const config = {
    stories: ['../stories/*.stories.tsx'],
    addons: [
        '@storybook/addon-knobs',
        '@storybook/addon-actions',
        '@storybook/addon-links',
        '@storybook/addon-storysource',
    ],
    framework: '@storybook/react',
    // core: {
    //     builder: "@storybook/builder-vite"
    // },
    // async viteFinal(config, { configType }) {
    //     return mergeConfig(config, {
    //         plugins: [react()],
    //     });
    // }
}

module.exports = config;
