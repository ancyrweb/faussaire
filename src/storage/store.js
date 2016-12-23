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
  let items: Array<StorableType> = initialState;
  let storeInitialState: Array<StorableType> = initialState;

  const store: StoreType = {
    /**
     * @var string
     */
    name: name,

    /**
     * Restore the initial state of the store
     * @returns {StoreType}
     */
    reset: () => {
      items = Array.from(storeInitialState);
      return store;
    },

    /**
     * Add a storable to the store
     * @param entity
     * @returns {StoreType}
     */
    addStorable: (entity: StorableType): StoreType => {
      items = [
        ...items,
        entity
      ];

      return store;
    },

    /**
     * Convert an object into a storable and add it to the store
     * @param entity
     * @returns {StoreType}
     */
    add: (entity: Object): StoreType => {
      items = [
        ...items,
        storableFactory.createStorable(entity)
      ];

      return store;
    },

    /**
     * Remove the storable from the store
     * @param id
     * @returns {StoreType}
     */
    remove: (id: number): StoreType => {
      items = items.filter((entity: StorableType) => entity.getData().id !== id);
      return store;
    },

    /**
     * Update the storable with a new storable
     * @param id
     * @param next
     * @returns {StoreType}
     */
    update: (id: number, next: StorableType):StoreType => {
      items = items.map((storable: StorableType) => {
        if(storable.getData().id !== id){
          return storable;
        }

        return next;
      });

      return store;
    },

    /**
     * Return the storable having the given ID
     * @param id
     * @returns {StorableType}
     */
    get: (id: number): ?StorableType => {
      return items.find((entity: StorableType):boolean => entity.getData().id === id);
    },

    /**
     * Return the store
     * @returns {Array<StorableType>}
     */
    all: (): Array<StorableType> => items,

    /**
     * Create a storable
     * @returns {StorableType}
     */
    createStorable: storableFactory.createStorable,
  };

  return store;
};

export default {
  createStore,
  createStorable: storableFactory.createStorable
}