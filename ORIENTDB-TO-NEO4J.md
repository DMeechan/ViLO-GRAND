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
```

```YAML
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

###### Performing the migration

I've written a script to perform the schema migration outlined above.

> See *./exports/migrate.cypher*

1. Set up a Neo4j database (you can do this easily using Neo4j Desktop if preferred)
2. Download [Neo4j Community Server](https://neo4j.com/download-center/#panel2-2) to use the `Cypher Shell` tool - I'm using `Neo4j 3.5.4 (tar)`
3. Ensure that the Java 8 JDK is installed because `bin/cypher-shell` (the file we're using), requires it 
4. Run the following command (substituting the path for the cypher-shell file, migrate.cypher file, and database connection info):

```bash
cat /PATH/TO/migrate.cypher | /PATH/TO/bin/cypher-shell -u USERNAME -p PASSWORD -a ADDRESS --format plain
```

For example, my command looks like this:

```bash
cat backend/exports/migrate.cypher | neo4j-shells/bin/cypher-shell -u neo4j -p letmein -a bolt://localhost:7687 --format plain
```

You should see numerous newlines appear. If so, it probably worked.

TODO: remove duplicate relations (10 total)

## Migrating Neo4j back to OrientDB

1. Download OrientDB to Neo4j Importer - see [here](https://orientdb.com/docs/last/OrientDB-Neo4j-Importer.html)
2. Ensure you still have your `neo4j-shells` folder from the previous migration (OrientDB => Neo4j) - you'll need it
3. Dive into your Neo4j files to find your database's `Graph.db` folder - it was here on my Mac: `/Users/dmeechan/Library/Application\ Support/Neo4j\ Desktop/Application/neo4jDatabases/database-4fe43820-d0c3-4d42-86c7-df862446c793/installation-3.5.4/data/databases`)
4. Now run the command below, passing in the absolute paths to your `neo4j-shells/lib` folder, `graph.db` folder, and `orientdb database folder`

```bash
./orientdb-neo4j-importer.sh \
  -neo4jlibdir /YOUR_PATH/neo4j-shells/lib \
  -neo4jdbdir /YOUR_PATH/graph.db \
  -odbdir /YOUR_PATH/orientdb-3.0.17/databases/neo4j_import
```

For example, mine looked like this:

```bash
./orientdb-neo4j-importer.sh \
  -neo4jlibdir /Users/dmeechan/Projects/vilo/neo4j-shells/lib \
  -neo4jdbdir /Users/dmeechan/Projects/vilo/graph.db \
  -odbdir /Users/dmeechan/Projects/vilo/orientdb-3.0.17/databases/neo4j_import
```

I encountered a weird Java problem:

```java
Initializing Neo4j...Done

Initializing OrientDB...Exception in thread "main" java.lang.NoClassDefFoundError: com/tinkerpop/blueprints/impls/orient/OrientGraphFactory
	at com.orientechnologies.orient.neo4jimporter.ONeo4jImporterInitializer.invoke(ONeo4jImporterInitializer.java:94)
	at com.orientechnologies.orient.neo4jimporter.ONeo4jImporter.execute(ONeo4jImporter.java:108)
	at com.orientechnologies.orient.neo4jimporter.ONeo4jImporterMain.main(ONeo4jImporterMain.java:25)
Caused by: java.lang.ClassNotFoundException: com.tinkerpop.blueprints.impls.orient.OrientGraphFactory
	at java.base/jdk.internal.loader.BuiltinClassLoader.loadClass(BuiltinClassLoader.java:583)
	at java.base/jdk.internal.loader.ClassLoaders$AppClassLoader.loadClass(ClassLoaders.java:178)
	at java.base/java.lang.ClassLoader.loadClass(ClassLoader.java:521)
	... 3 more
```

Solved it using this (under-appreciated) [Stackoverflow answer](https://stackoverflow.com/a/53669870/4752388): I downloaded [OrientDB GraphDB](https://mvnrepository.com/artifact/com.orientechnologies/orientdb-graphdb/3.0.17) and [Blueprints Core](https://mvnrepository.com/artifact/com.tinkerpop.blueprints/blueprints-core/2.6.0) JAR files and then put them in my `./neo4j-shells/lib` folder.

It works now!