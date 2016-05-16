[![npm version](https://badge.fury.io/js/kinesis-router.svg)](https://badge.fury.io/js/kinesis-router)
[![Build Status](https://travis-ci.org/lk-architecture/kinesis-router.svg?branch=master)](https://travis-ci.org/lk-architecture/kinesis-router)
[![Dependency Status](https://david-dm.org/lk-architecture/kinesis-router.svg)](https://david-dm.org/lk-architecture/kinesis-router)
[![devDependency Status](https://david-dm.org/lk-architecture/kinesis-router/dev-status.svg)](https://david-dm.org/lk-architecture/kinesis-router#info=devDependencies)

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
