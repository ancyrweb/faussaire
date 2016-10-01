const response = (obj) => {
  return Object.assign({}, {
    data: undefined,
    status: undefined,
    statusText: undefined,
    headers: {}
  }, obj);
};

module.exports = response;