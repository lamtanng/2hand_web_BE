export const createVectorIndex = async (collection: any, name: string) => {
  try {
    // Define your Atlas Vector Search index
    const index = {
      name: name,
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

export const VECTOR_INDEX_NAME = {
  PRODUCT: 'vector_product',
  SEARCH_HISTORY: 'vector_search_history',
};
