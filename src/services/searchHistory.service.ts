import { Request, Response } from 'express';
import { mean } from 'lodash';
import mongoose from 'mongoose';
import { createEmbedding } from '../apis/openai';
import { ProductModel } from '../models/product';
import { SearchHistoryModel } from '../models/searchHistory';
import { SearchHistoryProps } from '../types/model/searchHistory.type';
import ApiError from '../utils/classes/ApiError';
import { createVectorIndex, VECTOR_INDEX_NAME } from '../utils/createVectocIndex';
import { generateSlug, removeVietnameseTones } from '../utils/slug';

const findAllByUserId = async (req: Request, res: Response) => {
  try {
    return findAllByUserIdWithoutRequest(req.query.userId as string);
  } catch (error: any) {
    throw new ApiError({ message: error.message, statusCode: error.statusCode });
  }
};

const findAllByUserIdWithoutRequest = async (userId?: string) => {
  try {
    if (!userId) {
      const trendingKeywords = await getTrendingKeywords();
      return trendingKeywords;
    }

    const searchHistory = await SearchHistoryModel.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId as string) } },
      {
        $group: {
          _id: '$searchText',
          count: { $sum: 1 },
          latestAt: { $max: '$createdAt' },
          doc: { $first: '$$ROOT' }, // lấy bản ghi đầu tiên cho _id thực
        },
      },
      { $sort: { latestAt: -1 } },
      {
        $replaceWith: {
          $mergeObjects: ['$doc', { count: '$count' }], // gộp doc gốc + count
        },
      },
      { $limit: 10 },
    ]);

    if (!searchHistory.length) {
      const trendingKeywords = await getTrendingKeywords();
      return trendingKeywords;
    }

    return searchHistory;
  } catch (error: any) {
    throw new ApiError({ message: error.message, statusCode: error.statusCode });
  }
};

const findBySearchText = async (req: Request, res: Response) => {
  try {
    const { searchText } = req.query;

    // if (!searchText || typeof searchText !== 'string') {
    //   throw new ApiError({ message: 'Missing or invalid searchText', statusCode: 400 });
    // }

    // Helper promise wrapper để resolve khi có kết quả hợp lệ
    const withValidResult = (promise: Promise<any[]>) =>
      new Promise<any[]>((resolve) => {
        promise
          .then((result) => {
            if (Array.isArray(result) && result.length > 0) resolve(result);
          })
          .catch(() => {}); // ignore errors
      });

    // 1. Tìm theo keyword
    const keywordPromise = withValidResult(findByKeyword(searchText as string));

    // 2. Tìm theo embedding
    const embeddingPromise = withValidResult(findByEmbedding(searchText as string));

    // 3. Trả cái nào có kết quả trước
    const fastestResult = await Promise.race([keywordPromise, embeddingPromise]);

    return res.status(200).json(fastestResult || []);
  } catch (error: any) {
    throw new ApiError({ message: error.message, statusCode: error.statusCode || 500 });
  }
};

const findByKeyword = async (searchText?: string) => {
  const slug = searchText ? generateSlug(searchText).toLowerCase() : '';

  return await SearchHistoryModel.aggregate([
    { $match: { slug: { $regex: `^${slug}`, $options: 'i' } } }, // sử dụng index
    {
      $group: {
        _id: '$searchText',
        count: { $sum: 1 },
        latestAt: { $max: '$createdAt' },
        doc: { $first: '$$ROOT' },
      },
    },
    { $sort: { count: -1, latestAt: -1 } },
    { $limit: 10 },
    {
      $replaceWith: {
        $mergeObjects: ['$doc', { count: '$count' }], // gộp doc gốc + count
      },
    },
  ]);
};

const findByEmbedding = async (searchText?: string) => {
  const embeddingResponse = await createEmbedding({ input: [searchText || ''] });
  const embedding = embeddingResponse.data?.[0]?.embedding;
  if (!embedding) return [];

  return await SearchHistoryModel.aggregate([
    {
      $vectorSearch: {
        index: VECTOR_INDEX_NAME.SEARCH_HISTORY,
        path: 'embedding',
        queryVector: embedding,
        limit: 20, // lấy nhiều hơn để gộp
        numCandidates: 50,
      },
    },
    {
      $group: {
        _id: {
          userId: '$userId',
          searchText: '$searchText',
        },
        count: { $sum: '$count' },
        doc: { $first: '$$ROOT' },
        maxScore: { $max: { $meta: 'vectorSearchScore' } },
      },
    },
    {
      $project: {
        _id: '$doc._id',
        userId: '$_id.userId',
        searchText: '$_id.searchText',
        count: 1,
        score: '$maxScore',
      },
    },
    { $sort: { score: -1 } },
    { $limit: 10 },
  ]);
};

