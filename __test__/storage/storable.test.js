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

test('create a storable with null values', () => {
  const storable = storableFactory.createStorable({
    id: 1,
    name: "test",
    photo: null,
  });

  expect(storable.getData()).toEqual({
    id: 1,
    name: "test",
    photo: null,
  });

  expect(storable.getSchema()).toEqual({
    id: {
      name: "id",
      type: "number",
    },
    name: {
      name: "name",
      type: "string",
    },
    photo: {
      name: "photo",
      type: "object",
    },
  });
});

test('create a storable with nested object', () => {
  const storable = storableFactory.createStorable({
    id: 1,
    name: "test",
    progress: {
      level: 1,
      exp: 200
    },
  });

  expect(storable.getData()).toEqual({
    id: 1,
    name: "test",
    progress: {
      level: 1,
      exp: 200
    },
  });

  expect(storable.getSchema()).toEqual({
    id: {
      name: "id",
      type: "number",
    },
    name: {
      name: "name",
      type: "string",
    },
    progress: {
      name: "progress",
      type: "object",
    },
  });
});


test('merge without ID', () => {
  const storable = storableFactory.createStorable({
    id: 1,
    name: "test",
  });

  storable.merge({ name: "will" });
  expect(storable.getData()).toEqual({ id: 1, name: "will" });
});

test('merge with ID', () => {
  const storable = storableFactory.createStorable({
    id: 1,
    name: "test",
  });

  expect(() => storable.merge({ id: 2, name: "will" })).toThrow();
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

test('creating a storable with an Array as a value throws', () => {
  expect(() => {
    storableFactory.createStorable({
      id: 1,
      name: "test",
      arr: [1, 2, 3],
    });
  }).toThrow();
});