export default {
  clientRouting: true,
  hydrationCanBeAborted: true,
  prefetchStaticAssets: 'hover',
  meta: {
    renderMode: {
      env: { config: true },
      effect({ configDefinedAt, configValue }) {
        let env;
        switch (configValue) {
          case 'HTML':
          case 'SSG':
            env = { server: true, client: false };
            break;
          case 'SPA':
            env = { server: false, client: true };
            break;
          case 'SSR':
            env = { server: true, client: true };
            break;
          default:
            throw new Error(`${configDefinedAt} should be 'SSR', 'SPA', 'HTML', or 'SSG'`);
        }
        return {
          meta: {
            Page: { env },
            ...(configValue === 'SSG' && {
              prerender: { env: { config: true } },
            }),

            ...(configValue === 'SSR' && {
              stream: { env: { config: true } },
            }),
          },
        };
      },
    },
  },
};
