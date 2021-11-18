const bcrypt = require("bcrypt");

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);
  return hashed;
};

const validatePass = async (bodyPass, userPass) => {
  const validated = await bcrypt.compare(bodyPass, userPass);
  return validated;
};

module.exports = { hashPassword, validatePass };
