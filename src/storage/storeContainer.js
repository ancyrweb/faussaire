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

const createStoreContainer = (): StoreContainerType => {
  let stores: Array<StoreType> = [];

  const storeContainer: StoreContainerType = {
    getStore: (name: string): ?StoreType => {
      return stores.find((entity: StoreType):boolean => entity.name === name);
    },
    addStore: (store: StoreType): StoreContainerType => {
      stores.push(store);
      return storeContainer;
    },
    all: () => stores,
    resetAll: (): StoreContainerType => {
      [].slice.call(stores).forEach((store: StoreType) => { store.reset(); });
      return storeContainer;
    },
    assemble: (entity: StorableType): Object => {

      return {};
    }
  };

  return storeContainer;
};

export default {
  createStoreContainer
}