// @flow
import type { StorableType } from './storable';
import type { StoreType } from './store';
import type { StoreContainerType } from './storeContainer';

export type StorableLinkType = {
  getStorable: () => ?StorableType|Array<?StorableType>
};

/**
 * Representa oneToOne relationship
 * @param container
 * @param store
 * @param id
 * @returns {{getStorable: (function())}}
 */
export const toOne = (container: StoreContainerType, store: string, id: number): StorableLinkType => {
  return {
    getStorable: () => container.getStore(store).get(id)
  }
};

/**
 * Represents a oneToMany relationship
 *  @param container
 * @param store
 * @param ids
 * @returns {{getStorable: (function(): Array)}}
 */
export const toMany = (container: StoreContainerType, store: StoreType, ids: Array<number>): StorableLinkType => {
  return {
    getStorable: () => ids.map(id => container.getStore(store).get(id))
  }
};

/**
 * Return true if the given value is a storableLink
 * @param value
 */
export const isStorableLink = (value: Object) => value && typeof value === "object" && value.getStorable && typeof value.getStorable === "function";
export default {
  toOne,
  toMany,
};