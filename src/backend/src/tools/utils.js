function isValidEmail(email) {
  const emailRegex = /^[^@]+@[^@]+.[^@]+/;
  return emailRegex.test(email);
}

function castObject(source, allowedKeys) {
  const object = {};

  for (const key of allowedKeys) {
    if (Object.keys(source).indexOf(key) !== -1) {
      object[key] = source[key];
    }
  }

  return object;
}

module.exports = {
  isValidEmail,
  castObject
};
