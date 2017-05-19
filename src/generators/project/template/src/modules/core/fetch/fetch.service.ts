import { Injectable } from '../';

@Injectable()
export class FetchService implements GlobalFetch {
  fetch(input: RequestInfo, init?: RequestInit): Promise<Response> {
    return window.fetch(input, init);
  }
}
