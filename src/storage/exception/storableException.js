export default (message) => {
  let err = new Error(message);
  err.name = "StorableException";

  return err;
}