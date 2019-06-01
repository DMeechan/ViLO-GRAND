# ViLO Back-end: GraphQL API server

## Architecture

The new ViLO is being built using the [GRAND stack](https://grandstack.io) (GraphQL, React, [Apollo](https://www.apollographql.com/docs/), Neo4j):

- Front-end: [React.js](https://reactjs.org/), communicating with the back-end using [Apollo Client](https://www.apollographql.com/docs/react/)
- Back-end: [Node.js](https://nodejs.org/), hosting a GraphQL API server using [Apollo Server](https://www.apollographql.com/docs/apollo-server/)
- Database: [Neo4j](https://neo4j.com/) - a graph database

> Read 'Some background' below to learn why we chose Neo4j

## Project structure

There are three core directories in the project:

- `api` - GraphQL server, running on Node.js
- `ui` - React web client with some sample queries to demonstate how to get data from the API server
- `neo4j` - contains a file which can be used to run Neo4j locally (using Docker)

[Video: hands on with the GRAND stack](http://www.youtube.com/watch?v=rPC71lUhK_I)

## Recommended Reading

- [Neo4j tutorial](https://neo4j.com/developer/example-project/)
- [GRAND stack tutorial](https://grandstack.io/docs/getting-started-grand-stack-starter.html)

## Some backgound

The core part of this project is the API server. The React app is just a demo and I've had more success with spinning up a Neo4j sandbox than running it locally.

> Why are we using a graph database like Neo4j?

Graph databases are generally a great fit for any scenario where the connections (edges) between nodes is just as important as the nodes themselves, like in a social network.

Considering that ViLO is all about visualizing the connections between learning concepts (so the connections between concepts are super important), Neo4j felt like a perfect fit.

This is what a typical Neo4j CYPHER query and associated visualisation might look like:

![neo4j example query](https://cdn-images-1.medium.com/max/640/1*wIwsGcV9zOJZ2to1UuQn7g.png)

> Learn more about the background of how this project was built (and why we chose this technology stack) here on [Notion](https://www.notion.so/dmeechan/ViLO-b845f695584b43c593db00c3b684c5b9)

## Schema

![neo4j database schema](https://i.imgur.com/8F25xQF.png)

## 💪🏻 Getting Started

In theory, you should not need to perform any Neo4j queries. You should be able to do everything you need using GraphQL queries and mutations (which is much simpler).

But first, we need to get things running. There are two ways to run this:

- 🤺 Manually
- 🚢 Using Docker

When getting started for the first time, I suggest installing things manually so you get a feel for how the various components come together. Later, it may be easier to use Docker.

### 🤺 Manually (without Docker)

#### Overview

1. Install Neo4j
2. Create a database & install the APOC plugin
3. Import our data to the database
4. Launch the database
5. Install Node.js
6. Set up the Node.js server
7. Launch the server
8. Set up the React web client
9. Launch the web client

#### Instructions (step by step)

First, open up Terminal and clone this repisitory by running:

```bash
git clone https://github.com/DMeechan/ViLO-GRAND.git
```

##### Running the Neo4j database

1. [Download Neo4j Desktop](https://neo4j.com/download/)
2. Install and open Neo4j Desktop.
3. Create a new database by clicking "New Graph", and clicking "create local graph".
4. Set password to "letmein" (as suggested by `api/.env`), and click "Create".
5. Make sure that your database's credentials match the credentials in `api/.env`. The default is: `NEO4J_URI=bolt://localhost:7687 NEO4J_USER=neo4j NEO4J_PASSWORD=letmein`
6. Click "Manage" on your database (in Neo4j desktop)
7. Click "Plugins"
8. Find "APOC" and click "Install"
9. Click the "play" button at the top of left the screen, which should start the server
10. Wait until it says "RUNNING"

TODO: import the data somehow

##### Running the server

1. Install Node.js LTS from [here](https://nodejs.org/en/download/)
2. Open up your `ViLO-GRAND` project folder in Terminal
3. Enter the server's folder: `cd api`
4. Create a .env file: `cp example.env .env`
5. Install dependencies: `npm install`
6. Start the Node.js server: `npm run start`

> Make sure you have the Neo4j database running (on port 7687) before starting your Node.js server. Otherwise, you may encounter problems.

##### Running the web client

> You should already have Node.js LTS installed from the steps above. If you do not, install it from [here](https://nodejs.org/en/download/).

1. Open up your `ViLO-GRAND` project folder in Terminal
2. Enter the web client's folder: `cd ui`
3. Create a .env file: `cp example.env .env`
4. Install dependencies: `npm install`
5. Start the web client: `npm run start`

### 🚢 Using Docker

We can use `docker-compose` to quickly spin up the API server and Neo4j database.

1. Install Docker Desktop from [here](https://www.docker.com/products/docker-desktop) (this installs both Docker and Docker Compose)
2. Open up your `ViLO-GRAND` project folder in Terminal
3. Create a .env file for the API server: `cp api/example.env api/.env`
4. Create a .env file for the web client: `cp ui/example.env ui/.env`

Now we can spin up the containers with:

```
make run
```

If you want to populate the DB with sample data (this is **not** our actual data) after the services have been started:

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
