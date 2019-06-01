# Handy Neo4j Commands

Learn more on [this page](https://neo4j.com/docs/cypher-manual/current/clauses/match/) in the Neo4j docs.

### Finding all nodes

> View all nodes

```bash
MATCH (n) RETURN N
```

> Delete all nodes (and return how many were deleted)

```bash
MATCH (n) DETACH DELETE (n) RETURN COUNT(n)
```

### Finding specific nodes

> Find all Resource nodes

```bash
MATCH (r: Resource) RETURN r
```

> Find Concept nodes with the title "Object-Oriented Programming"

```bash
MATCH (target:Concept {title: "Object-Oriented Programming"}) RETURN target
```

### Finding nodes and their relations

> Find Concept nodes with the title "Object-Oriented Programming" AND all of their child nodes


```bash
MATCH (target:Concept {title: "Object-Oriented Programming"})-[relations]-(children) RETURN target, relations, children
```

> Recursively find child Concept nodes with a `TEACHES` relation to the Concept `c0`

```bash
MATCH (this: Concept {id: "c0"})-[:TEACHES *1..]->(c:Concept) return this, c
```

> Find every *Module* which *TEACHES* a *Lecture*, then return those modules and lectures.

```bash
MATCH (m: Module)-[:TEACHES]->(lec: Lecture) RETURN m, lec
```

> Find every *Module* which *TEACHES* a *Lecture*... and then find every *Concept* which is taught by one of those lectures... then return those modules, lectures, and concepts.

```bash
MATCH (m: Module)-[:TEACHES]->(lec: Lecture) MATCH(lec)-[:TEACHES]->(c:Concept) RETURN m, lec, c
```

