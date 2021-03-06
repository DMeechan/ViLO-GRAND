export default `
mutation {
  r1: CreateResource(
    id: "r1",
    title: "Java",
    institution: "St Andrews",
    description: "Java is an object-oriented language"
  ){
    id
    title
    institution
  }
  r2: CreateResource(
    id: "r2",
    title: "Elixir",
    institution: "Online University",
    description: "Elixir is a dynamic, functional language"
  ){
    id
    title
    institution
  }
  c0: CreateConcept(id: "c0", title: "Object-Oriented Programming") {
    id
    title
  }
  c1: CreateConcept(id: "c1", title: "Encapsulation") {
    id
    title
  }
  c2: CreateConcept(id: "c2", title: "Inheritance") {
    id
    title
  }
  c3: CreateConcept(id: "c3", title: "Abstraction") {
    id
    title
  }
  c4: CreateConcept(id: "c4", title: "Polymorphism") {
    id
    title
  }
  c5: CreateConcept(id: "c5", title: "Functional") {
    id
    title
  }
  c6: CreateConcept(id: "c6", title: "Lambdas") {
    id
    title
  }
  c7: CreateConcept(id: "c7", title: "Concurrency") {
    id
    title
  }
  c8: CreateConcept(id: "c8", title: "Threads") {
    id
    title
  }

  c01: CreateConcept(id: "c01", title: "Classes") {
    id
    title
  }
  c011: CreateConcept(id: "c011", title: "Abstract Classes") {
    id
    title
  }
  c0111: CreateConcept(id: "c0111", title: "Abstract Functions") {
    id
    title
  }
  c02: CreateConcept(id: "c02", title: "Functions") {
    id
    title
  }

  dc0: CreateDescription(id: "dc0", body: "OOP is OOP") {id body}
  dc1: CreateDescription(id: "dc1", body: "Gotta encapsulate 'em all") {id body}
  dc2: CreateDescription(id: "dc2", body: "Inherit everything") {id body}
  dc3: CreateDescription(id: "dc3", body: "Abstract the world") {id body}
  dc4: CreateDescription(id: "dc4", body: "Polymorphs are cool") {id body}
  dc5: CreateDescription(id: "dc5", body: "Functional is functional") {id body}
  dc6: CreateDescription(id: "dc6", body: "Lambdas are fun") {id body}
  dc7: CreateDescription(id: "dc7", body: "Concurrency is usually kinda tough") {id body}
  dc8: CreateDescription(id: "dc8", body: "Threads can run some code") {id body}

  c0d: AddConceptDescription(conceptid: "c0", descriptionid: "dc0") {id}
  c1d: AddConceptDescription(conceptid: "c1", descriptionid: "dc1") {id}
  c2d: AddConceptDescription(conceptid: "c2", descriptionid: "dc2") {id}
  c3d: AddConceptDescription(conceptid: "c3", descriptionid: "dc3") {id}
  c4d: AddConceptDescription(conceptid: "c4", descriptionid: "dc4") {id}
  c5d: AddConceptDescription(conceptid: "c5", descriptionid: "dc5") {id}
  c6d: AddConceptDescription(conceptid: "c6", descriptionid: "dc6") {id}
  c7d: AddConceptDescription(conceptid: "c7", descriptionid: "dc7") {id}
  c8d: AddConceptDescription(conceptid: "c8", descriptionid: "dc8") {id}

  r1c0: AddResourceConcepts(resourceid:"r1", conceptid:"c0") {id}
  r1c5: AddResourceConcepts(resourceid:"r1", conceptid:"c5") {id}
  r1c7: AddResourceConcepts(resourceid:"r1", conceptid:"c7") {id}

  r2c5: AddResourceConcepts(resourceid:"r2", conceptid:"c5") {id}
  r2c7: AddResourceConcepts(resourceid:"r2", conceptid:"c7") {id}

  c0c1: AddConceptToConcept(rootid: "c0", leafid: "c1") {id}
  c0c2: AddConceptToConcept(rootid: "c0", leafid: "c2") {id}
  c0c3: AddConceptToConcept(rootid: "c0", leafid: "c3") {id}
  c0c4: AddConceptToConcept(rootid: "c0", leafid: "c4") {id}
  c5c6: AddConceptToConcept(rootid: "c5", leafid: "c6") {id}
  c7c8: AddConceptToConcept(rootid: "c7", leafid: "c8") {id}

  c0c02: AddConceptToConcept(rootid: "c0", leafid: "c02") {id}
  c0c01: AddConceptToConcept(rootid: "c0", leafid: "c01") {id}
  c01c011: AddConceptToConcept(rootid: "c01", leafid: "c011") {id}
  c3c011: AddConceptToConcept(rootid: "c3", leafid: "c011") {id}
  c011c0111: AddConceptToConcept(rootid: "c011", leafid: "c0111") {id}
  c02c0111: AddConceptToConcept(rootid: "c02", leafid: "c0111") {id}

}
`
