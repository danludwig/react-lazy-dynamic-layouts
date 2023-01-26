// todo: better logger with env var level filtering
// and built-in exponential fallback

type LogArgs = any[];

export interface Logger {
    error(...data: LogArgs): void;
    warn(...data: LogArgs): void;
    info(...data: LogArgs): void;
    debug(...data: LogArgs): void;
    trace(...data: LogArgs): void;
}

const logger: Logger = console;

export default logger;
