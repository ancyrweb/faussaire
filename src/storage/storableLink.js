// @flow
import type { StorableType } from './storable';
import type { StoreType } from './store';

export type StorableLinkType = {
  getStorable: () => ?StorableType|Array<?StorableType>
};

/**
 * Representa oneToOne relationship
 * @param store
 * @param id
 * @returns {{getStorable: (function())}}
 */
export const toOne = (store: StoreType, id: number): StorableLinkType => {
  return {
    getStorable: () => store.get(id)
  }
};

/**
 * Represents a oneToMany relationship
 * @param store
 * @param ids
 * @returns {{getStorable: (function(): Array)}}
 */
export const toMany = (store: StoreType, ids: Array<number>): StorableLinkType => {
  return {
    getStorable: () => ids.map(id => store.get(id))
  }
};

/**
 * Return true if the given value is a storableLink
 * @param value
 */
export const isStorableLink = (value: Object) => value.getStorable && typeof value.getStorable === "function";
export default {
  toOne,
  toMany,
};