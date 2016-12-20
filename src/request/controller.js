const controller = (obj) => {
  return Object.assign({}, {
    run: () => {},
    authenticate: undefined
  }, obj);
};

export default controller;