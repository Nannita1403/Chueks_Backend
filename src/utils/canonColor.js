// Normaliza los colores a lowercase, sin espacios
const canonColor = (c) => (c ? String(c).trim().toLowerCase() : undefined);

module.exports = canonColor;
