// @flow
import type { Response } from './response';

export type Controller = {
  run: (params: Object, options: Object) => Response,
  authenticate: (params: Object, options: Object) => ?Object
};

const createController = (obj: Object):Controller => {
  return Object.assign({}, {
    run: () => {},
    authenticate: undefined
  }, obj);
};

export default createController;