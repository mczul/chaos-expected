import { ShortenUuidPipe } from './shorten-uuid.pipe';

describe('ShortenUuidPipe', () => {
  it('create an instance', () => {
    const pipe = new ShortenUuidPipe();
    expect(pipe).toBeTruthy();
  });
});
