import { FaData } from './fa-db.service';

export enum StoreNames {
  'FaDb' = 'FaDb',
}

export type FaDbData = FaData;
const FaDbDataKey: keyof FaDbData = 'digest';

export const stores: Record<StoreNames, string> = {
  [StoreNames.FaDb]: FaDbDataKey,
};
