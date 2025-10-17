export function validateCheckout(user) {
  const errors = [];
  if (!user.addresses || user.addresses.length === 0) {
    errors.push("Debes agregar al menos una dirección antes de realizar un pedido.");
  }
  if (!user.telephones || user.telephones.length === 0) {
    errors.push("Debes agregar al menos un teléfono antes de realizar un pedido.");
  }
  return errors;
}

export function getCheckoutData(user) {
  const errors = validateCheckout(user);
  if (errors.length) return { errors };
  const address = user.addresses.find(a => a.default) || user.addresses[0];
  const telephone = user.telephones.find(p => p.default) || user.telephones[0];
  return { address, telephone, errors: [] };
}
