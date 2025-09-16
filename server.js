import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderPage } from 'vike/server';
import fastify from 'fastify';
import { createHandler } from '@universal-middleware/fastify';
import fastifyMiddie from '@fastify/middie';
import fastifyStatic from '@fastify/static';
import { createDevMiddleware } from 'vike';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = __dirname;
const host = '127.0.0.1';
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const hmrPort = process.env.HMR_PORT ? parseInt(process.env.HMR_PORT, 10) : 24678;

class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

const vikeHandler = () => async (request, context, runtime) => {
  const pageContextInit = {
    ...context,
    ...runtime,
    urlOriginal: request.url,
    headersOriginal: request.headers,
  };
  const pageContext = await renderPage(pageContextInit);
  const response = pageContext.httpResponse;

  const { readable, writable } = new TransformStream();
  response.pipe(writable);

  return new Response(readable, {
    status: response.statusCode,
    headers: response.headers,
  });
};

const app = fastify({ logger: true });

app.removeAllContentTypeParsers();
app.addContentTypeParser('*', (_request, _payload, done) => {
  done(null, '');
});

await app.register(fastifyMiddie);

if (process.env.NODE_ENV === 'production') {
  await app.register(fastifyStatic, {
    root: `${root}/dist/client`,
    wildcard: false,
  });
}

if (process.env.NODE_ENV === 'development') {
  const viteDevMiddleware = (
    await createDevMiddleware({
      root,
      viteConfig: {
        server: { hmr: { port: hmrPort } },
      },
    })
  ).devMiddleware;
  app.use(viteDevMiddleware);
}

app.all('/*', createHandler(vikeHandler)());

app.setErrorHandler((error, _request, reply) => {
  console.error(error);

  return reply.code(error.statusCode).send({
    success: false,
    message: error.message || 'Internal Server Error',
    method: _request.method,
    url: _request.url,
    timestamp: new Date().toISOString(),
  });
});

app.listen({ host, port }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening on ${address}`);
});
