/* eslint-disable */

import { createProxyMiddleware } from 'http-proxy-middleware';
import getConfig from 'next/config';

const { publicRuntimeConfig }= getConfig();
// Create proxy instance outside of request handler function to avoid unnecessary re-creation
const apiProxy = createProxyMiddleware({
  target: publicRuntimeConfig.BFF_BASE_URL,
  changeOrigin: true,
  pathRewrite: { [`^/api/proxy`]: '/api/' },
  secure: false,
});

export default function (req, res)  {
  apiProxy(req, res, (result) => {
      if (result instanceof Error) {
          throw result;
      }

      throw new Error(`Request '${req.url}' is not proxied! We should never reach here!`);
  });
}

/* eslint-enable */