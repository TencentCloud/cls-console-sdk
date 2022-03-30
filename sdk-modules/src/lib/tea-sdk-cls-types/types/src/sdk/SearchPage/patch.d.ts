import { Moment } from 'moment';

export interface ISearchFilter {
  key: string;
  grammar: string;
  values: any[];
  isDisabled: boolean;
  alias_name?: string;
  type?: string;
}

export declare type TimeRange = [Moment, Moment];
