import { BaseRepository, GenericStatus } from '@tss/common';
import { Setting } from '../domain/entity/settings.entity';
import { EntityRepository } from 'typeorm';

@EntityRepository(Setting)
export class SettingsRepository extends BaseRepository<Setting> {
  findInLabels(...labels: string[]): Promise<Setting[]> {
    return this.createQueryBuilder()
      .where('label IN (:...labels)')
      .andWhere('status = :status')
      .setParameter('labels', labels)
      .setParameter('status', GenericStatus.ACTIVE)
      .getMany();
  }

  async findByLabel(label: string, defaultValue: string | number) {
    return this.createQueryBuilder()
      .where('label=:label')
      .andWhere('status = :status')
      .setParameter('label', label)
      .setParameter('status', GenericStatus.ACTIVE)
      .getOne().then(setting => {
        if (setting) {
          return Promise.resolve(setting);
        }
        let newSetting = new Setting();
        let value = String(defaultValue);
        newSetting.label = label;
        newSetting.value = value;
        return this.save(newSetting);
      });
  }
}