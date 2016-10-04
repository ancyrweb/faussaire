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

  it('should accept the request having mentionned the apikey in the parameters', function(){
    const response = faussaire.fetch("http://bar.com", "GET", {"apikey": "azerty"});
    expect(response.status).toEqual(200);
  });

  it('should accept the request having mentionned the apikey in the POST parameters', function(){
    const response = faussaire.fetch("http://bar.com", "POST", {"apikey": "azerty"});
    expect(response.status).toEqual(200);
  });

  it('should refuse the request having forgot the apikey', function(){
    const response = faussaire.fetch("http://bar.com", "GET");
    expect(response.status).toEqual(403);
  });
});