import { Injectable } from '@nestjs/common';
import { Model, Document } from 'mongoose';
import { PaginationInterface } from './pagination.interface';

@Injectable()
export class PaginationHelper<T extends Document> {
  async paginate(
    model: Model<T>,
    options: {
      page: number;
      limit: number;
      sort?: { [key: string]: 'asc' | 'desc' };
    },
    query = {},
  ): Promise<PaginationInterface<T[]>> {
    const { page = 1, limit = 10, sort } = options; 
  
    const skip = (page - 1) * limit;
  
    const [data, total] = await Promise.all([
      model.find(query).skip(skip).limit(limit).sort(sort).exec(),
      model.countDocuments(query),
    ]);
  
    return { data, pagination: { total, page, limit } };
  }
  

  async paginateAggregate<T>(
    model: Model<T>,
    options: {
      page: number;
      limit: number;
    },
    pipeline: any[],
  ): Promise<PaginationInterface<T[]>> {
    const { page = 1, limit = 10 } = options;

    const skip = (page - 1) * limit;

    const [data, totalResult]: [
      T[],
      {
        total: number;
      }[],
    ] = await Promise.all([
      model.aggregate([
        ...pipeline,
        {
          $skip: skip,
        },
        {
          $limit: limit,
        },
      ]),
      model.aggregate([...pipeline, { $count: 'total' }]),
    ]);

    const total = totalResult.length > 0 ? totalResult[0].total : 0;

    return { data, pagination: { total, page, limit } };
  }
}
