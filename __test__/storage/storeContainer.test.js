import storeContainerFactory from '../../src/storage/storeContainer';
import storeFactory from '../../src/storage/store';
import storableLinkFactory from '../../src/storage/storableLink';

const createStoreContainer = () => {
  const storeContainer = storeContainerFactory.createStoreContainer();

  let john = storeFactory.createStorable({id: 1, name: "John"});
  let doe =  storeFactory.createStorable({id: 2, name: "Doe"});
  const userStore = storeFactory.createStore("Users", [
    john, doe
  ]);

  storeContainer.addStore(userStore);

  return storeContainer;
};

const createSingleLinkingStoreContainer = () => {
  const storeContainer = storeContainerFactory.createStoreContainer();

  const photosStore = storeFactory.createStore("Photos", [
    storeFactory.createStorable({ id: 1, path: "/some/picture.jpg" }),
    storeFactory.createStorable({ id: 2, path: "/some/other_picture.jpg" }),
  ]);

  let john = storeFactory.createStorable({id: 1, name: "John", profilePicture: storableLinkFactory.toOne(photosStore, 1)});
  let doe =  storeFactory.createStorable({id: 2, name: "Doe", profilePicture: storableLinkFactory.toOne(photosStore, 2)});

  const userStore = storeFactory.createStore("Users", [
    john, doe
  ]);

  storeContainer.addStore(photosStore);
  storeContainer.addStore(userStore);

  return storeContainer;
};

const createMultipleLinkingStoreContainer = () => {
  const storeContainer = storeContainerFactory.createStoreContainer();

  const photosStore = storeFactory.createStore("Photos", [
    storeFactory.createStorable({ id: 1, path: "/some/picture.jpg" }),
    storeFactory.createStorable({ id: 2, path: "/some/other_picture.jpg" }),
  ]);

  let john = storeFactory.createStorable({id: 1, name: "John", photos: storableLinkFactory.toMany(photosStore, [1, 2])});
  let doe =  storeFactory.createStorable({id: 2, name: "Doe", photos: storableLinkFactory.toMany(photosStore, [1])});

  const userStore = storeFactory.createStore("Users", [
    john, doe
  ]);

  storeContainer.addStore(photosStore);
  storeContainer.addStore(userStore);

  return storeContainer;
};

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

test('assemble', () => {
  const storeContainer = createStoreContainer();
  const doe = storeContainer.getStore("Users").get(2);
  expect(storeContainer.assemble(doe)).toEqual({ id: 2, name: "Doe" });
});

test('assemble with multiple linking', () => {
  const storeContainer = createMultipleLinkingStoreContainer();
  const doe = storeContainer.getStore("Users").get(1);
  expect(storeContainer.assemble(doe)).toEqual({
    id: 1,
    name: "John",
    photos: [
      { id: 1, path: "/some/picture.jpg" },
      { id: 2, path: "/some/other_picture.jpg" }
    ]
  });
});

test('assemble with single linking', () => {
  const storeContainer = createSingleLinkingStoreContainer();
  const doe = storeContainer.getStore("Users").get(1);
  expect(storeContainer.assemble(doe)).toEqual({
    id: 1,
    name: "John",
    profilePicture: { id: 1, path: "/some/picture.jpg" },
  });
});

test('assemble with a schema', () => {
  const storeContainer = createStoreContainer();
  const doe = storeContainer.getStore("Users").get(2);
  expect(storeContainer.assemble(doe, {
    schema: ["name"]
  })).toEqual({ name: "Doe" });
});