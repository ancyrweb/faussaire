const route = (obj) => {
  return Object.assign({}, {
    template: "",
    methods: ["GET"],
    controller: {}
  }, obj);
};

export default route;