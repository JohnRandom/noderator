import { Module } from './module/module';

import { Dispatcher } from './dispatcher/dispatcher';
import { FetchService } from './fetch/fetch.service';

export const coreModule = new Module([ Dispatcher, FetchService]);
