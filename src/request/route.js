// @flow
import type Controller from './controller';

export type RouteType = {
  template: string,
  methods: Array<string>,
  controller: Controller
}

const createRoute = (obj: Object): RouteType =>  {
  return Object.assign({}, {
    template: "",
    methods: ["GET"],
    controller: {}
  }, obj);
};

export default createRoute;