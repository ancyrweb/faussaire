import faussaire, {Route, Controller, Response} from '../src/faussaire';
import storeFactory from '../src/storage/store';

describe('Faussaire should mock API', function() {
  let userStore = storeFactory.createStore("Users", [
    storeFactory.createStorable({id: 1, username: "Rewieer", password: "azerty_rewieer"}),
    storeFactory.createStorable({id: 2, username: "John", password: "azerty_john"}),
  ]);

  faussaire
    .route(Route({
      template: "http://foo.com/{id}",
      methods: ["GET"],
      controller: Controller({
        run: (params) => {
          const { id } = params.route;

          let user = faussaire.storage.getStore("Users").get(parseInt(id, 10));
          if(user){
            return Response({
              data: {
                user: faussaire.storage.assemble(user, {
                  schema: ["username"]
                }),
              },
              status: 200,
              statusText: "OK",
            });
          }

          return Response({
            data: {},
            status: 404,
            statusText: "NOT FOUND"
          })
        }
      })
    }))
    .storage.addStore(userStore);

  it('fetch the user at the given URL', async() => {
    const response = await faussaire.fetch("http://foo.com/1", "GET");
    expect(response).toEqual({
      data: {
        user: {
          username: "Rewieer",
        }
      },
      headers: {},
      status: 200,
      statusText: "OK",
    })
  });

  it('fetch unexisting user and returns an error', async() => {
    try {
      await faussaire.fetch("http://foo.com/4", "GET");
    } catch(e){
      expect(e.response).toEqual({
        data: {},
        headers: {},
        status: 404,
        statusText: "NOT FOUND",
      })
    }
  });

  it('fetch the user at the given URL when in-test added', async() => {
    faussaire.storage.getStore("Users").add({id: 3, username: "Doe", password: "azerty_john"});

    let response = await faussaire.fetch("http://foo.com/3", "GET");
    expect(response).toEqual({
      data: {
        user: {
          username: "Doe",
        }
      },
      headers: {},
      status: 200,
      statusText: "OK",
    });

    // When resetting, the initial state is kept.
    faussaire.storage.resetAll();
    try {
      await faussaire.fetch("http://foo.com/3", "GET");
    } catch(e){
      expect(e.response).toEqual({
        data: {},
        headers: {},
        status: 404,
        statusText: "NOT FOUND",
      })
    }

    response = await faussaire.fetch("http://foo.com/1", "GET");
    expect(response).toEqual({
      data: {
        user: {
          username: "Rewieer",
        }
      },
      headers: {},
      status: 200,
      statusText: "OK",
    })
  });
});