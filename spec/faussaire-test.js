import faussaire, {Route, Controller, Response} from '../src/faussaire';

describe('Faussaire should mock API', function(){
  faussaire
    .route(Route({
      template: "http://foo.com",
      methods: ["GET"],
      controller: Controller({
        run: () => {
          return Response({
            data: {},
            status: 200,
            statusText: "OK"
          })
        }
      })
    }))
    .route(Route({
      template: "http://bar.com",
      methods: ["GET", "POST"],
      controller: Controller({
        run: (params) => {
          if(params.query.apikey || params.request.apikey){
            return Response({
              data: {},
              status: 200,
              statusText: "OK"
            })
          } else {
            return Response({
              data: {},
              status: 403,
              statusText: "Forbidden"
            })
          }
        }
      })
<<<<<<< HEAD
=======
    }))
    .route(Route({
      template: "http://bar.com/test",
      methods: ["GET"],
      controller: Controller({
        run: () => {
          return Response({
            data: { match: "test" },
            status: 200,
            statusText: "OK"
          })
        }
      })
    }))
    .route(Route({
      template: "http://bar.com/test/{id}",
      methods: ["GET"],
      controller: Controller({
        run: () => {
          return Response({
            data: { match: "test with id" },
            status: 200,
            statusText: "OK"
          })
        }
      })
>>>>>>> 14184140cb9501e1b6aee547b3b65fada27cba80
    }));

  it('should fetch data from a correct URL', function(){
    const response = faussaire.fetch("http://foo.com", "GET");

    expect(response.data).toBeDefined();
    expect(response.status).toBeDefined();
    expect(response.statusText).toBeDefined();
    expect(response.headers).toBeDefined();

    expect(response.data).toEqual({});
    expect(response.status).toEqual(200);
    expect(response.statusText).toEqual("OK");
    expect(response.headers).toEqual({});
  });

  it('should fetch data from a wrong URL', function(){
    const response = faussaire.fetch("http://wrong.com", "GET");
    expect(response.status).toEqual(404);
  });

  it('should accept the request having mentionned the apikey in the URL', function(){
    const response = faussaire.fetch("http://bar.com?apikey=azerty", "GET");
    expect(response.status).toEqual(200);
  });

  it('should accept the request having mentionned the apikey in the params', function(){
    const response = faussaire.fetch("http://bar.com?titi=toto", "GET", {
      params: {
        apikey: "azerty"
      }
    });

    expect(response.status).toEqual(200);
  });

  it('should accept the request having mentionned the apikey in the parameters', function(){
    const response = faussaire.fetch("http://bar.com", "GET", {
      params: {
        apikey: "azerty"
      }
    });
    expect(response.status).toEqual(200);
  });

  it('should accept the request having mentionned the apikey in the POST parameters', function(){
    const response = faussaire.fetch("http://bar.com", "POST", {
      data: {
        apikey: "azerty"
      }
    });
    expect(response.status).toEqual(200);
  });

  it('should refuse the request having forgot the apikey', function(){
    const response = faussaire.fetch("http://bar.com", "GET");
    expect(response.status).toEqual(403);
  });
<<<<<<< HEAD
=======

  it('should match http://bar.com/test and return object to identify it', function(){
    const response = faussaire.fetch("http://bar.com/test", "GET");
    expect(response.data.match).toEqual("test");
  });

  it('should match http://bar.com/test/(\\d+) and return object to identify it', function(){
    const response = faussaire.fetch("http://bar.com/test/10", "GET");
    expect(response.data.match).toEqual("test with id");
  });
>>>>>>> 14184140cb9501e1b6aee547b3b65fada27cba80
});