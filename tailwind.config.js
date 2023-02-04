const colors = require('tailwindcss/colors');

module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    // Look to the actual packages too (better than node_modules for pnpm)
    'node_modules/myst-to-react/{src,dist}/**/*.{js,ts,jsx,tsx}',
    'node_modules/myst-demo/{src,dist}/**/*.{js,ts,jsx,tsx}',
    'node_modules/@myst-theme/site/{src,dist}/**/*.{js,ts,jsx,tsx}',
    'node_modules/@myst-theme/frontmatter/{src,dist}/**/*.{js,ts,jsx,tsx}',
    'node_modules/@myst-theme/jupyter/{src,dist}/**/*.{js,ts,jsx,tsx}',
    // Duplicate the above in case this is in a submodule
    '../../packages/myst-to-react/{src,dist}/**/*.{js,ts,jsx,tsx}',
    '../../packages/myst-demo/{src,dist}/**/*.{js,ts,jsx,tsx}',
    '../../packages/site/{src,dist}/**/*.{js,ts,jsx,tsx}',
    '../../packages/frontmatter/{src,dist}/**/*.{js,ts,jsx,tsx}',
    '../../packages/jupyter/{src,dist}/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: colors.blue,
        success: colors.green[500],
      },
      // See https://github.com/tailwindlabs/tailwindcss-typography/blob/master/src/styles.js
      typography: (theme) => ({
        DEFAULT: {
          css: {
            code: {
              fontWeight: '400',
            },
            'code::before': {
              content: '',
            },
            'code::after': {
              content: '',
            },
            'blockquote p:first-of-type::before': { content: 'none' },
            'blockquote p:first-of-type::after': { content: 'none' },
            li: {
              marginTop: '0.25rem',
              marginBottom: '0.25rem',
            },
            'li > p, dd > p, header > p, footer > p': {
              marginTop: '0.25rem',
              marginBottom: '0.25rem',
            },
          },
        },
        invert: {
          css: {
            '--tw-prose-code': theme('colors.pink[500]'),
          },
        },
        stone: {
          css: {
            '--tw-prose-code': theme('colors.pink[600]'),
          },
        },
      }),
      keyframes: {
        load: {
          '0%': { width: '0%' },
          '100%': { width: '50%' },
        },
        fadeIn: {
          '0%': { opacity: 0.0 },
          '25%': { opacity: 0.25 },
          '50%': { opacity: 0.5 },
          '75%': { opacity: 0.75 },
          '100%': { opacity: 1 },
        },
      },
      animation: {
        load: 'load 2.5s ease-out',
        'fadein-fast': 'fadeIn 1s ease-out',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
