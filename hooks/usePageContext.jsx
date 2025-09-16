import React, { useContext } from 'react';
import { getGlobalObject } from '@helpers';

const globalObject = getGlobalObject('PageContextProvider.ts', {
  reactContext: React.createContext(undefined),
});
function PageContextProvider({ pageContext, children }) {
  const { reactContext } = globalObject;
  return <reactContext.Provider value={pageContext}>{children}</reactContext.Provider>;
}

function usePageContext() {
  const { reactContext } = globalObject;
  return useContext(reactContext);
}

export { usePageContext, PageContextProvider };
