import { syncConfig } from 'tools/config';
import log from 'tools/log';

const actionCreatorRegistry = new Map<string, true>();

const registerActionCreator = (type: string): void => {
    if (!actionCreatorRegistry.has(type)) {
        actionCreatorRegistry.set(type, true);
        return;
    }

    const { isLocalhost } = syncConfig;
    let message = `Detected multiple action creator registrations for action type '${type}'.`;
    if (isLocalhost) {
        message +=
            ` ` +
            `It's possible that you authored a new action creator file by ` +
            `copying code from an existing one and not yet updating its ` +
            `exported action type to a new unique string. Your action creator ` +
            `will still dispatch normally, but it may get processed by the ` +
            `wrong reducer.`;
    }
    log.error(message);
};

export const buildEchoActionCreator = <Payload extends ActionPayload>(
    type: string
): ActionCreatorWithBody<(payload: Payload) => Payload> => {
    const builder = (payload: Payload) => payload;
    return buildFactoryActionCreator(type, builder);
};

export const buildFactoryActionCreator = <Builder extends (...args: any[]) => any>(
    type: string,
    builder?: Builder
): ActionCreatorWithBody<Builder> => {
    registerActionCreator(type);

    const actionCreator = (...args: Parameters<Builder>) => ({
        type,
        payload: builder?.(...args),
    });

    return Object.assign(actionCreator, {}) as ActionCreatorWithBody<Builder>;
};
