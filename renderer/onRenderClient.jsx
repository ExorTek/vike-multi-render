export { onRenderClient };

import { hydrateRoot, createRoot } from 'react-dom/client';
import { getHeadSetting, callCumulativeHooks, applyHeadSettings, resolveReactOptions } from '@helpers';
import getPageElement from './getPageElement.jsx';

const APP_ID = import.meta.env.PUBLIC_ENV__APP_ID || 'root';

let root;
const onRenderClient = async pageContext => {
  pageContext._headAlreadySet = pageContext.isHydration;

  // Use case:
  // - Store hydration https://github.com/vikejs/vike-react/issues/110
  await callCumulativeHooks(pageContext.config.onBeforeRenderClient, pageContext);

  const { page, renderPromise } = getPageElement(pageContext);
  pageContext.page = page;

  const container = document.getElementById(APP_ID);
  const { hydrateRootOptions, createRootOptions } = resolveReactOptions(pageContext);
  if (
    pageContext.isHydration &&
    // Whether the page was [Server-Side Rendered](https://vike.dev/ssr).
    container.innerHTML !== ''
  ) {
    // First render while using SSR, i.e. [hydration](https://vike.dev/hydration)
    root = hydrateRoot(container, page, hydrateRootOptions);
  } else {
    if (!root) {
      // First render without SSR
      root = createRoot(container, createRootOptions);
    }
    root.render(page);
  }
  pageContext.root = root;

  await renderPromise;

  if (!pageContext.isHydration) {
    pageContext._headAlreadySet = true;
    applyHead(pageContext);
  }

  await callCumulativeHooks(pageContext.config.onAfterRenderClient, pageContext);
};

function applyHead(pageContext) {
  const title = getHeadSetting('title', pageContext);
  const lang = getHeadSetting('lang', pageContext);
  applyHeadSettings(title, lang);
}

export default onRenderClient;
