// @flow
import StorableException from './exception/storableException';
import { isStorableLink } from './storableLink';

export type StorableData = {
  id: number,
}

export type StorableType = {
  getData: () => StorableData,
  merge: (data: StorableData) => void,
  clone: () => StorableType,
};

export type StorableFactoryType = {
  createStorable: (object: Object) => StorableType
};

/**
 * Return true if the parameter is scalar
 * @param obj
 */
export const isScalar = (obj: any) => (/string|number|boolean/).test(typeof obj);
const checkObjectValues = (object) => {
  Object.keys(object).forEach(key => {
    if(!isScalar(object[key]) && !isStorableLink(object[key]) && object[key] !== null){
      if(typeof object[key] === "object" && !Array.isArray(object[key])){
        checkObjectValues(object[key]);
      } else {
        throw StorableException("A storable object must only have scalar values. Check the value for key " + key);
      }
    }
  });
};


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

  checkObjectValues(object);

  return ((entity: Object): StorableType => {
    let _data = Object.assign({}, entity);

    let obj = {
      getData:() : StorableData => _data,
      merge: (data: StorableData) => {
        if(data.id){
          throw StorableException("You can't supply an ID in merge.");
        }

        _data = Object.assign({}, _data, data);
      },
      clone: ():StorableType => createStorable(_data),
    };

    return obj;
  })(object);
};

const storableFactory: StorableFactoryType = {
  createStorable
};

export default storableFactory;