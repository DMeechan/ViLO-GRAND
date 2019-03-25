# Migrating OrientDB database to Neo4j

### Neo4j databse options for importing with APOC

```bash
apoc.import.file.enabled=true
apoc.import.file.use_neo4j_config=true
dbms.security.allow_csv_import_from_file_urls=true
```

### Using library

Library: [odb2graphml](https://github.com/lukeasrodgers/odb2graphml)

```bash
time odb2graphml orient-db-export.json -v Concept,Construct,Data,Discussion,Entity,Error,Example,FullExample,Lecture,Module,Python,Resource,Theme,V -e CSError,CSExample,CoreError,CoreExample,DesignExample,E,HasCode,MTError,MTExample,Related,appear,contain,exRelated,explain,implements,produce,require,teaches
```

```bash
Success! Converted 1210 edges and 1104 vertices. Pruned 1 edge. Written to out.graphml
odb2graphml orient-db-export.json -v  -e   0.80s user 0.07s system 125% cpu 0.694 total
```

File path:

`/Users/dmeechan/Projects/vilo/backend/orient-db-export.json`

Cypher command - [source](https://neo4j-contrib.github.io/neo4j-apoc-procedures/#graphml):

```bash
CALL apoc.import.graphml('file:///Users/dmeechan/Projects/vilo/backend/orient-db-export.json', {batchSize: 10000, readLabels: true, storeNodeIds: false, defaultRelationshipType:"RELATED"})
```