const getTrendingKeywords = async (limit = 10, hours = 240) => {
  const since = new Date(Date.now() - hours * 60 * 60 * 1000);

  const trending = await SearchHistoryModel.aggregate([
    { $match: { createdAt: { $gte: since } } },
    {
      $group: {
        _id: '$searchText',
        count: { $sum: 1 },
        doc: { $first: '$$ROOT' }, // lấy document đầu tiên trong nhóm
      },
    },
    { $sort: { count: -1 } },
    { $limit: limit },
    {
      $replaceWith: {
        $mergeObjects: ['$doc', { count: '$count' }], // gộp doc gốc + count
      },
    },
  ]);

  return trending;
};

export const getTrendingRecommendations = async (req: Request, res: Response) => {
  const trendingKeywords = await getTrendingKeywords();
  const embeddings = await createEmbedding({
    input: trendingKeywords,
  });

  // Trung bình embedding
  const avgEmbedding = embeddings.data[0].embedding.map((_: any, i: any) =>
    mean(embeddings.data.map((vec: any) => vec.embedding[i])),
  );

  const results = await ProductModel.aggregate([
    {
      $vectorSearch: {
        index: VECTOR_INDEX_NAME.SEARCH_HISTORY,
        queryVector: avgEmbedding,
        path: 'embedding',
        limit: 10,
        numCandidates: 50,
      },
    },
    {
      $project: {
        name: 1,
        price: 1,
        score: { $meta: 'vectorSearchScore' },
      },
    },
  ]);

  return res.json({ trending: trendingKeywords, products: results });
};

const initData = async (req: Request, res: Response) => {
  try {
    const sampleData: any[] = [
      {
        userId: '673b3c703cd6066db7d50788',
        searchText: 'iphone 14 pro max',
        searchTextUnaccented: 'iphone 14 pro max',
        slug: 'iphone-14-pro-max',
      },
      {
        userId: '673b3c703cd6066db7d50788',
        searchText: 'tai nghe bluetooth',
        searchTextUnaccented: 'tai nghe bluetooth',
        slug: 'tai-nghe-bluetooth',
      },
      {
        userId: '673b3c703cd6066db7d50788',
        searchText: 'macbook m2 air',
        searchTextUnaccented: 'macbook m2 air',
        slug: 'macbook-m2-air',
      },
      {
        userId: '673b3c703cd6066db7d50788',
        searchText: 'máy lọc không khí',
        searchTextUnaccented: 'may loc khong khi',
        slug: 'may-loc-khong-khi',
      },
      {
        userId: '673b3c703cd6066db7d50788',
        searchText: 'nồi chiên không dầu',
        searchTextUnaccented: 'noi chien khong dau',
        slug: 'noi-chien-khong-dua',
      },
      {
        userId: '673b3c703cd6066db7d50788',
        searchText: 'robot hút bụi',
        searchTextUnaccented: 'robot hut bui',
        slug: 'robot-hut-bui',
      },
      {
        userId: '673b3c703cd6066db7d50788',
        searchText: 'tivi samsung 55 inch',
        searchTextUnaccented: 'tivi samsung 55 inch',
        slug: 'tivi-samsung-55-inch',
      },
      {
        userId: '673b3c703cd6066db7d50788',
        searchText: 'loa soundbar',
        searchTextUnaccented: 'loa soundbar',
        slug: 'loa-soundbar',
      },
      {
        userId: '673b3c703cd6066db7d50788',
        searchText: 'bàn gaming led rgb',
        searchTextUnaccented: 'ban gaming led rgb',
        slug: 'ban-gaming-led-rgb',
      },
      {
        userId: '673b3c703cd6066db7d50788',
        searchText: 'ghế công thái học',
        searchTextUnaccented: 'ghe cong thai hoc',
        slug: 'ghe-cong-thai-hoc',
      },
    ];

    const embeddingResponse = await createEmbedding({
      input: sampleData.map((item) => item.searchText),
    });

    const embeddedData = sampleData.map((item, index) => ({
      ...item,
      embedding: embeddingResponse.data[index].embedding,
    }));

    // const searchHistory = await SearchHistoryModel.create({ userId, searchText });
    const searchHistory = await SearchHistoryModel.insertMany(embeddedData);
    const result = await createVectorIndex(SearchHistoryModel, VECTOR_INDEX_NAME.SEARCH_HISTORY);
    return searchHistory;
  } catch (error: any) {
    throw new ApiError({ message: error.message, statusCode: error.statusCode });
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const { userId, searchText } = req.body;
    const slug = generateSlug(searchText).toLowerCase();

    const embeddingResponse = await createEmbedding({
      input: [searchText],
    });

    const embeddedData: SearchHistoryProps = {
      userId,
      searchText,
      searchTextUnaccented: removeVietnameseTones(searchText),
      slug,
      embedding: embeddingResponse?.data?.[0]?.embedding,
      createdAt: new Date(),
    };

    console.log('embeddedData', embeddedData);

    const searchHistory = await SearchHistoryModel.create(embeddedData);
    return searchHistory;
  } catch (error: any) {
    throw new ApiError({ message: error.message, statusCode: error.statusCode });
  }
};

export const searchHistoryService = {
  findAllByUserId,
  findBySearchText,
  initData,
  getTrendingRecommendations,
  create,
  findAllByUserIdWithoutRequest,
};
