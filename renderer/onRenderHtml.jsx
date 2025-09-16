import React from 'react';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import { renderToStream } from 'react-streaming/server';
import { dangerouslySkipEscape, escapeInject } from 'vike/server';
import { PageContextProvider } from '@hooks';
import {
  getHeadSetting,
  isReactElement,
  getTagAttributesString,
  callCumulativeHooks,
  resolveReactOptions,
  isNotNullish,
  isObject,
  isType,
} from '@helpers';
import getPageElement from './getPageElement.jsx';

const APP_ID = import.meta.env.PUBLIC_ENV__APP_ID || 'root';

addEcosystemStamp();

const onRenderHtml = async pageContext => {
  await renderPageToHtml(pageContext);

  const headHtml = getHeadHtml(pageContext);
  const { bodyHtmlBegin, bodyHtmlEnd } = await getBodyHtmlBoundary(pageContext);
  const { htmlAttributesString, bodyAttributesString } = getTagAttributes(pageContext);

  delete pageContext._configFromHook;

  let pageHtmlStringOrStream = '';
  if (pageContext.pageHtmlString) {
    pageHtmlStringOrStream = dangerouslySkipEscape(pageContext.pageHtmlString);
  }
  if (pageContext.pageHtmlStream) {
    pageHtmlStringOrStream = pageContext.pageHtmlStream;
  }

  return escapeInject`<!DOCTYPE html>
    <html${dangerouslySkipEscape(htmlAttributesString)}>
      <head>
        <meta charset="UTF-8" />
        ${headHtml}
      </head>
      <body${dangerouslySkipEscape(bodyAttributesString)}>
        ${bodyHtmlBegin}
        <div id="${APP_ID}">${pageHtmlStringOrStream}</div>
        ${bodyHtmlEnd}
      </body>
    </html>`;
};

async function renderPageToHtml(pageContext) {
  if (pageContext.Page) pageContext.page = getPageElement(pageContext).page;

  await callCumulativeHooks(pageContext.config.onBeforeRenderHtml, pageContext);

  const { renderToStringOptions } = resolveReactOptions(pageContext);

  if (pageContext.page) {
    const streamSetting = resolveStreamSetting(pageContext);
    if (!streamSetting.enable && !streamSetting.require) {
      const pageHtmlString = renderToString(pageContext.page, renderToStringOptions);
      pageContext.pageHtmlString = pageHtmlString;
    } else {
      const pageHtmlStream = await renderToStream(pageContext.page, {
        webStream: !streamSetting.type ? undefined : streamSetting.type === 'web',
        userAgent:
          pageContext.headers?.['user-agent'] ||
          // eski uyumluluk için
          pageContext.userAgent,
        disable: streamSetting.enable === false ? true : undefined,
      });
      pageContext.pageHtmlStream = pageHtmlStream;
    }
  }

  await callCumulativeHooks(pageContext.config.onAfterRenderHtml, pageContext);
}

function getHeadHtml(pageContext) {
  pageContext._headAlreadySet = true;

  const favicon = getHeadSetting('favicon', pageContext);
  const title = getHeadSetting('title', pageContext);
  const description = getHeadSetting('description', pageContext);
  const image = getHeadSetting('image', pageContext);

  const faviconTag = !favicon ? '' : escapeInject`<link rel="icon" href="${favicon}" />`;
  const titleTags = !title ? '' : escapeInject`<title>${title}</title><meta property="og:title" content="${title}" />`;
  const descriptionTags = !description
    ? ''
    : escapeInject`<meta name="description" content="${description}" /><meta property="og:description" content="${description}" />`;
  const imageTags = !image
    ? ''
    : escapeInject`<meta property="og:image" content="${image}"><meta name="twitter:card" content="summary_large_image">`;
  const viewportTag = dangerouslySkipEscape(getViewportTag(getHeadSetting('viewport', pageContext)));

  const headElementsHtml = dangerouslySkipEscape(
    [...(pageContext.config.Head ?? []), ...(pageContext._configFromHook?.Head ?? [])]
      .filter(Head => Head !== null && Head !== undefined)
      .map(Head => getHeadElementHtml(Head, pageContext))
      .join('\n'),
  );

  const headHtml = escapeInject`
    ${titleTags}
    ${viewportTag}
    ${headElementsHtml}
    ${faviconTag}
    ${descriptionTags}
    ${imageTags}
  `;
  return headHtml;
}

function getHeadElementHtml(Head, pageContext) {
  let headElement;
  if (isReactElement(Head)) {
    headElement = Head;
  } else {
    headElement = (
      <PageContextProvider pageContext={pageContext}>
        <Head />
      </PageContextProvider>
    );
  }
  if (pageContext.config.reactStrictMode !== false) {
    headElement = <React.StrictMode>{headElement}</React.StrictMode>;
  }
  return renderToStaticMarkup(headElement);
}

function getTagAttributes(pageContext) {
  let lang = getHeadSetting('lang', pageContext);
  if (lang === undefined) lang = 'en';

  const bodyAttributes = mergeTagAttributesList(getHeadSetting('bodyAttributes', pageContext));
  const htmlAttributes = mergeTagAttributesList(getHeadSetting('htmlAttributes', pageContext));

  const bodyAttributesString = getTagAttributesString(bodyAttributes);
  const htmlAttributesString = getTagAttributesString({
    ...htmlAttributes,
    lang: lang ?? htmlAttributes.lang,
  });

  return { htmlAttributesString, bodyAttributesString };
}

function mergeTagAttributesList(tagAttributesList = []) {
  const tagAttributes = {};
  tagAttributesList.forEach(tagAttrs => Object.assign(tagAttributes, tagAttrs));
  return tagAttributes;
}

function getViewportTag(viewport) {
  if (viewport === 'responsive' || viewport === undefined) {
    return '<meta name="viewport" content="width=device-width,initial-scale=1">';
  }
  if (typeof viewport === 'number') {
    return `<meta name="viewport" content="width=${viewport}">`;
  }
  return '';
}

function addEcosystemStamp() {
  const g = globalThis;
  g._isVikeReactApp = {};
}

async function getBodyHtmlBoundary(pageContext) {
  const bodyHtmlBegin = dangerouslySkipEscape(
    (await callCumulativeHooks(pageContext.config.bodyHtmlBegin, pageContext)).join(''),
  );
  const bodyHtmlEnd = dangerouslySkipEscape(
    (await callCumulativeHooks(pageContext.config.bodyHtmlEnd, pageContext)).join(''),
  );
  return { bodyHtmlBegin, bodyHtmlEnd };
}

function resolveStreamSetting(pageContext) {
  const { stream, streamIsRequired } = pageContext.config;
  const streamSetting = {
    type: null,
    enable: null,
    require: streamIsRequired ?? false,
  };
  stream
    ?.reverse()
    .filter(isNotNullish)
    .forEach(setting => {
      if (typeof setting === 'boolean') {
        streamSetting.enable = setting;
        return;
      }
      if (typeof setting === 'string') {
        streamSetting.type = setting;
        streamSetting.enable = true;
        return;
      }
      if (isObject(setting)) {
        if (setting.enable !== null) streamSetting.enable = setting.enable ?? true;
        if (setting.require !== undefined) streamSetting.require = setting.require;
        if (setting.type !== undefined) streamSetting.type = setting.type;
        return;
      }
      isType(setting);
      throw new Error(`Unexpected +stream value ${setting}`);
    });
  return streamSetting;
}

export default onRenderHtml;
