# ViLO API server using GRAND Stack

This project is using the [GRAND stack](https://grandstack.io): GraphQL, React, Apollo, Neo4j.

There are three core components in the project:

- `api` - Apollo GraphQL server, running on Node.js
- `neo4j` - spin up a local Neo4j database using Docker

[Video: hands on with the GRAND stack](http://www.youtube.com/watch?v=rPC71lUhK_I)

## Some backgound

The core part of this project is the API server.

> Why are we using a graph database like Neo4j?

Graph databases are generally a great fit for any scenario where the connections (edges) between nodes is just as important as the nodes themselves, like in a social network.

Considering that ViLO is all about visualizing the connections between learning concepts (so the connections between concepts are super important), Neo4j felt like a perfect fit.

This is what a typical Neo4j CYPHER query and associated visualisation might look like:

![neo4j example query](https://cdn-images-1.medium.com/max/640/1*wIwsGcV9zOJZ2to1UuQn7g.png)

> Learn more about the background of how this project was built (and why we chose this technology stack) here on [Notion](https://www.notion.so/dmeechan/ViLO-b845f695584b43c593db00c3b684c5b9)

## Schema

![neo4j database schema](https://i.imgur.com/Qx1JRO7.png)

## Getting Started

> Install [Docker Desktop](https://www.docker.com/get-started)

### 🚢 Using Docker Compose

We can use `docker-compose` to quickly spin up the API server and Neo4j database.

`Create an `api/.env` file and populate it with some values:

```
NEO4J_URI=bolt://neo4j:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=letmein
GRAPHQL_LISTEN_PORT=4000
GRAPHQL_URI=http://localhost:4000/graphql
GRAPHQL_CONTAINER_URI=http://api:4000/graphql
```

Now (from the projetc root directory) we can spin up the containers with:

```
make run
```

If you want to populate the DB with sample data after the services have been started:

```
make seed
```

To close the server, run:

```
make stop
```

Need help? Run:

```
make help
```

### 🤺 Manually (without Docker)

If you don't use Docker, you'll need to run your own Neo4j instance, e.g. a [Neo4j Sandbox](http://neo4j.com/sandbox), a local instance via [Neo4j Desktop](https://neo4j.com/download), [Docker](http://hub.docker.com/_/neo4j) or a [Neo4j instance on AWS, Azure or GCP](http://neo4j.com/developer/guide-cloud-deployment) or [Neo4j Cloud](http://neo4j.com/cloud)

For schemas using the `@cypher` directive (as in this repo) via [`neo4j-graphql-js`](https://github.com/neo4j-graphql/neo4j-graphql-js), you need to have the [APOC library](https://github.com/neo4j-contrib/neo4j-apoc-procedures) installed, which should be automatic in Sandbox, Cloud and is a single click install in Neo4j Desktop. If when using the Sandbox / cloud you encounter an issue where an error similar to `Can not be converted to long: org.neo4j.kernel.impl.core.NodeProxy, Location: [object Object], Path: users` appears in the console when running the React app, try installing and using Neo4j locally instead.

#### Sandbox setup

A good tutorial can be found here: https://www.youtube.com/watch?v=rPC71lUhK_I

#### Local setup

1. [Download Neo4j Desktop](https://neo4j.com/download/)
2. Install and open Neo4j Desktop.
3. Create a new DB by clicking "New Graph", and clicking "create local graph".
4. Set password to "letmein" (as suggested by `api/.env`), and click "Create".
5. Make sure that the default credentials in `api/.env` are used. Leave them as follows: `NEO4J_URI=bolt://localhost:7687 NEO4J_USER=neo4j NEO4J_PASSWORD=letmein`
6. Click "Manage".
7. Click "Plugins".
8. Find "APOC" and click "Install".
9. Click the "play" button at the top of left the screen, which should start the server. _(screenshot 2)_
10. Wait until it says "RUNNING".
11. Proceed forward with the rest of the tutorial.

### [`/api`](./api)

_Install dependencies_

```
cd ./api && npm install
```

_Start API server_

```
cd ./api && npm start
```

## 🚀 Deployment

You can deploy to any service that hosts Node.js apps, but [Zeit Now](https://zeit.co/now) is a great easy to use service for hosting your app that has an easy to use free plan for small projects. 

If you use Zeit Now, the `now.json` file defines the configuration for deploying.

First download Now Desktop or Now CLI from [here](https://zeit.co/download).

Next, set the now secrets for your Neo4j instance:

```bash
now secret add NEO4J_URI bolt+routing://<YOUR_NEO4J_INSTANCE_HERE>
now secret add NEO4J_USER <YOUR_DATABASE_USERNAME_HERE>
now secret add NEO4J_PASSWORD <YOUR_DATABASE_USER_PASSWORD_HERE>
```

Run `now` to deploy it.

Once deployed you'll be given a fresh URL that represents the current state of your application where you can access your GraphQL endpoint and GraphQL Playgound. For example: https://some-example.now.sh/