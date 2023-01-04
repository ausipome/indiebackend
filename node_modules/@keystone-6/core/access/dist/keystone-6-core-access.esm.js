function allowAll() {
  return true;
}
function denyAll() {
  return false;
}
function allOperations(func) {
  return {
    query: func,
    create: func,
    update: func,
    delete: func
  };
}

export { allOperations, allowAll, denyAll };
