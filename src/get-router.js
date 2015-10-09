import BPromise from "bluebird";
import {is, partial} from "ramda";

var getApplicationEvent = function (kinesisEvent) {
    return BPromise.try(() => {
        // Only consider the first record
        var base64Event = kinesisEvent.Records[0].kinesis.data;
        if (process.env.DEBUG) {
            console.log([
                "base64Event:",
                base64Event
            ].join("\n"));
        }
        var stringifiedEvent = new Buffer(base64Event, "base64").toString();
        if (process.env.DEBUG) {
            console.log([
                "stringifiedEvent:",
                stringifiedEvent
            ].join("\n"));
        }
        return JSON.parse(stringifiedEvent);
    });
};

var routeEvent = function (router, applicationEvent) {
    // Route based on the application event type
    var handler = router.routes[applicationEvent.type];
    if (handler) {
        return handler(applicationEvent);
    }
};

export default function getRouter () {

    var router = function (kinesisEvent, context) {
        return getApplicationEvent(kinesisEvent)
            .then(partial(routeEvent, router))
            .then(context.succeed)
            .catch(error => {
                if (is(Error, error)) {
                    console.log(error.message);
                    console.log(error.stack);
                }
                context.fail(error);
            });
    };

    router.routes = {};

    router.on = function (type, handler) {
        router.routes[type] = handler;
        return router;
    };

    return router;

}
