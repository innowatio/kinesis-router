import BPromise from "bluebird";
import {is, partial} from "ramda";

function getApplicationEvent (kinesisEvent) {
    return BPromise.try(() => {
        // Only consider the first record
        var base64Event = kinesisEvent.Records[0].kinesis.data;
        if (process.env.DEBUG) {
            console.log(`base64Event: \n ${base64Event}`);
        }
        var stringifiedEvent = new Buffer(base64Event, "base64").toString();
        if (process.env.DEBUG) {
            console.log(`stringifiedEvent: \n ${stringifiedEvent}`);
        }
        return JSON.parse(stringifiedEvent);
    });
}

function routeEvent (router, applicationEvent) {
    // Route based on the application event type
    const handler = router.routes[applicationEvent.type];
    if (handler) {
        return handler(applicationEvent);
    }
}

export default function getRouter () {

    function router (kinesisEvent, context) {
        return getApplicationEvent(kinesisEvent)
            .then(partial(routeEvent, [router]))
            .then(context.succeed)
            .catch(error => {
                if (is(Error, error)) {
                    console.log(error.message);
                    console.log(error.stack);
                }
                context.fail(error);
            });
    }

    router.routes = {};

    router.on = function (type, handler) {
        router.routes[type] = handler;
        return router;
    };

    return router;

}
