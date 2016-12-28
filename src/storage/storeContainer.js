// @flow
import type { StoreType } from './store';
import type { StorableType } from './storable';

export type StoreContainerType = {
  getStore: (name: string) => ?StoreType,
  addStore: (store: StoreType) => StoreContainerType,
  all: () => Array<StoreType>,
  resetAll: () => StoreContainerType,
  assemble: (entity: StorableType, config: AssembleConfiguration) => Object,
}

export type AssembleConfiguration = {
  schema: ?Array<any>
};

import { isStorableLink } from './storableLink';

/**
 * Create a StoreContainer
 * @returns {StoreContainerType}
 */
const createStoreContainer = (): StoreContainerType => {
  let stores: Array<StoreType> = [];

  const storeContainer: StoreContainerType = {
    /**
     * Return a store given his name
     * @param name
     * @returns {StoreType}
     */
    getStore: (name: string): ?StoreType => {
      return stores.find((entity: StoreType):boolean => entity.name === name);
    },

    /**
     * Add a store to the container
     * @param store
     * @returns {StoreContainerType}
     */
    addStore: (store: StoreType): StoreContainerType => {
      stores = [
        ...stores,
        store,
      ];

      return storeContainer;
    },

    /**
     * Return the array of stores
     * @returns {Array<StoreType>}
     */
    all: () => stores,

    /**
     * Reset all the stores to their initial state
     * @returns {StoreContainerType}
     */
    resetAll: (): StoreContainerType => {
      [].slice.call(stores).forEach((store: StoreType) => { store.reset(); });
      return storeContainer;
    },

    /**
     * Assemble an entity, returns the scalar version of the data
     * @param entity
     * @param config
     * @returns {{}}
     */
    assemble: (entity: StorableType, config: AssembleConfiguration = {
      schema: [],
    }): Object => {
      let data = Object.assign({}, entity.getData());
      let nextData = {};

      // If there's schema
      if(config.hasOwnProperty("schema") && Array.isArray(config.schema) && config.schema.length){

        // We remove all the keys we don't want
        let schema = config.schema;
        Object.keys(data).forEach((key: string) => {
          if (schema.indexOf(key) < 0) {
            delete data[key];
          }
        });
      }

      // We process the object in case of storableLink to manage
      Object.keys(data).forEach((key: string) => {
        if(isStorableLink(data[key])){
          let storable = data[key].getStorable();

          if(Array.isArray(storable)){
            nextData[key] = storable.map((item: StorableType) => item.getData());
          } else {
            nextData[key] = storable.getData();
          }
        } else {
          nextData[key] = data[key];
        }
      });

      return nextData;
    }
  };

  return storeContainer;
};

export default {
  createStoreContainer
}

/*
 // Return only the wanted keys
 Object.keys(data).forEach((key: string) => {
 if(schema.indexOf(key) >= 0){
 if(isStorableLink(data[key])){
 let storable = data[key].getStorable();

 if(Array.isArray(storable)){
 nextData[key] = storable.map((item: StorableType) => item.getData());
 } else {

 }
 } else {
 nextData[key] = data[key];
 }
 }
 });

 return nextData;
 */