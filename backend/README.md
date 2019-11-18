backend for Linksharer app
==========================

This is a simple backend for the Linksharer app, built using express.js. It
uses json files for persistance. To get started, run:

    npm install
    node index.js

It supports the following calls:

 * GET /link - a list of links
 * POST /link with a json object as payload - create a new link
 * GET /link/:id - retrieve a single link along with the comments on that link
 * DELETE /link/:id - delete a link and the comments of that link
 * POST /link/:id/comment with a json object as payload - create a new comment

The link entity has the following structure:

    {
        "href": "https://www.google.com",
        "title": "Google",
        "user": "emil",
        "id": "275ceefb-3704-4fd0-9e7a-af7326282184"
    }

When creating a new link, all fields but `id` are required.

The comment entity looks as follows:

    {
        "user": "emil",
        "message": "epic",
        "id": "0dd619ae-3ae4-4d25-bdf6-12b21bcec55c",
        "linkId": "275ceefb-3704-4fd0-9e7a-af7326282184"
    }

To create a new comment, the `user` and `message` fields must be present.
