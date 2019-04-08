// Migrating to the new schema

// > [Cypher Cheatsheet](https://gist.github.com/DaniSancas/1d5265fc159a95ff457b940fc5046887)
// > [Useful resource](https://dzone.com/articles/tips-for-fast-batch-updates-of-graph-structures-wi)

// ## Nodes

// ### Resources

// Entity => Resource

MATCH (e: Entity)
WHERE e.title IS NULL
SET e.title = e.Label
SET e.institution = null
SET e.description = null
REMOVE e.Label
REMOVE e:Entity
SET e:Resource;

// ### Concepts

// Concept & Construct => Concept

MATCH (c)
WHERE (c:Concept OR c: Construct) AND c.title IS NULL
SET c.title = c.Label
REMOVE c.Label
REMOVE c:Construct
SET c:Concept;

// Theme => Concept

MATCH (t: Theme)
WHERE t.title IS NULL
SET t.title = t.Name
REMOVE t.Name
REMOVE t:Theme
SET t:Concept;

// ### Components (Examples, Descriptions, Links)

// Example AND Error => Example

MATCH (ee)
WHERE (ee:Example OR ee:Error) AND ee.body IS NULL
SET ee.body = ee.Body
SET ee.explanation = ee.Explanation
REMOVE ee.Body
REMOVE ee.Explanation
REMOVE ee.Label
REMOVE ee:Error
SET ee:Example;

// FullExample => Example

// > Find and set Class1, Class2, and Class3 to "" if they're currently "null"

MATCH (fe1:FullExample)
WHERE fe1.Class1 = "null"
SET fe1.Class1 = "";

MATCH (fe2:FullExample)
WHERE fe2.Class2 = "null"
SET fe2.Class2 = "";

MATCH (fe3:FullExample)
WHERE fe3.Class3 = "null"
SET fe3.Class3 = "";

// > Now append Class1, Class2, and Class3 to create our 'body' field

MATCH (fe: FullExample)
WHERE fe.body IS NULL
SET fe.body = fe.Class1 + fe.Class2 + fe.Class3
REMOVE fe.Class1
REMOVE fe.Class2
REMOVE fe.Class3
REMOVE fe:FullExample
SET fe:Example;

// Discussion => Description

MATCH (d: Discussion)
WHERE d.body IS NULL
SET d.body = d.Body
REMOVE d.Body
REMOVE d.Label
REMOVE d:Discussion
SET d:Description;

// Resource => Link

MATCH (r: Resource)
WHERE r.title IS NULL AND r.body IS NULL
SET r.body = r.Body
REMOVE r.Body
REMOVE r.Label
REMOVE r:Resource
SET r:Link;

// ### Modules & Lectures

// Module => Module

MATCH (m: Module)
SET m.code = m.ModuleCode
REMOVE m.ModuleCode;

// Lecture => Lecture

MATCH (l: Lecture)
SET l.number = l.Number
REMOVE l.Number;

// ## Relations

// **CONTAINS**: CSError, CSExample, CoreError, CoreExample, HasCode, MTError, MTExample, appear, explain, produce, require

MATCH (ocA)-[oldContains :CSError
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
]->(ocB)
CREATE (ocA)-[newContains:CONTAINS]->(ocB)
SET newContains = oldContains
WITH oldContains
DELETE oldContains;

// **RELATED**: Related, exRelated

MATCH (orA)-[oldRelated :Related | :exRelated]->(orB)
CREATE (orA)-[newRelated:RELATED]->(orB)
SET newRelated = oldRelated
WITH oldRelated
DELETE oldRelated;

// **TEACHES**: contain, teaches

MATCH (otA)-[oldTeaches :contain | :teaches]->(otB)
CREATE (otA)-[newTeaches:TEACHES]->(otB)
SET newTeaches = oldTeaches
WITH oldTeaches
DELETE oldTeaches;

// Replace any ()-[:CONTAINS]->(:CONCEPT) relations to [:TEACHES]

MATCH (oc1A)-[oldCleanup1:CONTAINS]->(oc1B:Concept)
CREATE (oc1A)-[newCleanup1:TEACHES]->(oc1B)
SET newCleanup1 = oldCleanup1
WITH oldCleanup1
DELETE oldCleanup1;

// Ensure all any (:Concept)-[]->(:Example OR :Description OR :Link) relations are [:CONTAINS]

MATCH (oc2A:Concept)-[oldCleanup2 :TEACHES | :RELATED]->(oc2B)
WHERE (oc2B:Example OR oc2B:Description OR oc2B:Link)
CREATE (oc2A)-[newCleanup2:CONTAINS]->(oc2B)
SET newCleanup2 = oldCleanup2
WITH oldCleanup2
DELETE oldCleanup2;
