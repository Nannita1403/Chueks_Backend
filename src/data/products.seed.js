const productsSeed = [
  // ----- RIÑONERAS -----
  {
    code: "RI001",
    name: "Riñonera alice",
    style: ["Urbana", "Casual", "Diario", "Viaje", "Playa"],
    description: "Alice – Elegancia urbana con personalidad\n\nLa Alice es esa cartera que equilibra diseño, funcionalidad y carácter. Confeccionada en símil cuero y forrada con gross sublimado con la identidad Chueks, cada detalle habla de estilo cuidado.\n\nIncluye cierres metálicos tipo diente de perro que aportan un toque moderno y seguro, junto con una correa regulable y desmontable que se adapta fácilmente a tu ritmo. La chapa de resina frontal aporta un acento distintivo. Con sus medidas de 28x18x5 cm, es ideal para complementar tus looks con elegancia y actitud.",
    priceMin: 75900,
    priceMay: 63250,
    category: ["Riñonera"],
    material: ["símil cuero"],
    colors: [
      { name: "vison", stock: 0 },
      { name: "negro", stock: 0 }
    ],
    height: 28,
    width: 18,
    depth: 5,
    imgPrimary: "",
    imgSecondary: ""
  },
  {
    code: "RI002",
    name: "Riñonera revel",
    style: ["Urbana", "Casual", "Diario", "Viaje", "Playa"],
    description: "Revel – Funcional, canchera y con identidad propia\n\nLa Revel es una cartera pensada para acompañarte todos los días con estilo y practicidad. Está confeccionada en símil cuero y forrada con el exclusivo forro sublimado \"Chueks\", que refleja la esencia de la marca en cada detalle.\n\nSu diseño incluye un cierre plástico tipo diente de perro, dos correas desmontables para que elijas cómo llevarla, y un bolsillo exterior trasero que suma funcionalidad sin perder el estilo. La chapa plástica frontal le aporta un toque moderno y distintivo. Con sus 30x20x5 cm, la Revel es tu aliada perfecta para un look casual con personalidad.",
    priceMin: 67650,
    priceMay: 56370,
    category: ["Riñonera"],
    material: ["símil cuero"],
    colors: [
      { name: "negro", stock: 0 },
      { name: "suela", stock: 0 }
    ],
    height: 30,
    width: 20,
    depth: 5,
    imgPrimary: "",
    imgSecondary: ""
  },
  {
    code: "RI003",
    name: "Riñonera neoprene",
    style: ["Urbana", "Casual", "Diario", "Viaje", "Playa"],
    description: "Riñonera Neopren – Movimiento, estilo y comodidad\n\nLa Riñonera de Neopren de Chueks está pensada para quienes necesitan libertad sin resignar estilo. Confeccionada en neopren flexible y resistente, es ideal para un look urbano, activo y actual.\n\nCuenta con apertura mediante cierres metálicos y un interior forrado en negro liso, que la hace práctica y fácil de combinar. Con sus medidas de 17x36x13 cm, tiene el tamaño justo para llevar tus esenciales con comodidad y actitud.",
    priceMin: 54480,
    priceMay: 45400,
    category: ["Riñonera"],
    material: ["neoprene"],
    colors: [
      { name: "negro", stock: 0 },
      { name: "verde oliva", stock: 0 }
    ],
    height: 17,
    width: 36,
    depth: 13,
    imgPrimary: "",
    imgSecondary: ""
  },
  {
    code: "RI004",
    name: "Riñonera correa intercambiable",
    style: ["Urbana", "Casual", "Diario", "Viaje", "Playa"],
    description: "Riñonera Correa – Práctica, versátil y con actitud Chueks\n\nLa riñonera Correa combina funcionalidad con un diseño moderno y urbano. Confeccionada en símil cuero y con apertura mediante cierres metálicos, está pensada para acompañarte con estilo en cualquier plan.\n\nSu interior forrado en negro liso y su correa desmontable y regulable permiten llevarla de la forma que más te guste: cruzada, en la cintura o al hombro. Con medidas de 17x36x13 cm, es ideal para tener todo a mano sin perder el look.",
    priceMin: 54480,
    priceMay: 45400,
    category: ["Riñonera"],
    material: ["símil cuero"],
    colors: [
      { name: "negro opaco", stock: 0 }
    ],
    height: 17,
    width: 36,
    depth: 13,
    imgPrimary: "",
    imgSecondary: ""
  },
  {
    code: "RI005",
    name: "Riñonera clasica",
    style: ["Urbana", "Casual", "Diario", "Viaje", "Playa"],
    description: "Riñonera Clásica – Simple, funcional y con sello Chueks\n\nLa Riñonera Clásica es un básico infaltable que se adapta a cualquier ocasión. Confeccionada en símil cuero y equipada con cierre metálico, ofrece un diseño limpio y funcional.\n\nSu interior forrado en negro liso y correa fija aseguran comodidad y practicidad en cada uso. Con medidas de 17x36x13 cm, es perfecta para quienes buscan un accesorio compacto, con onda y fácil de combinar.",
    priceMin: 41400,
    priceMay: 34500,
    category: ["Riñonera"],
    material: ["símil cuero"],
    colors: [
      { name: "negro opaco", stock: 0 }
    ],
    height: 17,
    width: 36,
    depth: 13,
    imgPrimary: "",
    imgSecondary: ""
  },
  {
    code: "RI006",
    name: "Riñonera croco",
    style: ["Urbana", "Casual", "Diario", "Viaje", "Playa"],
    description: "Riñonera Crocco – Textura, estilo y actitud urbana\n\nLa Riñonera Crocco eleva lo clásico con un toque de textura. Confeccionada en símil cuero con terminación crocco, aporta personalidad sin perder la practicidad que caracteriza a Chueks.\n\nCuenta con apertura mediante cierre metálico, interior forrado en negro liso y correa fija para un uso cómodo y seguro. Sus medidas de 17x36x13 cm la convierten en el complemento ideal para sumar estilo a tu día a día.",
    priceMin: 41400,
    priceMay: 34500,
    category: ["Riñonera"],
    material: ["símil cuero"],
    colors: [
      { name: "negro croco", stock: 0 }
    ],
    height: 17,
    width: 36,
    depth: 13,
    imgPrimary: "",
    imgSecondary: ""
  },
  // ----- BOLSOS -----
  {
    code: "BOL001A",
    name: "Bolso venus",
    style: ["Urbana", "Casual", "Diario", "Viaje", "Playa", "Deporte"],
    description: "Bolso Venus – Liviano, moderno y con identidad Chueks\n\nEl Bolso Venus combina diseño actual y practicidad en una pieza que se adapta a tu ritmo diario. Confeccionado en tela puffer, es liviano pero resistente, ideal para acompañarte en movimiento.\n\nSu interior forrado en silver negro incluye dos bolsillos internos para organización, mientras que el bolsillo exterior con cierre te brinda acceso rápido a lo esencial. La correa intercambiable y regulable con bajo relieve \"Chueks\" suma estilo y comodidad. Cierra con plástico tipo diente de perro y mide 30 x 30 x 15 cm, ofreciendo espacio justo y diseño con personalidad.",
    priceMin: 98700,
    priceMay: 82250,
    category: ["Bolso"],
    material: ["tela puffer"],
    colors: [
      { name: "negro", stock: 0 },
      { name: "negro con crudo", stock: 0 }
    ],
    height: 30,
    width: 30,
    depth: 15,
    imgPrimary: "",
    imgSecondary: ""
  },
  {
    code: "BOL001B",
    name: "Bolso venus",
    style: ["Urbana", "Casual", "Diario", "Viaje", "Playa", "Deporte"],
    description: "Bolso Venus – Liviano, moderno y con identidad Chueks\n\nEl Bolso Venus combina diseño actual y practicidad en una pieza que se adapta a tu ritmo diario. Confeccionado en tela puffer, es liviano pero resistente, ideal para acompañarte en movimiento.\n\nSu interior forrado en silver negro incluye dos bolsillos internos para organización, mientras que el bolsillo exterior con cierre te brinda acceso rápido a lo esencial. La correa intercambiable y regulable con bajo relieve \"Chueks\" suma estilo y comodidad. Cierra con plástico tipo diente de perro y mide 30 x 30 x 15 cm, ofreciendo espacio justo y diseño con personalidad.",
    priceMin: 98700,
    priceMay: 82250,
    category: ["Bolso"],
    material: ["tela puffer"],
    colors: [
      { name: "verde", stock: 0 }
    ],
    height: 30,
    width: 30,
    depth: 15,
    imgPrimary: "",
    imgSecondary: ""
  },
  {
    code: "BOL002",
    name: "Bolso avril",
    style: ["Urbana", "Casual", "Diario", "Viaje", "Playa", "Deporte"],
    description: "Bolso Universitario – Todo lo que necesitás, con el sello Chueks\n\nEl Bolso Universitario fue diseñado para acompañarte en jornadas largas con estilo y organización. Confeccionado en tela Andorra impermeable y forrado con el exclusivo forro personalizado “Chueks”, combina practicidad, diseño y resistencia.\n\nEn su interior cuenta con porta botella o termo desmontable, un bolsillo acolchado para notebook y varios compartimientos para mantener todo en orden. En el exterior, suma bolsillos laterales, un bolsillo frontal abierto y con cierre, y una chapa plástica frontal que lleva el sello de la marca.\n\nIncluye manijas cortas y una correa larga desmontable y regulable, ambas personalizadas, para que lo lleves como más te guste. Con medidas de 38 x 32 x 16 cm, e…",
    priceMin: 79380,
    priceMay: 66150,
    category: ["Bolso"],
    material: ["tela Andorra"],
    colors: [
      { name: "vison", stock: 0 },
      { name: "negro", stock: 0 }
    ],
    height: 38,
    width: 32,
    depth: 16,
    imgPrimary: "",
    imgSecondary: ""
  },
  {
    code: "BOL003",
    name: "Bolso universitario xl",
    style: ["Urbana", "Casual", "Diario", "Viaje", "Playa", "Deporte"],
    description: "Bolso Universitario XL – Espacio extra, mismo estilo Chueks\n\nEl Universitario XL es la versión ampliada de nuestro clásico bolso, ideal para quienes necesitan más espacio sin resignar diseño. Confeccionado en tela Andorra impermeable y con forro personalizado “Chueks”, ofrece resistencia y personalidad en cada detalle.\n\nSu interior cuenta con porta botella o termo desmontable, bolsillo acolchado para notebook y organización inteligente. En el exterior, incorpora bolsillos laterales, un bolsillo frontal abierto y con cierre, y una chapa plástica distintiva que refleja el sello de la marca.\n\nCon manijas cortas y correa larga desmontable y regulable, ambas personalizadas, este bolso de 42 x 32 x 16 cm es perfecto para el día a día universitario, laboral o cualquier rutina que requiera funcionalidad con onda.",
    priceMin: 98850,
    priceMay: 82375,
    category: ["Bolso"],
    material: ["tela Andorra"],
    colors: [
      { name: "negro", stock: 0 }
    ],
    height: 42,
    width: 32,
    depth: 16,
    imgPrimary: "",
    imgSecondary: ""
  },
  {
    code: "BOL005",
    name: "Bolso italia",
    style: ["Urbana", "Casual", "Diario", "Viaje", "Playa", "Deporte"],
    description: "Bolso Italia – Sofisticación y funcionalidad en una sola pieza\n\nEl Bolso Italia es sinónimo de elegancia práctica. Confeccionado en símil cuero y forrado con el exclusivo forro sublimado \"Chueks\", este modelo combina diseño refinado con detalles funcionales.\n\nCuenta con un bolsillo interno y un bolsillo exterior trasero, ideales para organizar tus esenciales. Su chapa de resina frontal y cierre metálico aportan un toque distintivo. Además, la correa desmontable te permite adaptarlo a diferentes estilos de uso.\n\nCon medidas de 30 x 40 x 10 cm, el Italia es perfecto para quienes buscan un bolso amplio, versátil y con presencia.",
    priceMin: 101640,
    priceMay: 84700,
    category: ["Bolso"],
    material: ["símil cuero"],
    colors: [
      { name: "suela", stock: 0 }
    ],
    height: 30,
    width: 40,
    depth: 10,
    imgPrimary: "",
    imgSecondary: ""
  },
  {
    code: "BOL006",
    name: "Bolso puffer",
    style: ["Urbana", "Casual", "Diario", "Viaje", "Playa", "Deporte"],
    description: "Bolso Tote Puffer – Ligero, canchero y listo para todo\n\nEl Tote Puffer es el bolso ideal para quienes buscan estilo relajado y funcionalidad. Confeccionado en puffer canelón, ofrece un diseño liviano y cómodo, perfecto para el día a día.\n\nSu forro negro, el cierre plástico y la chapa plástica frontal completan un look urbano con sello Chueks. Amplio, versátil y con mucha onda, el Tote Puffer es ese esencial que no puede faltar en tu outfit diario.",
    priceMin: 46050,
    priceMay: 38375,
    category: ["Bolso"],
    material: ["tela puffer"],
    colors: [
      { name: "negro", stock: 0 }
    ],
    height: null,
    width: null,
    depth: null,
    imgPrimary: "",
    imgSecondary: ""
  },
  {
    code: "BOL007A",
    name: "Matera summer",
    style: ["Urbana", "Casual", "Diario", "Viaje", "Playa", "Deporte"],
    description: "Matero Summer – Todo lo que necesitás para llevar el mate con estilo\n\nEl Matero Summer es mucho más que un bolso: es el compañero ideal para tus momentos de relax. Disponible en tres versiones con mucha onda —puffer metalizado rombo, puffer estampado print, y tela Andorra impermeable en negro o beige—, cada modelo se adapta a tu estilo.\n\nSu interior está forrado en silver negro, e incluye sujeta termo y vaso, además de un bolsillo interno para mayor organización. En el exterior, cuenta con dos bolsillos delanteros, manijas cortas y correa larga regulable, para que lo lleves como quieras. Incluye yerbera y porta mate, porque en Chueks pensamos en todo.\n\nCon medidas de 30 x 28 x 15 cm, el Matero Summer combina funcionalidad, diseño y espíritu outdoor con el sello de tu marca",
    priceMin: 94280,
    priceMay: 78570,
    category: ["Matera"],
    material: ["tela puffer"],
    colors: [
      { name: "negro", stock: 0 },
      { name: "beige", stock: 0 },
      { name: "animal print", stock: 0 }
    ],
    height: 30,
    width: 28,
    depth: 15,
    imgPrimary: "",
    imgSecondary: ""
  },
  {
    code: "BOL007B",
    name: "Matera summer",
    style: ["Urbana", "Casual", "Diario", "Viaje", "Playa", "Deporte"],
    description: "Matero Summer – Todo lo que necesitás para llevar el mate con estilo\n\nEl Matero Summer es mucho más que un bolso: es el compañero ideal para tus momentos de relax. Disponible en tres versiones con mucha onda —puffer metalizado rombo, puffer estampado print, y tela Andorra impermeable en negro o beige—, cada modelo se adapta a tu estilo.\n\nSu interior está forrado en silver negro, e incluye sujeta termo y vaso, además de un bolsillo interno para mayor organización. En el exterior, cuenta con dos bolsillos delanteros, manijas cortas y correa larga regulable, para que lo lleves como quieras. Incluye yerbera y porta mate, porque en Chueks pensamos en todo.\n\nCon medidas de 30 x 28 x 15 cm, el Matero Summer combina funcionalidad, diseño y espíritu outdoor con el sello de tu marca",
    priceMin: 94280,
    priceMay: 78570,
    category: ["Matera"],
    material: ["tela Andorra"],
    colors: [
      { name: "negro", stock: 0 },
      { name: "beige", stock: 0 },
      { name: "animal print", stock: 0 }
    ],
    height: 30,
    width: 28,
    depth: 15,
    imgPrimary: "",
    imgSecondary: ""
  },
  {
    code: "BOL008A",
    name: "Matera barcelo",
    style: ["Urbana", "Casual", "Diario", "Viaje", "Playa", "Deporte"],
    description: "Matero Barceló – Estilo urbano para tu ritual matero\n\nEl Matero Barceló combina diseño moderno y funcionalidad en un formato ideal para quienes llevan el mate a todas partes. Confeccionado en puffer liviano, aporta un look actual y relajado, sin resignar capacidad.\n\nCuenta con cierres plásticos tipo diente de perro, correa regulable y desmontable, y está completamente forrado con el exclusivo gross sublimado “Chueks”, que resalta la identidad de la marca en cada detalle.\n\nCon medidas de 25 x 40 x 15 cm, el Barceló es amplio, cómodo y perfecto para organizar tu kit matero con estilo y personalidad.",
    priceMin: 94280,
    priceMay: 78570,
    category: ["Matera"],
    material: ["tela puffer"],
    colors: [
      { name: "negro", stock: 0 }
    ],
    height: 25,
    width: 40,
    depth: 15,
    imgPrimary: "",
    imgSecondary: ""
  },
  {
    code: "BOL008B",
    name: "Matera barcelo",
    style: ["Urbana", "Casual", "Diario", "Viaje", "Playa", "Deporte"],
    description: "Matero Barceló – Estilo urbano para tu ritual matero\n\nEl Matero Barceló combina diseño moderno y funcionalidad en un formato ideal para quienes llevan el mate a todas partes. Confeccionado en puffer liviano, aporta un look actual y relajado, sin resignar capacidad.\n\nCuenta con cierres plásticos tipo diente de perro, correa regulable y desmontable, y está completamente forrado con el exclusivo gross sublimado “Chueks”, que resalta la identidad de la marca en cada detalle.\n\nCon medidas de 25 x 40 x 15 cm, el Barceló es amplio, cómodo y perfecto para organizar tu kit matero con estilo y personalidad.",
    priceMin: 94280,
    priceMay: 78570,
    category: ["Matera"],
    material: ["tela puffer"],
    colors: [
      { name: "verde", stock: 0 }
    ],
    height: 25,
    width: 40,
    depth: 15,
    imgPrimary: "",
    imgSecondary: ""
  },
  {
    code: "BOL009",
    name: "Matera tokio",
    style: ["Urbana", "Casual", "Diario", "Viaje", "Playa", "Deporte"],
    description: "Matera Tokio – Diseño funcional para los que viven el mate a su manera\n\nLa Matera Tokio está pensada para quienes buscan practicidad sin resignar estilo. Confeccionada en tela impermeable, es resistente y liviana, ideal para acompañarte en salidas, viajes o la rutina diaria.\n\nSu interior forrado en silver negro incluye sujeta termo y bombilla, mientras que los dos bolsillos laterales te permiten tener todo al alcance. La correa desmontable y regulable ofrece comodidad total, y la chapa plástica frontal le da ese toque distintivo Chueks.\n\nCon medidas de 50 x 20 x 15 cm, la Tokio es la opción perfecta para quienes llevan el mate como parte de su estilo de vida.",
    priceMin: 85300,
    priceMay: 71100,
    category: ["Matera"],
    material: ["tela Andorra"],
    colors: [
      { name: "negro", stock: 0 }
    ],
    height: 50,
    width: 20,
    depth: 15,
    imgPrimary: "",
    imgSecondary: ""
  },
  // ----- MOCHILAS -----
  {
    code: "MO001",
    name: "Mochila ibiza",
    style: ["Urbana", "Casual", "Diario", "Viaje", "Playa", "Deporte"],
    description: "",
    priceMin: 115680,
    priceMay: 96400,
    category: ["Mochila"],
    material: "",
    colors: [
      { name: "crema", stock: 0 },
      { name: "negro", stock: 0 }
    ],
    height: null,
    width: null,
    depth: null,
    imgPrimary: "",
    imgSecondary: ""
  },
  {
    code: "MO002",
    name: "Mochila londres",
    style: ["Urbana", "Casual", "Diario", "Viaje", "Playa", "Deporte"],
    description: "Mochila Mini Londres\nChica en tamaño, gigante en personalidad. La Mini Londres está hecha para quienes saben que el estilo está en los detalles. Confeccionada en símil cuero y con un diseño compacto pero funcional, es ideal para llevar lo justo sin perder onda.\n\nSu interior forrado con el clásico CHUEKS sublimado le suma identidad propia. Apertura con cierre metálico que aporta ese touch moderno, y bolsillo interno para mantener el orden sin esfuerzo.\n\nCompacta y con carácter: 27x21x10 cm",
    priceMin: 84150,
    priceMay: 70150,
    category: ["Mochila"],
    material: ["símil cuero"],
    colors: [
      { name: "beige", stock: 0 },
      { name: "negro", stock: 0 }
    ],
    height: 27,
    width: 21,
    depth: 10,
    imgPrimary: "",
    imgSecondary: ""
  },
  {
    code: "MO003",
    name: "Mochila berlin",
    style: ["Urbana", "Casual", "Diario", "Viaje", "Playa", "Deporte"],
    description: "Mochila Berlín\nDiseñada para moverte con estilo, la Berlín no es solo una mochila: es tu compañera de ruta. Confeccionada en símil cuero de alta calidad, tiene una onda urbana que combina con todo.\n\nPor dentro, el forro CHUEKS sublimado le pone la firma a cada detalle. Cierre metálico vertical que suma diseño y seguridad, bolsillo interno para que lleves lo esencial a mano, y correa regulable e intercambiable para que la adaptes a tu flow del día.\n\nTamaño ideal para el ritmo de la ciudad: 30x25x10 cm.",
    priceMin: 94280,
    priceMay: 78570,
    category: ["Mochila"],
    material: ["símil cuero"],
    colors: [
      { name: "beige", stock: 0 },
      { name: "negro", stock: 0 },
      { name: "borgoña", stock: 0 }
    ],
    height: 30,
    width: 25,
    depth: 10,
    imgPrimary: "",
    imgSecondary: ""
  },
  {
    code: "MO004",
    name: "Mochila barcelona",
    style: ["Urbana", "Casual", "Diario", "Viaje", "Playa", "Deporte"],
    description: "Mochila Barcelona\nPara los que van siempre un paso adelante, la Barcelona es esa mezcla justa entre estilo y practicidad. Confeccionada en resistente tela Andorra, está pensada para bancarse el ritmo del día a día sin perder actitud.\n\nLleva nuestro forro sublimado CHUEKS, porque los detalles importan. Se abre con solapa y hebilla, sumando seguridad y onda. Tiene bolsillo interno acolchonado para notebook y dos bolsillos laterales que hacen todo más fácil.\n\nListo para la acción: 38x25x15 cm.",
    priceMin: 94280,
    priceMay: 78570,
    category: ["Mochila"],
    material: ["tela Andorra"],
    colors: [
      { name: "negro", stock: 0 },
      { name: "suela", stock: 0 },
      { name: "nude", stock: 0 }
    ],
    height: 38,
    width: 25,
    depth: 15,
    imgPrimary: "",
    imgSecondary: ""
  },
  {
    code: "MO005",
    name: "Mochila jackie",
    style: ["Urbana", "Casual", "Diario", "Viaje", "Playa", "Deporte"],
    description: "Mochila Jackie\nDiseño limpio, esencia callejera. La Jackie es esa mochila que combina funcionalidad y estilo sin esfuerzo. Confeccionada en tela impermeable, está lista para acompañarte en cualquier plan, llueva o truene.\n\nTiene cierre metálico, chapa de resina que marca identidad, y correa regulable para llevarla como más te guste. Por dentro, el forro sublimado CHUEKS le da ese toque único, mientras que el bolsillo interno y el bolsillo trasero te ayudan a tener todo a mano y bien organizado.\n\nCompacta, versátil y con toda la personalidad CHUEKS.",
    priceMin: 101280,
    priceMay: 84400,
    category: ["Mochila"],
    material: ["tela Andorra"],
    colors: [
      { name: "verde", stock: 0 },
      { name: "negro", stock: 0 }
    ],
    height: null,
    width: null,
    depth: null,
    imgPrimary: "",
    imgSecondary: ""
  },
  {
    code: "MO006",
    name: "Mochila portanotebook",
    style: ["Urbana", "Casual", "Diario", "Viaje", "Playa", "Deporte", "Trabajo"],
    description: "Mochila Porta Notebook\nMinimalista, resistente y con toda la actitud CHUEKS. Esta mochila está confeccionada en tela impermeable para que ni la lluvia frene tus planes.\n\nTiene cierre plástico tipo diente de perro, correas reforzadas que aguantan lo que le pongas, y un bolsillo exterior con broche imán para acceso rápido y seguro. El interior en tafeta negra mantiene todo prolijo y con un look clean.\n\nDetalles que suman: chapa plástica frontal y formato slim para moverte liviano.\nMedidas: 25x35x5 cm.",
    priceMin: 65250,
    priceMay: 54380,
    category: ["Mochila"],
    material: ["tela Andorra"],
    colors: [
      { name: "beige", stock: 0 },
      { name: "verde", stock: 0 },
      { name: "negro", stock: 0 }
    ],
    height: 25,
    width: 35,
    depth: 5,
    imgPrimary: "",
    imgSecondary: ""
  },
  // ----- NECESERES -----
  {
    code: "NEC001",
    name: "Neceser puffer",
    style: ["Urbana", "Casual", "Diario", "Viaje", "Playa", "Deporte", "Trabajo"],
    description: "",
    priceMin: 32400,
    priceMay: 27000,
    category: ["Neceser"],
    material: ["tela puffer"],
    colors: [
      { name: "negro", stock: 0 },
      { name: "verde", stock: 0 }
    ],
    height: null,
    width: null,
    depth: null,
    imgPrimary: "",
    imgSecondary: ""
  },
  {
    code: "NEC002",
    name: "Neceser neoprene",
    style: ["Urbana", "Casual", "Diario", "Viaje", "Playa", "Deporte", "Trabajo"],
    description: "",
    priceMin: 32400,
    priceMay: 27000,
    category: ["Neceser"],
    material: ["neoprene"],
    colors: [
      { name: "negro", stock: 0 },
      { name: "verde", stock: 0 }
    ],
    height: null,
    width: null,
    depth: null,
    imgPrimary: "",
    imgSecondary: ""
  },
  {
    code: "NEC003",
    name: "Neceser transparente",
    style: ["Urbana", "Casual", "Diario", "Viaje", "Playa", "Deporte", "Trabajo"],
    description: "",
    priceMin: 27600,
    priceMay: 22990,
    category: ["Neceser"],
    material: ["tela Andorra"],
    colors: [
      { name: "verde", stock: 0 },
      { name: "nude", stock: 0 },
      { name: "negro", stock: 0 }
    ],
    height: null,
    width: null,
    depth: null,
    imgPrimary: "",
    imgSecondary: ""
  },
  {
    code: "NEC004",
    name: "Neceser mini guarda tutti",
    style: ["Urbana", "Casual", "Diario", "Viaje", "Playa", "Deporte", "Trabajo"],
    description: "",
    priceMin: 12500,
    priceMay: 10400,
    category: ["Neceser"],
    material: ["tela Andorra"],
    colors: [
      { name: "verde", stock: 0 },
      { name: "nude", stock: 0 },
      { name: "negro", stock: 0 }
    ],
    height: null,
    width: null,
    depth: null,
    imgPrimary: "",
    imgSecondary: ""
  },
  // ----- PORTACELULAR -----
  {
    code: "PORT001",
    name: "Portacelular",
    style: ["Urbana", "Casual", "Diario", "Viaje", "Playa", "Deporte", "Trabajo"],
    description: "",
    priceMin: 34050,
    priceMay: 28775,
    category: ["Bolso"],
    material: [""],
    colors: [
      { name: "negro", stock: 0 }
    ],
    height: null,
    width: null,
    depth: null,
    imgPrimary: "",
    imgSecondary: ""
  },
  // ----- SOBRES -----
  {
    code: "SOB001",
    name: "Sobre con tapa",
    style: ["Fiesta", "Noche", "Trabajo", "Viaje"],
    description: "a completar",
    priceMin: 46800,
    priceMay: 39000,
    category: ["Clutch/Sobre"],
    material: [""],
    colors: [
      { name: "negro", stock: 0 }
    ],
    height: null,
    width: null,
    depth: null,
    imgPrimary: "",
    imgSecondary: ""
  },
  // ----- TARJETEROS -----
  {
    code: "TAR001",
    name: "Tarjetero con cierre",
    style: ["Urbana", "Casual", "Diario"],
    description: "El complemento que no sabías que necesitabas. Nuestro tarjetero está pensado para acompañarte todos los días: \n* Confeccionado en símil cuero de alta calidad\n* Cinco divisiones súper prácticas para tener todo a mano\n* Cierre metálico seguro y con onda\n* Compacto y funcional – mide 13x8x2 cm",
    priceMin: 22680,
    priceMay: 18900,
    category: ["Tarjetero","Accesorios"],
    material: ["símil cuero"],
    colors: [
      { name: "lila", stock: 10 },
      { name: "verde", stock: 10 }
    ],
    height: 13,
    width: 8,
    depth: 2,
    imgPrimary: "https://d28hi93gr697ol.cloudfront.net/4a15db8f-2205-0dda/img/Producto/162e1476-7968-4fca-6a9b-c756e5aea306/IMG-4418-684318394f3cd.webp",
    imgSecondary: "https://d28hi93gr697ol.cloudfront.net/4a15db8f-2205-0dda/img/Producto/162e1476-7968-4fca-6a9b-c756e5aea306/IMG-4417-6843183981bb7-O.jpg"
  },
  {
    code: "TAR002",
    name: "Tarjetero acordeon",
    style: ["Urbana", "Casual", "Diario"],
    description: "Ideal para cartera, mochila o bolsillo. Chiquito, pero con toda la actitud Chueks.\nUn detalle que marca la diferencia.\nEste complemento es el equilibrio justo entre estilo y funcionalidad:\n* Confeccionado en símil cuero, resistente y con mucha presencia\n* Cierre metálico que asegura todo en su lugar\n* Grabado láser que le da un toque único\n* Medidas ideales: 11x7x3 cm\n* Consultá por los colores disponibles y elegí el que más va con vos",
    priceMin: 42050,
    priceMay: 35375,
    category: ["Tarjetero", "Accesorios"],
    material: ["símil cuero"],
    colors: [
      { name: "animal print", stock: 10 },
      { name: "suela", stock: 10 },
      { name: "nude", stock: 10 }
    ],
    height: 11,
    width: 7,
    depth: 3,
    imgPrimary:"https://d28hi93gr697ol.cloudfront.net/4a15db8f-2205-0dda/img/Producto/162e1476-7968-4fca-6a9b-c756e5aea306/IMG-3333-684318392b895.webp",
    imgSecondary:"https://d28hi93gr697ol.cloudfront.net/4a15db8f-2205-0dda/img/Producto/162e1476-7968-4fca-6a9b-c756e5aea306/IMG-4419-684318396b936-O.jpg"
  }
];

module.exports = productsSeed;
