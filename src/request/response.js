// @flow
export type Response = {
  data: ?Object,
  status: number,
  statusText: string,
  headers: Object
};

const response = (obj: Object):Response => {
  return Object.assign({}, {
    data: undefined,
    status: undefined,
    statusText: undefined,
    headers: {}
  }, obj);
};

export default response;