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
}

module.exports = config;
