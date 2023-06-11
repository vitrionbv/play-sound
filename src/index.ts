import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import * as which from 'which';

const players: string[] = [
  'mplayer',
  'afplay',
  'mpg123',
  'mpg321',
  'play',
  'omxplayer',
  'aplay',
  'cmdmp3',
  'cvlc',
  'powershell'
];

interface PlayOptions {
  players?: string[];
  player?: string;
}

class Play {
  private readonly players: string[];
  private readonly player: string;

  constructor(opts?: PlayOptions) {
    opts = opts || {};

    this.players = opts.players || players;
    this.player = opts.player || this.findPlayerExecutable();
  }

  private findPlayerExecutable(): string {
    for (const player of this.players) {
      try {
        const playerPath = which.sync(player);
        if (playerPath) {
          return playerPath;
        }
      } catch (error) {
        // Player executable not found, continue to the next one
      }
    }
    return '';
  }

  public play(what: string, options?: any, next?: (err?: Error | null) => void): ChildProcessWithoutNullStreams | null | void {
    next = next || function () {};
    next = typeof options === 'function' ? options : next;
    options = typeof options === 'object' ? options : {};
    options.stdio = 'ignore';


    if (!what) {
      next && next(new Error('No audio file specified'));
      return;
    }

    if (!this.player) {
      next && next(new Error("Couldn't find a suitable audio player"));
      return;
    }

    const args = Array.isArray(options[this.player]) ? options[this.player].concat(what) : [what];

    const process = spawn(this.player, args, options);
    if (!process) {
      next && next(new Error('Unable to spawn process with ' + this.player));
      return null;
    }
    process.on('close', function (code) {
      next && next(code !== 0 ? new Error(`Process exited with code ${code}`) : null);
    });
    return process;
  }

  public test(next: (err?: Error | null) => void): ChildProcessWithoutNullStreams | null | void {
    return this.play('./assets/test.mp3', next);
  }
}

export default function (opts?: PlayOptions): Play {
  return new Play(opts);
}

