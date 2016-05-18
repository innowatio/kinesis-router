import bunyan from "bunyan";

import {LOG_LEVEL, NODE_ENV} from "../config";

export default bunyan.createLogger({
    name: "kinesis-router",
    streams: NODE_ENV === "test" ? [] : [{
        level: LOG_LEVEL,
        stream: process.stdout
    }]
});
