# ViLO - GRAND Stack

This project is using the [GRAND stack](https://grandstack.io): GraphQL, React, Apollo, Neo4j.

There are three core components in the project:

- `ui` - React web client
- `api` - Apollo GraphQL server, running on Node.js
- `neo4j` - database

[Video: hands on with the GRAND stack](http://www.youtube.com/watch?v=rPC71lUhK_I)

## Some backgound

The core part of this project is the API server. The React app is just a demo and I've had more success with spinning up a Neo4j sandbox than running it locally.

> Why are we using a graph database like Neo4j?

Graph databases are generally a great fit for any scenario where the connections (edges) between nodes is just as important as the nodes themselves, like in a social network.

Considering that ViLO is all about visualizing the connections between learning concepts (so the connections between concepts are super important), Neo4j felt like a perfect fit.

This is what a typical Neo4j CYPHER query and associated visualisation might look like:

![neo4j example query](https://cdn-images-1.medium.com/max/640/1*wIwsGcV9zOJZ2to1UuQn7g.png)

> Learn more about the background of how this project was built (and why we chose this technology stack) here on [Notion](https://www.notion.so/dmeechan/ViLO-b845f695584b43c593db00c3b684c5b9)

## Quickstart

### Docker Compose

We can use `docker-compose` to quickly spin things up.

api/.env:
```
NEO4J_URI=bolt://neo4j:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=letmein
GRAPHQL_LISTEN_PORT=4000
GRAPHQL_URI=http://api:4000
```

Now you can quickly start via:
```
docker-compose up -d
```

If you want to load the example DB after the services have been started:
```
docker-compose run api npm run seedDb
```

### Neo4j

You need a Neo4j instance, e.g. a [Neo4j Sandbox](http://neo4j.com/sandbox), a local instance via [Neo4j Desktop](https://neo4j.com/download), [Docker](http://hub.docker.com/_/neo4j) or a [Neo4j instance on AWS, Azure or GCP](http://neo4j.com/developer/guide-cloud-deployment) or [Neo4j Cloud](http://neo4j.com/cloud)

For schemas using the  `@cypher` directive (as in this repo) via [`neo4j-graphql-js`](https://github.com/neo4j-graphql/neo4j-graphql-js), you need to have the [APOC library](https://github.com/neo4j-contrib/neo4j-apoc-procedures) installed, which should be automatic in Sandbox, Cloud and is a single click install in Neo4j Desktop. If when using the Sandbox / cloud you encounter an issue where an error similar to `Can not be converted to long: org.neo4j.kernel.impl.core.NodeProxy, Location: [object Object], Path: users` appears in the console when running the React app, try installing and using Neo4j locally instead.

#### Sandbox setup
A good tutorial can be found here: https://www.youtube.com/watch?v=rPC71lUhK_I

#### Local setup
1. [Download Neo4j Desktop](https://neo4j.com/download/)
2. Install and open Neo4j Desktop.
3. Create a new DB by clicking "New Graph", and clicking "create local graph".
4. Set password to "letmein" (as suggested by `api/.env`), and click "Create".
5. Make sure that the default credentials in `api/.env` are used. Leave them as follows: `NEO4J_URI=bolt://localhost:7687 NEO4J_USER=neo4j NEO4J_PASSWORD=letmein`
6.  Click "Manage".
7. Click "Plugins".
8. Find "APOC" and click "Install".
9. Click the "play" button at the top of left the screen, which should start the server. _(screenshot 2)_
10. Wait until it says "RUNNING".
11. Proceed forward with the rest of the tutorial.

### [`/api`](./api)

*Install dependencies*

```
(cd ./ui && npm install)
(cd ./api && npm install)
```

*Start API server*
```
cd ./api && npm start
```

### [`/ui`](./ui)

This will start the GraphQL API in the foreground, so in another terminal session start the UI development server:

*Start UI server*
```
cd ./ui && npm start
```
