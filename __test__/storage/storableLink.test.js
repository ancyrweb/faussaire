import storableLinkFactory from '../../src/storage/storableLink';
import storeFactory from '../../src/storage/store';

test('oneToOne storableLink', () => {
  const store = storeFactory.createStore("Users", [
    storeFactory.createStorable({ id: 1, username: "John"}),
    storeFactory.createStorable({ id: 2, username: "Doe"})
  ]);

  expect(storableLinkFactory.toOne(store, 1).getStorable().getData()).toEqual({ id: 1, username: "John"});

  // Checking for persistence
  store.get(1).merge({ username: "Will"});
  expect(storableLinkFactory.toOne(store, 1).getStorable().getData()).toEqual({ id: 1, username: "Will"});
});

test('oneToMany storableLink', () => {
  const store = storeFactory.createStore("Users", [
    storeFactory.createStorable({ id: 1, username: "John"}),
    storeFactory.createStorable({ id: 2, username: "Doe"})
  ]);

  let toMany = storableLinkFactory.toMany(store, [1, 2]);

  expect(toMany.getStorable()[0].getData()).toEqual({ id: 1, username: "John"});
  expect(toMany.getStorable()[1].getData()).toEqual({ id: 2, username: "Doe"});

  store.get(1).merge({ username: "Will"});
  store.get(2).merge({ username: "iam"});

  expect(toMany.getStorable()[0].getData()).toEqual({ id: 1, username: "Will"});
  expect(toMany.getStorable()[1].getData()).toEqual({ id: 2, username: "iam"});
});