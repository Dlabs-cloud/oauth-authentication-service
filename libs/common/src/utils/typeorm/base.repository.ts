import { BaseEntity } from './base.entity';
import { FindConditions, Repository } from 'typeorm'
import { GenericStatus } from '.';



export abstract class BaseRepository<T extends BaseEntity> extends Repository<T> {

  public findItem(findOptions: FindConditions<T>, status = GenericStatus.ACTIVE): Promise<T[]> {
    const statusVal = { status };
    return this.find({
      where: { ...findOptions, ...statusVal },
    });
  }

  public findOneItemByStatus(findOptions: FindConditions<T>, status = GenericStatus.ACTIVE): Promise<T> {
    return this.findOne({
      where: { ...findOptions, ...{ status } },
    });
  }

  public findByIdAndStatus(id: number, ...status: GenericStatus[]) {
    return this.createQueryBuilder()
      .select()
      .where('id =:id', { id })
      .andWhere('status IN (:...status)')
      .setParameter('status', status)
      .getOne();
  }

  findById(status = GenericStatus.ACTIVE, ...ids: number[]) {
    return this.createQueryBuilder()
      .select()
      .whereInIds(ids)
      .andWhere('status = :status', { 'status': status })
      .getMany();
  }


}
