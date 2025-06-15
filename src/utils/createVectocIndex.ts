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

/**
 * Tính trung bình của nhiều vectors
 * @param {number[][]} vectors
 * @returns {number[]}
 */
export const averageVectors = (vectors: number[][]) => {
  if (vectors.length === 0) return [];

  const dimension = vectors[0].length;
  const sum = Array(dimension).fill(0);

  for (const vector of vectors) {
    for (let i = 0; i < dimension; i++) {
      sum[i] += vector[i];
    }
  }

  return sum.map((val) => val / vectors.length);
};
