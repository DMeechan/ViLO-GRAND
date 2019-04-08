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
    - Example: Example
        - Body: body
        - Explanation: explanation
        - Label: DELETE
    - Error: Example
        - Body: body
        - Explanation: explanation
        - Label: DELETE
    - FullExample: Example
        - Class1 => body
        - Class2 => body
        - Class3 => body
    - Discussion: Description
        - Body: body
        - Label: DELETE
        # 34 Econ Resources contain both Label & Body fields
        # the remaining 278 contain Body but Label == "null" OR null
    - Resource: Link
        - Body: body
        - Label: DELETE
        # 4 Econ Resources contain both Label & Body fields
        # for the remaining 175: Body contains a URL and Label == "null"
    - Module: Module
        - ModuleCode: code
    - Lecture: Lecture
        - Number: number

# 'Python' nodes don't exist and 'Data' is a superclass so it won't exist in Neo4j

Relations / edges:
    - CSError: CONTAINS
    - CSExample: CONTAINS
    - CoreError: CONTAINS
    - CoreExample: CONTAINS
    - HasCode: CONTAINS
    - MTError: CONTAINS
    - MTExample: CONTAINS
    - appear: CONTAINS
    - explain: CONTAINS
    - produce: CONTAINS
    - require: CONTAINS
    - Related: RELATED
    - exRelated: RELATED
    - contain: TEACHES
    - teaches: TEACHES
    - implements: N/A
    - DesignExample: N/A

# TODO: make sure all Concept -> Component relations are CONTAINS
# TODO: remove duplicate edges

New node schemas:
    - Module:
        - code
    - Lecture:
        - number
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
    - Link *implements Component*:
        - id
        - body
    - Example *implements Component*:
        - id
        - body
        - explanation
        - (sometimes has Class1, Class2, Class3 too)
```

See *MIGRATION-SCRIPT.MD*.