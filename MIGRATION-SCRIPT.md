# Migration Script Commands

> [Cypher Cheatsheet](https://gist.github.com/DaniSancas/1d5265fc159a95ff457b940fc5046887)
> [Useful resource](https://dzone.com/articles/tips-for-fast-batch-updates-of-graph-structures-wi)

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

Construct => Concept

```java
MATCH (n: Construct)
WHERE n.title IS NULL
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

Example AND Error => Example

```java
MATCH (n)
WHERE (n:Example OR n:Error) AND n.body IS NULL
SET n.body = n.Body
SET n.explanation = n.Explanation
REMOVE n.Body
REMOVE n.Explanation
REMOVE n.Label
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

<!-- Fixing Description nodes having `Label` and `Explanation` fields

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
``` -->

###### Migrating relations

CSError => CONTAINS

```java
MATCH (a)-[oldRelation:CSError]->(b)
CREATE (a)-[newRelation:CONTAINS]->(b)
SET newRelation = oldRelation
WITH oldRelation
DELETE oldRelation
```

CSExample => CONTAINS

```java
MATCH (a)-[oldRelation:CSExample]->(b)
CREATE (a)-[newRelation:CONTAINS]->(b)
SET newRelation = oldRelation
WITH oldRelation
DELETE oldRelation
```

CoreError => CONTAINS

```java
MATCH (a)-[oldRelation:CoreError]->(b)
CREATE (a)-[newRelation:CONTAINS]->(b)
SET newRelation = oldRelation
WITH oldRelation
DELETE oldRelation
```

CoreExample => CONTAINS

```java
MATCH (a)-[oldRelation:CoreExample]->(b)
CREATE (a)-[newRelation:CONTAINS]->(b)
SET newRelation = oldRelation
WITH oldRelation
DELETE oldRelation
```

HasCode => CONTAINS

```java
MATCH (a)-[oldRelation:HasCode]->(b)
CREATE (a)-[newRelation:CONTAINS]->(b)
SET newRelation = oldRelation
WITH oldRelation
DELETE oldRelation
```

MTError => CONTAINS

```java
MATCH (a)-[oldRelation:MTError]->(b)
CREATE (a)-[newRelation:CONTAINS]->(b)
SET newRelation = oldRelation
WITH oldRelation
DELETE oldRelation
```

MTExample => CONTAINS

```java
MATCH (a)-[oldRelation:MTExample]->(b)
CREATE (a)-[newRelation:CONTAINS]->(b)
SET newRelation = oldRelation
WITH oldRelation
DELETE oldRelation
```

appear => CONTAINS

```java
MATCH (a)-[oldRelation:appear]->(b)
CREATE (a)-[newRelation:CONTAINS]->(b)
SET newRelation = oldRelation
WITH oldRelation
DELETE oldRelation
```

contain => CONTAINS

```java
MATCH (a)-[oldRelation:contain]->(b)
CREATE (a)-[newRelation:CONTAINS]->(b)
SET newRelation = oldRelation
WITH oldRelation
DELETE oldRelation
```

explain => CONTAINS

```java
MATCH (a)-[oldRelation:explain]->(b)
CREATE (a)-[newRelation:CONTAINS]->(b)
SET newRelation = oldRelation
WITH oldRelation
DELETE oldRelation
```

produce => CONTAINS

```java
MATCH (a)-[oldRelation:produce]->(b)
CREATE (a)-[newRelation:CONTAINS]->(b)
SET newRelation = oldRelation
WITH oldRelation
DELETE oldRelation
```

require => CONTAINS

```java
MATCH (a)-[oldRelation:require]->(b)
CREATE (a)-[newRelation:CONTAINS]->(b)
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

Change out any ()-[:CONTAINS]->(CONCEPT) relations to [:TEACHES]

```java
MATCH (a)-[oldRelation:CONTAINS]->(b:Concept)
CREATE (a)-[newRelation:TEACHES]->(b)
SET newRelation = oldRelation
WITH oldRelation
DELETE oldRelation
```

What's left?

- FullExample
- Error
