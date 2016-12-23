import storableFactory from '../../src/storage/storable';

test('creating a storable without an object parameter', () => {
  expect(() => { storableFactory.createStorable(); }).toThrow();
});

test('create a storable', () => {
  const storable = storableFactory.createStorable({
    id: 1,
    name: "test",
  });

  expect(storable.getData()).toEqual({
    id: 1,
    name: "test"
  });
  expect(storable.getSchema()).toEqual({
    id: {
      name: "id",
      type: "number",
    },
    name: {
      name: "name",
      type: "string",
    }
  });
});

test('creating a storable without an ID', () => {
  expect(() => {
    storableFactory.createStorable({
      name: "test",
    });
  }).toThrow();
});

test('creating a storable with a function as a value throws', () => {
  expect(() => {
    storableFactory.createStorable({
      id: 1,
      name: "test",
      fn: (a) => a,
    });
  }).toThrow();
});

test('creating a storable with an Object as a value throws', () => {
  expect(() => {
    storableFactory.createStorable({
      id: 1,
      name: "test",
      obj: {},
    });
  }).toThrow();
});

test('creating a storable with an Array as a value throws', () => {
  expect(() => {
    storableFactory.createStorable({
      id: 1,
      name: "test",
      arr: [1, 2, 3],
    });
  }).toThrow();
});