import {expect} from "chai";
import {range} from "ramda";

import {getEvents} from "get-events";

describe("`getEvents`", () => {

    it("extracts data from a kinesis event (into `application event`-s)", () => {
        const eventsCount = 100;
        const applicationEvents = range(0, eventsCount).map(n => ({
            type: `type${n}`,
            timestamp: n,
            data: {key: "value"}
        }));
        const kinesisEvent = {
            Records: range(0, eventsCount).map(n => ({
                kinesis: {
                    data: new Buffer(JSON.stringify(applicationEvents[n])).toString("base64")
                }
            }))
        };
        const extractedEvent = getEvents(kinesisEvent);
        expect(extractedEvent).to.deep.equal(applicationEvents);
    });

});
