import storeFactory from '../../src/storage/store';

test('creating a store', () => {
  const store = storeFactory.createStore("Store");

  expect(store.name).toEqual("Store");

  expect(typeof store.reset).toBe("function");
  expect(typeof store.createStorable).toBe("function");
  expect(typeof store.add).toBe("function");
  expect(typeof store.remove).toBe("function");
  expect(typeof store.update).toBe("function");
  expect(typeof store.get).toBe("function");
  expect(typeof store.all).toBe("function");
});

test('creating a store with default value', () => {
  let john = storeFactory.createStorable({id: 1, name: "John"});
  const store = storeFactory.createStore("Store", [
    john
  ]);

  // They shouldn't point to the same data
  expect(john.getData() === store.get(1).getData()).toBe(false);
});

test('createStorable', () => {
  const store = storeFactory.createStore("Store");
  const storable = store.createStorable({
    id: 2,
    name: "John"
  });

  expect(storable.getData()).toEqual({
    id: 2,
    name: "John",
  })
});

test('add', () => {
  const store = storeFactory.createStore("Store");
  store.add({
    id: 1,
    name: "John"
  });

  expect(store.get(1).getData()).toEqual({
    id: 1,
    name: "John"
  });
});


test('addStorable', () => {
  const store = storeFactory.createStore("Store");
  store.addStorable(store.createStorable({
    id: 1,
    name: "John"
  }));

  expect(store.get(1).getData()).toEqual({
    id: 1,
    name: "John"
  });
});


test('all', () => {
  const store = storeFactory.createStore("Store");
  let john = store.createStorable({id: 1, name: "John"})
  let doe =  store.createStorable({id: 2, name: "Doe"});

  store
    .addStorable(john)
    .addStorable(doe)
  ;

  expect(store.all()).toEqual([john, doe]);
});

test('remove', () => {
  const store = storeFactory.createStore("Store");
  let john = store.createStorable({id: 1, name: "John"})
  let doe =  store.createStorable({id: 2, name: "Doe"});

  store
    .addStorable(john)
    .addStorable(doe)
  ;

  expect(store.remove(1).all()).toEqual([doe]);
});

test('update', () => {
  const store = storeFactory.createStore("Store");
  let john = storeFactory.createStorable({id: 1, name: "John"});
  let doe =  storeFactory.createStorable({id: 2, name: "Doe"});

  store
    .addStorable(john)
    .addStorable(doe)
  ;

  let filibert = storeFactory.createStorable({id: 1, name: "Filibert"});
  expect(store.update(1, filibert).all()).toEqual([filibert, doe]);
});

test('reset', () => {
  const store = storeFactory.createStore("Store");
  store
    .add({ id: 1, name: "John"})
    .add({ id: 2, name: "Doe"})
  ;

  expect(store.reset().all()).toEqual([]);
});


test('reset with default values', () => {
  let john = storeFactory.createStorable({id: 1, name: "John"});
  let doe =  storeFactory.createStorable({id: 2, name: "Doe"});

  const store = storeFactory.createStore("Store", [
    john
  ]);

  store.addStorable(doe);

  store.reset();
  expect(store.all().length).toBe(1);
  expect(store.get(1).getData()).toEqual({ id: 1, name: "John" });
});
