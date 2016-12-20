// @flow
import StorableException from './exception/storableException';

export type StorableType = {
  id: number
};

export type StorableFactoryType = {
  createStorable: (object: Object) => StorableType
};

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

  return object;
};

const storableFactory: StorableFactoryType = {
  createStorable
}

export default storableFactory;