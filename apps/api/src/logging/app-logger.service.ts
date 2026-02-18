import { ConsoleLogger, Injectable } from '@nestjs/common';

type SafeMeta = Record<string, unknown>;

@Injectable()
export class AppLogger extends ConsoleLogger {
  private readonly redactedKeys = ['password', 'token', 'secret', 'authorization', 'apikey', 'apiKey'];

  log(message: unknown, ...optionalParams: unknown[]): void {
    this.printJson('log', message, optionalParams);
  }

  warn(message: unknown, ...optionalParams: unknown[]): void {
    this.printJson('warn', message, optionalParams);
  }

  error(message: unknown, ...optionalParams: unknown[]): void {
    this.printJson('error', message, optionalParams);
  }

  debug(message: unknown, ...optionalParams: unknown[]): void {
    this.printJson('debug', message, optionalParams);
  }

  verbose(message: unknown, ...optionalParams: unknown[]): void {
    this.printJson('verbose', message, optionalParams);
  }

  private printJson(level: string, message: unknown, optionalParams: unknown[]): void {
    const [context, meta] = this.extractOptionalParams(optionalParams);

    const payload = {
      timestamp: new Date().toISOString(),
      level,
      context,
      message: String(message),
      ...(meta ? { meta: this.sanitize(meta) } : {})
    };

    super.log(JSON.stringify(payload));
  }

  private extractOptionalParams(optionalParams: unknown[]): [string | undefined, SafeMeta | undefined] {
    if (optionalParams.length === 0) {
      return [undefined, undefined];
    }

    const contextCandidate = optionalParams.find((param) => typeof param === 'string') as string | undefined;
    const metaCandidate = optionalParams.find(
      (param) => typeof param === 'object' && param !== null && !Array.isArray(param)
    ) as SafeMeta | undefined;

    return [contextCandidate, metaCandidate];
  }

  private sanitize(value: unknown): unknown {
    if (Array.isArray(value)) {
      return value.map((item) => this.sanitize(item));
    }

    if (value && typeof value === 'object') {
      const entries = Object.entries(value as Record<string, unknown>).map(([key, val]) => {
        const shouldRedact = this.redactedKeys.some(
          (word) => key.toLowerCase() === word.toLowerCase() || key.toLowerCase().includes(word.toLowerCase())
        );

        return [key, shouldRedact ? '[REDACTED]' : this.sanitize(val)];
      });

      return Object.fromEntries(entries);
    }

    return value;
  }
}
