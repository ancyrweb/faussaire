const faussaire = require('../src/faussaire');

describe('Faussaire should mock API', function(){
  faussaire
    .Route({
      template: "http://foo.com",
      methods: ["GET"],
      controller: {
        run: () => {
          return faussaire.Response({
            data: {},
            status: 200,
            statusText: "OK"
          })
        }
      }
    });

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
});