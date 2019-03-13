# Handy Neo4j Commands

Learn more on [this page](https://neo4j.com/docs/cypher-manual/current/clauses/match/) in the Neo4j docs.

> View all nodes

```bash
MATCH (n) RETURN N
```

> Delete all nodes (and return how many were deleted)

```bash
MATCH (n) DETACH DELETE (n) RETURN COUNT(n)
```

> Find all Resource nodes


```bash
MATCH (r: Resource) RETURN r
```

> Find Concept nodes with the title "Object-Oriented Programming"


```bash
MATCH (target:Concept {title: "Object-Oriented Programming"}) RETURN target
```

> Find Concept nodes with the title "Object-Oriented Programming" AND all of their child nodes


```bash
MATCH (target:Concept {title: "Object-Oriented Programming"})-[relations]-(children) RETURN target, relations, children
```

> Recursively find child Concept nodes with a `TEACHES` relation to the Concept `c0`


```bash
MATCH (this: Concept {id: "c0"})-[:TEACHES *1..]->(c:Concept) return this, c
```