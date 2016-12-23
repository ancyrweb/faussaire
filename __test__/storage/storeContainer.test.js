import storeContainerFactory from '../../src/storage/storeContainer';
import storeFactory from '../../src/storage/store';

test('create store container', () => {
  const storeContainer = storeContainerFactory.createStoreContainer();
  expect(typeof storeContainer.addStore).toBe("function");
  expect(typeof storeContainer.getStore).toBe("function");
  expect(typeof storeContainer.all).toBe("function");
  expect(typeof storeContainer.resetAll).toBe("function");
  expect(typeof storeContainer.assemble).toBe("function");
});

test('add and get store', () => {
  const storeContainer = storeContainerFactory.createStoreContainer();
  storeContainer.addStore(storeFactory.createStore("Users"));

  expect(storeContainer.getStore("Users").name).toEqual("Users");
});

test('reset all', () => {
  const storeContainer = storeContainerFactory.createStoreContainer();
  const store = storeFactory.createStore("Users");

  storeContainer.addStore(store);
  store
    .add({ id: 1, username: "John"})
    .add({ id: 2, username: "Doe"})
  ;

  expect(storeContainer.getStore("Users").get(1).getData()).toEqual({ id: 1, username: "John" });
  expect(storeContainer.getStore("Users").get(2).getData()).toEqual({ id: 2, username: "Doe" });

  expect(storeContainer.resetAll().getStore("Users").all()).toEqual([]);
});