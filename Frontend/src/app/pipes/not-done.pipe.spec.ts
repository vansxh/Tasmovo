import { NotDonePipe } from './not-done.pipe';

describe('NotDonePipe', () => {
  it('create an instance', () => {
    const pipe = new NotDonePipe();
    expect(pipe).toBeTruthy();
  });
});
