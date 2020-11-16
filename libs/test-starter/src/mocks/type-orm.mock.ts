export const entityManager = {
  save<T>(entity: T) {
    return Promise.resolve(entity);
  },
};

export const transaction = jest.fn().mockImplementation((cb) => {
  cb(entityManager);
});

