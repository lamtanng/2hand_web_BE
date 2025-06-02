export const createVectorIndex = async (collection: any) => {
  try {
    // Define your Atlas Vector Search index
    const index = {
      name: 'vector_product',
      type: 'vectorSearch',
      definition: {
        fields: [
          {
            type: 'vector',
            path: 'embedding',
            similarity: 'cosine',
            numDimensions: 3072,
          },
        ],
      },
    };

    // Call the method to create the index
    const result = await collection.createSearchIndex(index);
    console.log(result);
  } catch (err) {
    console.log('err: ', err);
  }
};
