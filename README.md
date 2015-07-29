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
