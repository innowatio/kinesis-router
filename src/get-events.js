import log from "./services/logger";

export function getEvents (kinesisEvent) {
    return kinesisEvent.Records.map(record => {
        log.debug(record.kinesis.data, "base64Event");
        const stringifiedEvent = new Buffer(record.kinesis.data, "base64").toString();
        log.debug(stringifiedEvent, "stringifiedEvent");
        return JSON.parse(stringifiedEvent);
    });
}
