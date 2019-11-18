const fs = require('fs');
const util = require('util');
const express = require('express');
const cors = require('cors');
const uuidv4 = require('uuid/v4');

const linksFile = "links.json";
const commentsFile = "comments.json";

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const createLinkRepository = async () => {
    const links = await readFile(linksFile)
        .then(
            (data) => JSON.parse(data),
            () => [],
        );
    const comments = await readFile(commentsFile)
        .then(
            (data) => JSON.parse(data),
            () => [],
        );

    let repository = {};
    repository.links = links;
    repository.comments = comments;

    repository.createLink = async (link) => {
        link.id = uuidv4();
        repository.links.push(link);

        await writeFile(linksFile, JSON.stringify(repository.links));
    };

    repository.deleteLink = async (link) => {
        repository.links = repository.links.filter((current) => current.id !== link.id);
        repository.comments = repository.comments.filter((current) => current.linkId !== link.id);

        await writeFile(linksFile, JSON.stringify(repository.links));
    };

    repository.createComment = async (linkId, comment) => {
        comment.id = uuidv4();
        comment.linkId = linkId;
        repository.comments.push(comment);

        await writeFile(commentsFile, JSON.stringify(repository.comments));
    };

    return repository;
};

createLinkRepository().then((linkRepository) => {
    const app = express();

    app.use(express.json());
    app.use(cors());

    app.get('/link', async (req, res) => {
        res.json(linkRepository.links);
    });

    app.get('/link/:id', async (req, res) => {
        const link = linkRepository.links.find((link) => link.id === req.params.id);
        if (!link) {
            res.status(404).json({ error: "Not Found" });
            return;
        }

        const comments = linkRepository.comments.filter((comment) => comment.linkId === req.params.id);

        res.json({ link, comments });
    });

    app.post('/link', async (req, res) => {
        const newLink = req.body;
        if (!newLink.href) {
            res.json({ error: "Missing href field" });
            return;
        }
        if (!newLink.href.startsWith("http://") && !newLink.href.startsWith("https://")) {
            res.json({ error: "Href field must be a link" });
            return;
        }
        if (!newLink.title) {
            res.json({ error: "Missing title field" });
            return;
        }
        if (!newLink.user) {
            res.json({ error: "Missing user field" });
            return;
        }

        await linkRepository.createLink(newLink);

        res.json(linkRepository.links);
    });

    app.post('/link/:id/comment', async (req, res) => {
        const link = linkRepository.links.find((link) => link.id === req.params.id);
        if (!link) {
            res.status(404).json({ error: "Not Found" });
            return;
        }

        const newComment = req.body;
        if (!newComment.message) {
            res.json({ error: "Missing message field" });
            return;
        }
        if (!newComment.user) {
            res.json({ error: "Missing user field" });
            return;
        }

        await linkRepository.createComment(link.id, newComment);

        res.json(newComment);
    });

    app.delete('/link/:id', async (req, res) => {
        const link = linkRepository.links.find((link) => link.id === req.params.id);
        if (!link) {
            res.status(404).json({ error: "Not Found" });
            return;
        }

        await linkRepository.deleteLink(link);

        res.json(linkRepository.links);
    });

    const port = 3000;
    app.listen(port, () => console.log(`Linkshare app listening on port ${port}!`))
});
