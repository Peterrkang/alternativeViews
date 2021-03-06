import express from "express";
import cors from "cors";
import React from "react";
import serialize from "serialize-javascript";
import { renderToString } from "react-dom/server";
import { matchPath, StaticRouter } from "react-router-dom";

import App from "../shared/App";
import routes from "../shared/routes";
import ContextProvider from "../shared/ContextProvider";

const app = express();

app.use(cors());

app.use(express.static("public"));

app.get("*", (req, res, next) => {
  const activeRoute = routes.find(route => matchPath(req.url, route)) || {};

  const promise = activeRoute.fetchInitialData
    ? activeRoute.fetchInitialData(req.path)
    : Promise.resolve();

  promise
    .then(data => {
      const css = new Set();
      const cssContext = {
        insertCss: (...styles) =>
          styles.forEach(style => css.add(style._getCss()))
      };
      const context = { data };
      const markup = renderToString(
        <StaticRouter location={req.url} context={context}>
          <ContextProvider cssContext={cssContext}>
            <App />
          </ContextProvider>
        </StaticRouter>
      );

      res.send(
        `<!DOCTYPE html>
        <html>
            <head>
                <title>Views</title>
                <link rel="stylesheet" href="https://unpkg.com/react-rangeslider/umd/rangeslider.min.css" />
                <link rel="stylesheet" type="text/css" charset="UTF-8" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css" />
                <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css" />
            </head>
            <body>
                <script src="/bundle.js" defer></script>
                <script>window.__INITIAL_DATA__ = ${serialize(data)}</script>
                <style type="text/css">${[...css].join("")}</style>
                <div id='app'>${markup}</div>
            </body>
        </html>`
      );
    })
    .catch(next);
});

app.listen(3000, () => {
  console.log(`Server is listening on port 3000`);
});
