# Render Modes

This project demonstrates different rendering modes using Vike framework.

## Render Modes

### HTML Mode

- **File**: `/pages/html-page/+Page.jsx`
- **Config**: `/pages/html-page/+renderMode.js` (set to `'HTML'`)
- **Description**: Renders HTML on the server without JavaScript hydration
- **Best for**: Static content, blog posts, documentation
- **How it works**: Server renders HTML, no JavaScript shipped to browser

### SPA (Single Page Application) Mode

- **File**: `/pages/spa-page/+Page.jsx`
- **Config**: `/pages/spa-page/+renderMode.js` (set to `'SPA'`)
- **Description**: Renders entirely in the browser
- **Best for**: Admin dashboards, interactive applications
- **How it works**: Server sends empty HTML shell, JavaScript renders everything in browser

### SSR (Server-Side Rendering) Mode

- **File**: `/pages/ssr-page/+Page.jsx`
- **Config**: `/pages/ssr-page/+renderMode.js` (set to `'SSR'`)
- **Description**: Renders on server first, then hydrates in browser
- **Best for**: SEO-critical pages with dynamic content
- **How it works**: Server renders initial HTML, then JavaScript makes it interactive

### SSG (Static Site Generation) Mode

- **File**: `/pages/ssg-page/+Page.jsx`
- **Config**: `/pages/ssg-page/+renderMode.js` (set to `'SSG'`)
- **Description**: Pre-renders pages at build time
- **Best for**: About pages, contact forms, portfolios
- **How it works**: Pages built as static files during build process

## Configuration

### Main Configuration (`/pages/+config.js`)

Sets up render modes with their respective server/client environments and configures global settings.

```javascript
export default {
  clientRouting: true,
  hydrationCanBeAborted: true,
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
          },
        };
      },
    },
  },
};
```

### Per-Page Configuration

Each page can specify its render mode:

```javascript
// pages/example/+renderMode.js
export default 'SSR'; // or 'SPA', 'HTML', 'SSG'
```

## Project Structure

```
pages/
├── +config.js                 # Global configuration
├── home/
│   ├── +Page.jsx
│   └── +renderMode.js         # 'SSR'
├── dashboard/
│   ├── +Page.jsx
│   └── +renderMode.js         # 'SPA'
├── blog/
│   ├── +Page.jsx
│   └── +renderMode.js         # 'HTML'
└── about/
    ├── +Page.jsx
    └── +renderMode.js         # 'SSG'

renderer/
├── +onRenderHtml.jsx          # Server-side rendering
└── +onRenderClient.jsx        # Client-side rendering
```

## When to Use Each Mode

| Mode     | Use Case                        | SEO       | Interactivity | Performance  |
| -------- | ------------------------------- | --------- | ------------- | ------------ |
| **HTML** | Static content, blogs           | Excellent | None          | Fastest      |
| **SPA**  | Admin panels, apps              | Poor      | High          | Slow initial |
| **SSR**  | Public pages with dynamic data  | Excellent | High          | Balanced     |
| **SSG**  | Static pages that change rarely | Excellent | Limited       | Very fast    |

## Learn More

- [Vike Documentation](https://vike.dev)
- [Render Modes Guide](https://vike.dev/render-modes)
