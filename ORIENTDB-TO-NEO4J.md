# Migrating OrientDB database to Neo4j

### How do we do this?

When you export the database from OrientDB, you get a *huge* JSON file packed with data. Getting OrientDB to play nice with that file is tricky business, so we'll work around that. 

Instead, we're going to:

1. Export OrientDB database to a JSON file
2. Convert the JSON file to a [GraphML](http://graphml.graphdrawing.org/) file using the [odb2graphml](https://github.com/lukeasrodgers/odb2graphml) library
3. Import the GraphML file into Neo4j using the [APOC](https://github.com/neo4j-contrib/neo4j-apoc-procedures) library
4. Run some Cypher scripts to simplify our Neo4j database's schema

### Getting started

#### 1️⃣ Converting our OrientDB database into a GraphML file

*Note: I wasn't able to get local file paths to work (like file:///Users/example/out.graphml), so you'll have to upload your GraphML file to the interwebs somewhere (I just uploaded mine to the GitHub repo)*

1. Export database from OrientDB (by starting the OrientDB database and visiting `HOST:PORT/studio/index.html#/database/StudentResource/db/import-export`)
2. `gunzip StudentResource.gz` to extract the archive
3. `mv StudentResource orient-db-export.json` to rename it to a JSON file

Next, let's convert the JSON file to a GraphML file (called `out.graphml`):

```bash
time npx odb2graphml orient-db-export.json -v Concept,Construct,Data,Discussion,Entity,Error,Example,FullExample,Lecture,Module,Python,Resource,Theme,V -e CSError,CSExample,CoreError,CoreExample,DesignExample,E,HasCode,MTError,MTExample,Related,appear,contain,exRelated,explain,implements,produce,require,teaches
```

You should see an output like:

```bash
Success! Converted 1210 edges and 1104 vertices. Pruned 1 edge. Written to out.graphml
odb2graphml orient-db-export.json -v  -e   0.80s user 0.07s system 125% cpu 0.694 total
```

Success!

> ⏰ Note that the `time` command above is optional - it just tells you how long the command took

#### 2️⃣ Importing our GraphML file into a Neo4j database

> Note: you must have APOC enabled in your Neo4j database!

In theory, setting the following settings in your Neo4j database should enable you to import local files:

```bash
apoc.import.file.enabled=true
apoc.import.file.use_neo4j_config=true
dbms.security.allow_csv_import_from_file_urls=true
```

However, for some reason this didn't work for me. You mileage may vary.

So instead of using your local file, you'll have to upload your `out.graphml` file to the interwebs (I just put it in the GitHub repo so you can use mine if you want).

Now just run this command (don't forget to update the file path URL if you want to use your own file):

```bash
CALL apoc.import.graphml('https://raw.githubusercontent.com/DMeechan/ViLO-GRAND/master/exports/out.graphml', {batchSize: 10000, readLabels: true, storeNodeIds: false, defaultRelationshipType:"RELATED"})
```

*[Source](https://neo4j-contrib.github.io/neo4j-apoc-procedures/#graphml) for the Cypher command above*

The data should now be imported! 🎉

To test this, update run this query: `MATCH (n) RETURN n`

> You might notice that it's only displaying 300 nodes visually. If you want to see all the nodes, change the `Initial Node Display` value in your Neo4j Browser settings

#### 3️⃣ Simplifying our Neo4j schema

Coming soon™️

##### Mapping old schema to new schema

```YAML
Nodes / vectors:
    - Entity: Resource
        - Label: title
        - null: institution
        - null: description
    - Concept: Concept
        - Label: title
    - Construct: Concept
        - Label: title
    - Theme: Concept
        - Name: title
    - Example: Description
        - Body: body
    - Discussion: Description
        - Body => body
        - Label => body
        # 34 Econ Resources contain both Label & Body fields
        # for the remaining 278: Body contains text and Label == "null"
        # plus there's one where: Body contains text and Label is null
        # body = Label + ": " + Body
    - Resource: Description
        - Label => body
        - Body => body
        # 4 Econ Resources contain both Label & Body fields
        # for the remaining 175: Body contains a URL and Label == "null"
        # body = Label + ": " + Body
    - FullExample: ?
        - Class1
        - Class2
        - Class3
    - Module: DELETE
        - ModuleCode
    - Error: DELETE
        - Body
        - Explanation
        - Label: "null"
    - Lecture: DELETE
        - Number

# Nodes I couldn't find: Data and Python

RESOURCE TEACHES CONCEPT (bi)
CONCEPT TEACHES CONCEPT (out?)
CONCEPT EXPLAINS DESCRIPTION (bi)

Relations / edges:
    - CSError: EXPLAINS
    - CSExample: EXPLAINS
    - CoreError: EXPLAINS
    - CoreExample: EXPLAINS
    - HasCode: EXPLAINS
    - MTError: EXPLAINS
    - MTExample: EXPLAINS
    - appear: EXPLAINS
    - contain: EXPLAINS
    - explain: EXPLAINS
    - produce: EXPLAINS
    - require: EXPLAINS
    - Related: TEACHES
    - exRelated: TEACHES
    - teaches: TEACHES
    - implements: N/A
    - DesignExample: N/A

Old node schemas:
    - Resource:
        - Body
        - Label
    - Concept:
        - Label
    - Construct:
        - Label
    - Error:
        - Body
    - Example:
        - Body
    - Lecture:
        - Number
    - Discussion

New node schemas:
    - Resource:
        - id
        - title
        - institution
        - description
    - Concept:
        - id
        - title
    - Description *implements Component*:
        - id
        - body
```

##### Commands

> [Cypher Cheatsheet](https://gist.github.com/DaniSancas/1d5265fc159a95ff457b940fc5046887)
> [Source](https://dzone.com/articles/tips-for-fast-batch-updates-of-graph-structures-wi)

Entity => Resource

```java
MATCH (n: Entity)
WHERE n.title IS NULL
SET n.title = n.Label
SET n.institution = null
SET n.description = null
REMOVE n.Label
REMOVE n:Entity
SET n:Resource
```

Concept => Concept

```java
MATCH (n: Concept)
WHERE n.title IS NULL
SET n.title = n.Label
REMOVE n.Label
```

Theme => Concept

```java
MATCH (n: Theme)
WHERE n.title IS NULL
SET n.title = n.Name
REMOVE n.Name
REMOVE n:Theme
SET n:Concept
```

Construct => Concept

```java
MATCH (n: Construct)
WHERE n.title IS NULL
SET n.title = n.Label
REMOVE n.Label
REMOVE n:Construct
SET n:Concept
```

Example => Description

```java
MATCH (n: Example)
WHERE n.body IS NULL
SET n.body = n.Body
REMOVE n.Body
REMOVE n:Example
SET n:Description
```

Discussion => Description

```java
MATCH (n: Discussion)
WHERE n.body IS NULL AND NOT n.Label = "null" AND n.Label IS NOT null
SET n.body = n.Label + ": " + n.Body
REMOVE n.Body
REMOVE n.Label
REMOVE n:Discussion
SET n:Description
```

```java
MATCH (n: Discussion)
WHERE n.body IS NULL AND (n.Label IS null OR n.Label = "null")
SET n.body = n.Body
REMOVE n.Body
REMOVE n.Label
REMOVE n:Discussion
SET n:Description
```

Resource => Description

```java
MATCH (n: Resource)
WHERE n.title IS NULL AND n.body IS NULL AND (n.Label IS null OR n.Label = "null")
SET n.body = n.Body
REMOVE n.Body
REMOVE n.Label
REMOVE n:Resource
SET n:Description
```

```java
MATCH (n: Resource)
WHERE n.title IS NULL AND NOT n.Label = "null" AND n.Label IS NOT null
SET n.body = n.Label + ": " + n.Body
REMOVE n.Body
REMOVE n.Label
REMOVE n:Resource
SET n:Description
```

Fixing Description nodes having `Label` and `Explanation` fields

```java
MATCH (n: Description)
WHERE n.Label = "null"
REMOVE n.Label
```

```java
MATCH (n: Description)
WHERE n.Explanation = "null"
REMOVE n.Explanation
```

```java
MATCH (n: Description)
WHERE n.Explanation IS NOT NULL
SET n.body = n.body + ": " + n.Explanation
REMOVE n.Explanation
RETURN n
```

###### Migrating relations

CSError => EXPLAINS

```java
MATCH (a)-[oldRelation:CSError]->(b)
CREATE (a)-[newRelation:EXPLAINS]->(b)
SET newRelation = oldRelation
WITH oldRelation
DELETE oldRelation
```

CSExample => EXPLAINS

```java
MATCH (a)-[oldRelation:CSExample]->(b)
CREATE (a)-[newRelation:EXPLAINS]->(b)
SET newRelation = oldRelation
WITH oldRelation
DELETE oldRelation
```

CoreError => EXPLAINS

```java
MATCH (a)-[oldRelation:CoreError]->(b)
CREATE (a)-[newRelation:EXPLAINS]->(b)
SET newRelation = oldRelation
WITH oldRelation
DELETE oldRelation
```

CoreExample => EXPLAINS

```java
MATCH (a)-[oldRelation:CoreExample]->(b)
CREATE (a)-[newRelation:EXPLAINS]->(b)
SET newRelation = oldRelation
WITH oldRelation
DELETE oldRelation
```

HasCode => EXPLAINS

```java
MATCH (a)-[oldRelation:HasCode]->(b)
CREATE (a)-[newRelation:EXPLAINS]->(b)
SET newRelation = oldRelation
WITH oldRelation
DELETE oldRelation
```

MTError => EXPLAINS

```java
MATCH (a)-[oldRelation:MTError]->(b)
CREATE (a)-[newRelation:EXPLAINS]->(b)
SET newRelation = oldRelation
WITH oldRelation
DELETE oldRelation
```

MTExample => EXPLAINS

```java
MATCH (a)-[oldRelation:MTExample]->(b)
CREATE (a)-[newRelation:EXPLAINS]->(b)
SET newRelation = oldRelation
WITH oldRelation
DELETE oldRelation
```

appear => EXPLAINS

```java
MATCH (a)-[oldRelation:appear]->(b)
CREATE (a)-[newRelation:EXPLAINS]->(b)
SET newRelation = oldRelation
WITH oldRelation
DELETE oldRelation
```

contain => EXPLAINS

```java
MATCH (a)-[oldRelation:contain]->(b)
CREATE (a)-[newRelation:EXPLAINS]->(b)
SET newRelation = oldRelation
WITH oldRelation
DELETE oldRelation
```

explain => EXPLAINS

```java
MATCH (a)-[oldRelation:explain]->(b)
CREATE (a)-[newRelation:EXPLAINS]->(b)
SET newRelation = oldRelation
WITH oldRelation
DELETE oldRelation
```

produce => EXPLAINS

```java
MATCH (a)-[oldRelation:produce]->(b)
CREATE (a)-[newRelation:EXPLAINS]->(b)
SET newRelation = oldRelation
WITH oldRelation
DELETE oldRelation
```

require => EXPLAINS

```java
MATCH (a)-[oldRelation:require]->(b)
CREATE (a)-[newRelation:EXPLAINS]->(b)
SET newRelation = oldRelation
WITH oldRelation
DELETE oldRelation
```

Related => TEACHES

```java
MATCH (a)-[oldRelation:Related]->(b)
CREATE (a)-[newRelation:TEACHES]->(b)
SET newRelation = oldRelation
WITH oldRelation
DELETE oldRelation
```

exRelated => TEACHES

```java
MATCH (a)-[oldRelation:exRelated]->(b)
CREATE (a)-[newRelation:TEACHES]->(b)
SET newRelation = oldRelation
WITH oldRelation
DELETE oldRelation
```

teaches => TEACHES

```java
MATCH (a)-[oldRelation:teaches]->(b)
CREATE (a)-[newRelation:TEACHES]->(b)
SET newRelation = oldRelation
WITH oldRelation
DELETE oldRelation
```

Change out any ()-[:EXPLAINS]->(CONCEPT) relations to [:TEACHES]

```java
MATCH (a)-[oldRelation:EXPLAINS]->(b:Concept)
CREATE (a)-[newRelation:TEACHES]->(b)
SET newRelation = oldRelation
WITH oldRelation
DELETE oldRelation
```

What's left?

- FullExample
- Module
- Error
- Lecture
- Resources should probably have `institution` and `description` fields assigned