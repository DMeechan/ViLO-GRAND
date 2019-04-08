MATCH (n: Module {ModuleCode: "CS1003"})
WITH n
SET n.ModuleCode = "CS1003 updated"

MATCH (n: Module {ModuleCode: "MT2xxx"})
WITH n
SET n.ModuleCode = "MT2xxx updated"

MATCH (n: Module {ModuleCode: "CS1003 updated"})
WITH n
SET n.ModuleCode = "CS1003"
RETURN n