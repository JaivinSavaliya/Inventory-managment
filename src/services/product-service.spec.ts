import { ProductService } from './product.service';
import { AppDataSource } from '../config/database';

jest.mock('../config/database', () => ({
  AppDataSource: {
    getRepository: jest.fn(),
  },
}));

describe('ProductService', () => {
  it('returns a product when getById finds an existing record', async () => {
    const mockProduct = {
      id: 1,
      product_name: 'Test Product',
      price: 15,
    };

    const mockRepo = {
      findOne: jest.fn().mockResolvedValue(mockProduct),
    };

    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepo);

    const result = await ProductService.getById(1);

    expect(mockRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(result).toEqual(mockProduct);
  });
});
