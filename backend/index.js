const fs = require('fs');
const util = require('util');
const express = require('express');
const cors = require('cors');

const linksFile = "links.json";

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const createLinkRepository = async () => {
    const links = await readFile(linksFile)
        .then(
            (data) => JSON.parse(data),
            () => [],
        );

    let repository = {};
    repository.links = links;

    repository.createLink = async (link) => {
        repository.links.push(link);

        await writeFile(linksFile, JSON.stringify(links));
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

    const port = 3000;
    app.listen(port, () => console.log(`Linkshare app listening on port ${port}!`))
});
