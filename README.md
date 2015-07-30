[![Build Status](https://travis-ci.org/innowatio/kinesis-router.svg?branch=master)](https://travis-ci.org/innowatio/kinesis-router)
[![Coverage Status](https://coveralls.io/repos/innowatio/kinesis-router/badge.svg?branch=master&service=github)](https://coveralls.io/github/innowatio/kinesis-router?branch=master)
[![Dependency Status](https://david-dm.org/innowatio/kinesis-router.svg)](https://david-dm.org/innowatio/kinesis-router)
[![devDependency Status](https://david-dm.org/innowatio/kinesis-router/dev-status.svg)](https://david-dm.org/innowatio/kinesis-router#info=devDependencies)

# kinesis-router

Kinesis event router for lambda functions

### Usage

```js
/* Lambda function */
import router from "kinesis-router";

function doSomething (event) {
    console.log("Do something with:");
    console.log(event);
}

function doSomethingElse (event) {
    console.log("Do something else with:");
    console.log(event);
}

export var handler = router()
    .on("event_one", doSomething)
    .on("event_two", doSomethingElse);
```
