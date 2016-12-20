// @flow
import type { StorableType } from './storable';
import storableFactory from './storable';

export type StoreType = {
  name: string,

  reset: () => StoreType,
  addStorable: (item: StorableType) => StoreType,
  add: (item: Object) => StoreType,
  remove: (id: number) => StoreType,
  update: (id: number, next: StorableType) => StoreType,
  get: (id: number) => ?StorableType,
  all: () => Array<StorableType>,
  createStorable: (object: Object) => StorableType
};

const createStore = (name: string, initialState: Array<StorableType> = []):StoreType => {
  let items: Array<StorableType> = [];
  let storeInitialState: Array<StorableType> = initialState;

  const store: StoreType = {
    name,

    reset: () => {
      items = Array.from(storeInitialState);
      return store;
    },
    addStorable: (entity: StorableType): StoreType => {
      items.push(entity);
      return store;
    },
    add: (entity: Object): StoreType => {
      items.push(storableFactory.createStorable(entity));
      return store;
    },
    remove: (id: number): StoreType => {
      items = items.filter((entity: StorableType) => entity.id !== id);
      return store;
    },
    update: (id: number, next: StorableType):StoreType => {
      for(let i = 0; i < items.length; i++){
        if(items[i].id === id){
          items[i] = next;
          break;
        }
      }

      return store;
    },
    get: (id: number): ?StorableType => {
      return items.find((entity: StorableType):boolean => entity.id === id);
    },
    all: (): Array<StorableType> => items,
    createStorable: storableFactory.createStorable,
  };

  return store;
};

export default {
  createStore,
  createStorable: storableFactory.createStorable
}