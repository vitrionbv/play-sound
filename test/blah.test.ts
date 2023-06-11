import Play from '../src/index';

describe('PlaySound', () => {
  let player: Play;

  beforeEach(() => {
    player = new Play();
  });

  // it('should play a local audio file', done => {
  //   const filePath = './assets/test.mp3';
  //   player.play(filePath, {}, (err?: Error | null) => {
  //     expect(err).toBeNull();
  //     done();
  //   });
  // });

  it('should play an online audio file', done => {
    const url = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
    player.play(url, {}, (err?: Error | null) => {
      expect(err).toBeNull();
      done();
    });
  });
});
