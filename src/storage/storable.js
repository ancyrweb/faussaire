// @flow
import StorableException from './exception/storableException';

export type StorableData = {
  id: number,
}

export type StorableType = {
  getData: () => StorableData,
  setData: (schema: StorableData) => void,
  getSchema: () => Object,
};

export type StorableFactoryType = {
  createStorable: (object: Object) => StorableType
};

/**
 * Return true if the parameter is scalar
 * @param obj
 */
export const isScalar = (obj: any) => (/string|number|boolean/).test(typeof obj);

/**
 * Create a Storable from the given object.
 * @param object
 * @returns {Object}
 */
const createStorable = (object: Object): StorableType => {
  if(typeof object !== "object"){
    throw StorableException("The parameter of createStorable must be an object");
  }

  if(!object.hasOwnProperty("id")){
    throw StorableException("A storable must have an ID.");
  }

  Object.keys(object).forEach(key => {
    if(!isScalar(object[key])){
      throw StorableException("A storable object must only have scalar values. Check the value for key " + key);
    }
  });

  return ((entity: Object): StorableType => {
    let _data = Object.assign({}, entity);
    let _schema = {};

    Object.keys(entity).forEach(key => {
      _schema[key] = {
        name: key,
        type: typeof entity[key]
      };
    });

    return  {
      getData:() : StorableData => _data,
      setData: (data: StorableData) => {
        _data = Object.assign({}, data);
      },
      getSchema:() : Object => _schema,
    };
  })(object);
};

const storableFactory: StorableFactoryType = {
  createStorable
};

export default storableFactory;