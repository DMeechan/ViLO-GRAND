# Migration Script Commands

> [Cypher Cheatsheet](https://gist.github.com/DaniSancas/1d5265fc159a95ff457b940fc5046887)
> [Useful resource](https://dzone.com/articles/tips-for-fast-batch-updates-of-graph-structures-wi)

## Nodes

### Resources

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

### Concepts

Concept & Construct => Concept

```java
MATCH (n)
WHERE (n:Concept OR n: Construct) AND n.title IS NULL
SET n.title = n.Label
REMOVE n.Label
REMOVE n:Construct
SET n:Concept
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

### Components (Examples, Descriptions, Links)

Example AND Error => Example

```java
MATCH (n)
WHERE (n:Example OR n:Error) AND n.body IS NULL
SET n.body = n.Body
SET n.explanation = n.Explanation
REMOVE n.Body
REMOVE n.Explanation
REMOVE n.Label
REMOVE n:Error
SET n:Example
```

FullExample => Example

> Find and set Class1, Class2, and Class3 to "" if they're currently "null"

```java
MATCH (n:FullExample)
WHERE n.Class1 = "null"
SET n.Class1 = ""

MATCH (n:FullExample)
WHERE n.Class2 = "null"
SET n.Class2 = ""

MATCH (n:FullExample)
WHERE n.Class3 = "null"
SET n.Class3 = ""
```

> Now append Class1, Class2, and Class3 to create our 'body' field

```java
MATCH (n: FullExample)
WHERE n.body IS NULL
SET n.body = n.Class1 + n.Class2 + n.Class3
REMOVE n.Class1
REMOVE n.Class2
REMOVE n.Class3
REMOVE n:FullExample
SET n:Example
```

Discussion => Description

```java
MATCH (n: Discussion)
WHERE n.body IS NULL
SET n.body = n.Body
REMOVE n.Body
REMOVE n.Label
REMOVE n:Discussion
SET n:Description
```

Resource => Link

```java
MATCH (n: Resource)
WHERE n.title IS NULL AND n.body IS NULL
SET n.body = n.Body
REMOVE n.Body
REMOVE n.Label
REMOVE n:Resource
SET n:Link
```

### Modules & Lectures

Module => Module

```java
MATCH (n: Module)
SET n.code = n.ModuleCode
REMOVE n.ModuleCode
```

Lecture => Lecture

```java
MATCH (n: Lecture)
SET n.number = n.Number
REMOVE n.Number
```

## Relations

**CONTAINS**: CSError, CSExample, CoreError, CoreExample, HasCode, MTError, MTExample, appear, explain, produce, require

```java
MATCH (a)-[oldRelation :CSError
 | :CSExample
 | :CoreError
 | :CoreExample
 | :HasCode
 | :MTError
 | :MTExample
 | :appear
 | :explain
 | :produce
 | :require
]->(b)
CREATE (a)-[newRelation:CONTAINS]->(b)
SET newRelation = oldRelation
WITH oldRelation
DELETE oldRelation
```

**RELATED**: Related, exRelated

```java
MATCH (a)-[oldRelation :Related | :exRelated]->(b)
CREATE (a)-[newRelation:RELATED]->(b)
SET newRelation = oldRelation
WITH oldRelation
DELETE oldRelation
```

**TEACHES**: contain, teaches

```java
MATCH (a)-[oldRelation :contain | :teaches]->(b)
RETURN a,oldRelation,b
CREATE (a)-[newRelation:TEACHES]->(b)
SET newRelation = oldRelation
WITH oldRelation
DELETE oldRelation
```

Replace any ()-[:CONTAINS]->(:CONCEPT) relations to [:TEACHES]

```java
MATCH (a)-[oldRelation:CONTAINS]->(b:Concept)
CREATE (a)-[newRelation:TEACHES]->(b)
SET newRelation = oldRelation
WITH oldRelation
DELETE oldRelation
```

Replace any ()-[:CONTAINS]->(:CONCEPT) relations to [:TEACHES]

```java
MATCH (a)-[oldRelation:CONTAINS]->(b:Concept)
CREATE (a)-[newRelation:TEACHES]->(b)
SET newRelation = oldRelation
WITH oldRelation
DELETE oldRelation
```
