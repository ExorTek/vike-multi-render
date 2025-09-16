import { providePageContext } from 'vike/getPageContext';
import { isValidElement } from 'react';

const configsCumulative = ['Head', 'bodyAttributes', 'htmlAttributes'];
const vikeProjectKey = '_vike_react';

function getGlobalObject(key, defaultValue) {
  const globalObjectsAll = (globalThis[vikeProjectKey] = globalThis[vikeProjectKey] || {});
  return (globalObjectsAll[key] = globalObjectsAll[key] || defaultValue);
}

function isCallable(thing) {
  return thing instanceof Function || typeof thing === 'function';
}

function getHeadSetting(configName, pageContext) {
  // Set by useConfig()
  const valFromUseConfig = pageContext._configFromHook?.[configName];
  // Set by +configName.js
  const valFromConfig = pageContext.config[configName];

  const getCallable = val => (isCallable(val) ? val(pageContext) : val);
  if (!configsCumulative.includes(configName)) {
    if (valFromUseConfig !== undefined) return valFromUseConfig;
    return getCallable(valFromConfig);
  } else {
    return [...(valFromConfig ?? []).map(getCallable), ...(valFromUseConfig ?? [])];
  }
}

async function callCumulativeHooks(values, pageContext) {
  if (!values) return [];
  const valuesPromises = values.map(val => {
    if (isCallable(val)) {
      providePageContext(pageContext);
      // Hook
      return val(pageContext);
    } else {
      return val;
    }
  });

  return Promise.all(valuesPromises);
}

function applyHeadSettings(title, lang) {
  if (title !== undefined) document.title = title || '';
  if (lang !== undefined) document.documentElement.lang = lang || 'en';
}

function resolveReactOptions(pageContext) {
  const optionsAcc = {};
  (pageContext.config.react ?? []).forEach(valUnresolved => {
    const optionList = isCallable(valUnresolved) ? valUnresolved(pageContext) : valUnresolved;
    if (!optionList) return;

    const optionListEntries = Object.entries(optionList);

    for (const option of optionListEntries) {
      const [fnName, options] = option;
      if (!options) continue;
      optionsAcc[fnName] ??= {};
      for (const [key, val] of Object.entries(options)) {
        if (!isCallable(val)) {
          optionsAcc[fnName][key] ??= val;
        } else {
          const valPrevious = optionsAcc[fnName][key];
          optionsAcc[fnName][key] = (...args) => {
            valPrevious?.(...args);
            val(...args);
          };
        }
      }
    }
  });
  return optionsAcc;
}

const isReactElement = value => isValidElement(value) || Array.isArray(value);

function ensureIsValidAttributeName(str) {
  if (/^[a-z][a-z0-9\-]*$/i.test(str) && !str.endsWith('-')) return str;
  throw new Error(`Invalid HTML tag attribute name ${JSON.stringify(str)}`);
}

function getTagAttributesString(tagAttributes) {
  const tagAttributesString = Object.entries(tagAttributes)
    .filter(([_key, value]) => value !== false && value !== null && value !== undefined)
    .map(([key, value]) => `${ensureIsValidAttributeName(key)}=${JSON.stringify(String(value))}`)
    .join(' ');
  if (tagAttributesString.length === 0) return '';
  return ` ${tagAttributesString}`;
}

function isNullish(val) {
  return val === null || val === undefined;
}

function isNotNullish(p) {
  return !isNullish(p);
}

function isObject(value) {
  return typeof value === 'object' && value !== null;
}

const isType = _ => {};

export {
  configsCumulative,
  vikeProjectKey,
  getHeadSetting,
  getGlobalObject,
  isCallable,
  callCumulativeHooks,
  applyHeadSettings,
  resolveReactOptions,
  isReactElement,
  ensureIsValidAttributeName,
  getTagAttributesString,
  isNullish,
  isNotNullish,
  isObject,
  isType,
};
