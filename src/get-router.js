import "babel-polyfill";
import {map} from "bluebird";
import {is, partial} from "ramda";

import log from "./services/logger";
import {getEvents} from "./get-events";

function routeEvent (router, applicationEvent) {
    // Route based on the application event type
    const handler = router.routes[applicationEvent.type];
    if (handler) {
        return handler(applicationEvent);
    }
}

export default function getRouter () {

    async function router (kinesisEvent, context) {
        try {
            const events = getEvents(kinesisEvent);
            await map(events, partial(routeEvent, [router]));
            context.succeed();
        } catch (error) {
            if (is(Error, error)) {
                log.error(`Error Message: ${error.message}`);
                log.error(error.stack, "Error stack");
            }
            context.fail(error);
        }
    }

    router.routes = {};

    router.on = (type, handler) => {
        router.routes[type] = handler;
        return router;
    };

    return router;

}
