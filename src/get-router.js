import BPromise from "bluebird";
import {partial} from "ramda";

var getApplicationEvent = function (kinesisEvent) {
    return BPromise.try(() => {
        // Only consider the first record
        var data = new Buffer(
            kinesisEvent.Records[0].kinesis.data,
            "base64"
        ).toString("ascii");
        return JSON.parse(data);
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
            .catch(context.fail);
    };

    router.routes = {};

    router.on = function (type, handler) {
        router.routes[type] = handler;
        return router;
    };

    return router;

}
