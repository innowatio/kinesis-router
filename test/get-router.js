import BPromise from "bluebird";
import chai, {expect} from "chai";
import chaiAsPromised from "chai-as-promised";
import sinon from "sinon";
import sinonChai from "sinon-chai";

chai.use(chaiAsPromised);
chai.use(sinonChai);

import getRouter, {__RewireAPI__ as getRouterRewireApi} from "get-router";

describe("`getRouter`", function () {

    it("returns a function", function () {
        var router = getRouter();
        expect(router).to.be.a("function");
    });

});

describe("`router`", function () {

    describe("`on` method", function () {

        it("attaches routes", function () {
            var router = getRouter();
            var handler = sinon.spy();
            router.on("type", handler);
            expect(router.routes.type).to.equal(handler);
        });

        it("returns the router", function () {
            var router = getRouter();
            var handler = sinon.spy();
            var ret = router.on("type", handler);
            expect(router).to.equal(ret);
        });

    });

});

describe("`getApplicationEvent`", function () {

    var getApplicationEvent = getRouterRewireApi.__get__("getApplicationEvent");

    it("returns a promise", function () {
        var ret = getApplicationEvent();
        // Handle promise failure to avoid warning logs
        ret.catch(ignore => ignore);
        expect(ret).to.be.an.instanceOf(BPromise);
    });

    it("extracts data from a kinesis event (into an application event)", function () {
        var applicationEvent = {
            type: "type",
            timestamp: 0,
            data: {
                key: "value"
            }
        };
        var kinesisEvent = {
            Records: [{
                kinesis: {
                    data: new Buffer(JSON.stringify(applicationEvent)).toString("base64")
                }
            }]
        };
        var extractedEvent = getApplicationEvent(kinesisEvent);
        expect(extractedEvent).to.eventually.eql(applicationEvent);
    });

});

describe("`routeEvent`", function () {

    var routeEvent = getRouterRewireApi.__get__("routeEvent");

    it("calls the appropriate handler passing it the event", function () {
        var handler = sinon.spy();
        var router = getRouter().on("eventType", handler);
        var event = {
            type: "eventType"
        };
        routeEvent(router, event);
        expect(handler).to.have.been.calledWith(event);
    });

});
