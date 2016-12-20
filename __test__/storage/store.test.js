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

test('createStorable', () => {
  const store = storeFactory.createStore("Store");
  const storable = store.createStorable({
    id: 2,
    name: "John"
  });

  expect(storable).toEqual({
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

  expect(store.get(1)).toEqual({
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

  expect(store.get(1)).toEqual({
    id: 1,
    name: "John"
  });
});


test('all', () => {
  const store = storeFactory.createStore("Store");
  store
    .add(store.createStorable({
      id: 1,
      name: "John"
    }))
    .add(store.createStorable({
      id: 2,
      name: "Doe"
    }))
  ;

  expect(store.all()).toEqual([
    {
      id: 1,
      name: "John"
    },
    {
      id: 2,
      name: "Doe"
    }
  ]);
});

test('remove', () => {
  const store = storeFactory.createStore("Store");
  store
    .add(store.createStorable({
      id: 1,
      name: "John"
    }))
    .add(store.createStorable({
      id: 2,
      name: "Doe"
    }))
  ;

  expect(store.remove(1).all()).toEqual([
    {
      id: 2,
      name: "Doe"
    }
  ]);
});

test('update', () => {
  const store = storeFactory.createStore("Store");
  store
    .add(store.createStorable({
      id: 1,
      name: "John"
    }))
    .add(store.createStorable({
      id: 2,
      name: "Doe"
    }))
  ;

  expect(store.update(1, store.createStorable({
    id: 1,
    name: "Filibert"
  })).all()).toEqual([
    {
      id: 1,
      name: "Filibert"
    },
    {
      id: 2,
      name: "Doe"
    }
  ]);
});

test('reset', () => {
  const store = storeFactory.createStore("Store");
  store
    .add(store.createStorable({
      id: 1,
      name: "John"
    }))
    .add(store.createStorable({
      id: 2,
      name: "Doe"
    }))
  ;

  expect(store.reset().all()).toEqual([]);
});

test('reset with default values', () => {
  const store = storeFactory.createStore("Store", [
    storeFactory.createStorable({ id: 1, name: "John" })
  ]);

  store
    .add(store.createStorable({
      id: 2,
      name: "Doe"
    }))
  ;

  expect(store.reset().all()).toEqual([
    {
      id: 1,
      name: "John"
    }
  ]);
});