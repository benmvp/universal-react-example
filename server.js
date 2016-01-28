import express from 'express';
import http from 'http';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import { routes } from './routes';

const app = express();

app.use(express.static('public'));

app.set('view engine', 'ejs');

app.get('*', (req, res) => {
    // routes is our object of React routes defined above
    match({ routes, location: req.url }, (err, redirectLocation, props) => {
        if (err) {
            // something went badly wrong, so 500 with a message
            res.status(500).send(err.message);
            console.error(err.message);
        } else if (redirectLocation) {
            // we matched a ReactRouter redirect, so redirect from the server
            let redirectPath = redirectLocation.pathname + redirectLocation.search;
            res.redirect(302, redirectPath);
            console.debug(`Redirecting to ${redirectPath}`)
        } else if (props) {
            // if we got props, that means we found a valid component to render
            // for the given route
            const markup = renderToString(<RouterContext {...props} />);

            // render `index.ejs`, but pass in the markup we want it to display
            res.render('index', { markup });
            console.log(`Successfully rendering route for ${req.url}`)
        } else {
            // no route match, so 404
            // TODO: custom 404 view here
            res.sendStatus(404);
            console.log(`Route not found for ${req.url}`);
        }
    });
});

const server = http.createServer(app);

server.listen(3003);
server.on('listening', () => {
    console.log('Listening on 3003');
});
