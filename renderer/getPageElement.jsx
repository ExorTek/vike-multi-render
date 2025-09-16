import React, { Suspense, useEffect } from 'react';
import { PageContextProvider } from '@hooks';

function getPageElement(pageContext) {
  const {
    Page,
    config: { Loading },
  } = pageContext;
  let page = Page ? <Page /> : null;

  // Wrapping
  const addSuspense = el => {
    if (!Loading?.layout) return el;
    return <Suspense fallback={<Loading.layout />}>{page}</Suspense>;
  };
  page = addSuspense(page);
  [
    // Inner wrapping
    ...(pageContext.config.Layout || []),
    // Outer wrapping
    ...(pageContext.config.Wrapper || []),
  ].forEach(Wrap => {
    page = <Wrap>{page}</Wrap>;
    page = addSuspense(page);
  });

  page = <PageContextProvider pageContext={pageContext}>{page}</PageContextProvider>;

  let renderPromiseResolve;
  let renderPromise = new Promise(r => (renderPromiseResolve = r));
  page = <RenderPromiseProvider renderPromiseResolve={renderPromiseResolve}>{page}</RenderPromiseProvider>;

  if (pageContext.config.reactStrictMode !== false) {
    page = <React.StrictMode>{page}</React.StrictMode>;
  }

  return { page, renderPromise };
}

function RenderPromiseProvider({ children, renderPromiseResolve }) {
  useEffect(renderPromiseResolve);
  return children;
}

export default getPageElement;
