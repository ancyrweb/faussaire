// @flow
import type { StoreType } from './store';
import type { StorableType } from './storable';

export type StoreContainerType = {
  getStore: (name: string) => ?StoreType;
  addStore: (store: StoreType) => StoreContainerType;
  all: () => Array<StoreType>,
  resetAll: () => StoreContainerType;
  assemble: (entity: StorableType) => Object;
}

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
     * Assemble an entity by linking the StorableLink to their actual ressource
     * @param entity
     * @returns {{}}
     */
    assemble: (entity: StorableType): Object => {

      return {};
    }
  };

  return storeContainer;
};

export default {
  createStoreContainer
}