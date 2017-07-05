/**
 * Copyright (c) 2017-present, Evosphere.
 * All rights reserved.
 */

import Faussaire from '../index';

it('should register a waiter faussaire object and return a result when triggering', () => {
  const faussaire = Faussaire.create();

  const trigger = jest.fn(() => {
    return {
      data: { userId: 1 },
      statusCode: 200,
    }
  });

  faussaire.observe({
    url: "http://evosphere.co",
    method: "GET",
    action: trigger,
  });

  let result = faussaire.emit({
    url: "http://evosphere.co",
    method: "GET",
  });

  expect(trigger.mock.calls.length).toBe(1);
  expect(result.status).toBe("done");
  expect(result.response.data).toEqual({ userId: 1 });
  expect(result.response.statusCode).toBe(200);

  result = faussaire.emit({
    url: "http://evosphere.co",
    method: "GET",
  });

  expect(trigger.mock.calls.length).toBe(1);
  expect(result.status).toBe("done");
  expect(result.response.statusCode).toBe(404);
});

it('should call the lastly registered waiter before the first', () => {
  const faussaire = Faussaire.create();

  const trigger = jest.fn(() => {
    return {
      data: { userId: 1 },
      statusCode: 200,
    }
  });


  faussaire
  .observe({
    url: "http://evosphere.co",
    method: "GET",
    action: "timeout",
    consumable: false,
  })
  .observe({
    url: "http://evosphere.co",
    method: "GET",
    action: trigger,
  });

  let result = faussaire.emit({
    url: "http://evosphere.co",
    method: "GET"
  });

  expect(trigger.mock.calls.length).toBe(1);
  expect(result.status).toBe("done");
  expect(result.response.data).toEqual({ userId: 1 });
  expect(result.response.statusCode).toBe(200);

  result = faussaire.emit({
    url: "http://evosphere.co",
    method: "GET"
  });

  expect(trigger.mock.calls.length).toBe(1);
  expect(result.status).toBe("timeout");
  expect(result.response).toBe(null);

  // The timeout is not consumable, so it remains.
  result = faussaire.emit({
    url: "http://evosphere.co",
    method: "GET"
  });

  expect(trigger.mock.calls.length).toBe(1);
  expect(result.status).toBe("timeout");
  expect(result.response).toBe(null);
});

it('should return a network-error', () => {
  const faussaire = Faussaire.create();
  faussaire.observe({
    url: "http://evosphere.co",
    method: "GET",
    action: "network-error",
  });

  let result = faussaire.emit({
    url: "http://evosphere.co",
    method: "GET",
  });

  expect(result.status).toBe("network-error");
});