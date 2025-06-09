const elementsSeed  = [
  {
    "code": "CIMET",
    "name": "cierre metálico",
    "type": "cierre",
    "material": "metal",
    "style": "metálico",
    "extInt": "",
    "logo\r": "\r"
  },
  {
    "code": "CIPLA",
    "name": "cierre plástico",
    "type": "cierre",
    "material": "plástico",
    "style": "plástico",
    "extInt": "",
    "logo\r": "\r"
  },
  {
    "code": "CISOLBRO",
    "name": "cierre solapa broche",
    "type": "cierre",
    "material": "imán",
    "style": "solapa",
    "extInt": "",
    "logo\r": "\r"
  },
  {
    "code": "CISOLHEB",
    "name": "cierre solapa hebilla",
    "type": "cierre",
    "material": "hebilla",
    "style": "solapa",
    "extInt": "",
    "logo\r": "\r"
  },
  {
    "code": "CIDPPLA",
    "name": "cierre diente perro p",
    "type": "cierre",
    "material": "plástico",
    "style": "diente de perro",
    "extInt": "",
    "logo\r": "\r"
  },
  {
    "code": "CIDPMET",
    "name": "cierre diente perro m",
    "type": "cierre",
    "material": "metal",
    "style": "diente de perro",
    "extInt": "",
    "logo\r": "\r"
  },
  {
    "code": "CIDDMET",
    "name": "cierre doble m",
    "type": "cierre",
    "material": "metal",
    "style": "metálico",
    "extInt": "",
    "logo\r": "\r"
  },
  {
    "code": "CIDDPLA",
    "name": "cierre doble p",
    "type": "cierre",
    "material": "plástico",
    "style": "diente de perro",
    "extInt": "",
    "logo\r": "\r"
  },
  {
    "code": "CORDES",
    "name": "correa desmontable",
    "type": "correa",
    "material": "tela sublimada",
    "style": "desmontable",
    "extInt": "",
    "logo\r": "\r"
  },
  {
    "code": "CORREG",
    "name": "correa regulable",
    "type": "correa",
    "material": "tela sublimada",
    "style": "regulable",
    "extInt": "",
    "logo\r": "\r"
  },
  {
    "code": "CORDESREG",
    "name": "correa reg desmon",
    "type": "correa",
    "material": "tela sublimada",
    "style": "desmontable",
    "extInt": "",
    "logo\r": "\r"
  },
  {
    "code": "CORDOBLE",
    "name": "correa doble",
    "type": "correa",
    "material": "tela sublimada",
    "style": "desmontable",
    "extInt": "",
    "logo\r": "\r"
  },
  {
    "code": "CORDESREG-BR",
    "name": "correa reg des BajoRel",
    "type": "correa",
    "material": "bajo relieve",
    "style": "regulable",
    "extInt": "",
    "logo\r": "\r"
  },
  {
    "code": "CORFIJA",
    "name": "correa fija",
    "type": "correa",
    "material": "símil cuero",
    "style": "fija",
    "extInt": "",
    "logo\r": "\r"
  },
  {
    "code": "MANCOR",
    "name": "manijas cortas",
    "type": "manija",
    "material": "tela sublimada",
    "style": "fija",
    "extInt": "",
    "logo\r": "\r"
  },
  {
    "code": "CHAPLA",
    "name": "chapa plastica",
    "type": "chapa",
    "material": "plástico",
    "style": "plástica frontal",
    "extInt": "",
    "logo\r": "\r"
  },
  {
    "code": "CHAMET",
    "name": "chapa metálica",
    "type": "chapa",
    "material": "metal",
    "style": "metálico",
    "extInt": "",
    "logo\r": "\r"
  },
  {
    "code": "CHARES",
    "name": "chapa resina",
    "type": "chapa",
    "material": "resina",
    "style": "resina frontal",
    "extInt": "",
    "logo\r": "\r"
  },
  {
    "code": "GROSUB",
    "name": "gross sublimado",
    "type": "chapa",
    "material": "sublimado",
    "style": "sublimado",
    "extInt": "",
    "logo\r": "\r"
  },
  {
    "code": "GRALASER",
    "name": "grabado laser",
    "type": "chapa",
    "material": "grabado laser",
    "style": "grabado laser",
    "extInt": "",
    "logo\r": "\r"
  },
  {
    "code": "FORROSUB",
    "name": "forro sublimado",
    "type": "forro",
    "material": "sublimado CHUEKS",
    "style": "sublimado",
    "extInt": "",
    "logo\r": "\r"
  },
  {
    "code": "FORROSUB",
    "name": "forro liso",
    "type": "forro",
    "material": "tafeta negra",
    "style": "liso",
    "extInt": "",
    "logo\r": "\r"
  },
  {
    "code": "FORROGROSS",
    "name": "forro tela gross",
    "type": "forro",
    "material": "sublimado CHUEKS",
    "style": "sublimado",
    "extInt": "",
    "logo\r": "\r"
  },
  {
    "code": "CONF-SIMCUERO",
    "name": "símil cuero",
    "type": "confección",
    "material": "símil cuero",
    "style": "símil cuero",
    "extInt": "",
    "logo\r": "\r"
  },
  {
    "code": "CONF-SIMCUEROCRO",
    "name": "símil cuero croco",
    "type": "confección",
    "material": "símil cuero",
    "style": "croco",
    "extInt": "",
    "logo\r": "\r"
  },
  {
    "code": "CONF-SIMCUERORIG",
    "name": "símil cuero rigido",
    "type": "confección",
    "material": "símil cuero rígido",
    "style": "rígido",
    "extInt": "",
    "logo\r": "\r"
  },
  {
    "code": "CONF-NEOP",
    "name": "neoprene",
    "type": "confección",
    "material": "neoprene",
    "style": "neoprene",
    "extInt": "",
    "logo\r": "\r"
  },
  {
    "code": "CONF-ANDO",
    "name": "tela Andorra",
    "type": "confección",
    "material": "tela Andorra",
    "style": "impermiable",
    "extInt": "",
    "logo\r": "\r"
  },
  {
    "code": "CONF-NEOPFLE",
    "name": "neoprene flexible",
    "type": "confección",
    "material": "neoprene",
    "style": "flexible",
    "extInt": "",
    "logo\r": "\r"
  },
  {
    "code": "CONF-PUFF",
    "name": "tela puffer",
    "type": "confección",
    "material": "puffer",
    "style": "puffer",
    "extInt": "",
    "logo\r": "\r"
  },
  {
    "code": "CONF-PUFFMET",
    "name": "tela puffer metalizado",
    "type": "confección",
    "material": "puffer",
    "style": "puffer metalizado",
    "extInt": "",
    "logo\r": "\r"
  },
  {
    "code": "BOLINT",
    "name": "bolsillo interno",
    "type": "bolsillo",
    "material": "tela sublimada",
    "style": "sublimado",
    "extInt": "",
    "logo\r": "\r"
  },
  {
    "code": "BOLEXT-LAT",
    "name": "bolsillo externo lateral",
    "type": "bolsillo",
    "material": "tela sublimada",
    "style": "sublimado",
    "extInt": "",
    "logo\r": "\r"
  },
  {
    "code": "BOLINT-DOBLE",
    "name": "bolsillo interno doble",
    "type": "bolsillo",
    "material": "tela sublimada",
    "style": "sublimado",
    "extInt": "",
    "logo\r": "\r"
  },
  {
    "code": "BOLEXT-TRA",
    "name": "bolsillo externo trasero",
    "type": "bolsillo",
    "material": "tela sublimada",
    "style": "sublimado",
    "extInt": "",
    "logo\r": "\r"
  },
  {
    "code": "BOLINT-NOTE",
    "name": "bolsillo notebook",
    "type": "bolsillo",
    "material": "acolchado",
    "style": "",
    "extInt": "",
    "logo\r": "\r"
  },
  {
    "code": "BOLEXT-FRO",
    "name": "bolsillo frontal",
    "type": "bolsillo",
    "material": "tela sublimada",
    "style": "",
    "extInt": "",
    "logo\r": ""
  }
]

module.exports = elementsSeed;