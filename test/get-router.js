import {resolve, reject} from "bluebird";
import chai, {expect} from "chai";
import chaiAsPromised from "chai-as-promised";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import {range} from "ramda";

chai.use(chaiAsPromised);
chai.use(sinonChai);

import getRouter, {__RewireAPI__ as getRouterRewireApi} from "get-router";

describe("`getRouter`", () => {

    it("returns a function", () => {
        const router = getRouter();
        expect(router).to.be.a("function");
    });

});

describe("`router`", () => {

    const context = {
        succeed: sinon.spy(),
        fail: sinon.spy()
    };
    const kinesisEvent = {};
    const eventsCount = 100;
    const getEvents = sinon.stub().returns(range(0, eventsCount).map(id => ({id})));

    before(() => {
        getRouterRewireApi.__Rewire__("getEvents", getEvents);
    });
    after(() => {
        getRouterRewireApi.__ResetDependency__("getEvents");
    });
    beforeEach(() => {
        context.fail.reset();
        context.succeed.reset();
        getEvents.reset();
    });

    describe("success case", () => {

        const routeEvent = sinon.stub().returns(resolve());

        before(() => {
            getRouterRewireApi.__Rewire__("routeEvent", routeEvent);
        });
        after(() => {
            getRouterRewireApi.__ResetDependency__("routeEvent");
        });
        beforeEach(() => {
            routeEvent.reset();
        });

        it("extracts events from the kinesis event", async () => {
            const router = getRouter();
            await router(kinesisEvent, context);
            expect(getEvents).to.have.callCount(1);
            expect(getEvents).to.have.been.calledWith(kinesisEvent);
            expect(routeEvent).to.have.callCount(eventsCount);
            range(0, eventsCount).forEach(id => {
                expect(routeEvent).to.have.been.calledWith(router, {id});
            });
        });

        it("successfully terminates the lambda function", async () => {
            const router = getRouter();
            await router(kinesisEvent, context);
            expect(context.succeed).to.have.callCount(1);
        });

    });

    describe("failure case", () => {

        const routeEvent = sinon.spy(() => reject(new Error("Error message")));

        before(() => {
            getRouterRewireApi.__Rewire__("routeEvent", routeEvent);
        });
        after(() => {
            getRouterRewireApi.__ResetDependency__("routeEvent");
        });
        beforeEach(() => {
            routeEvent.reset();
        });

        it("unsuccessfully terminates the lambda function", async () => {
            const router = getRouter();
            await router(kinesisEvent, context);
            expect(context.fail).to.have.callCount(1);
            expect(context.fail).to.have.been.calledWith(new Error("Error message"));
        });

    });

    describe("`on` method", () => {

        it("attaches routes", () => {
            const router = getRouter();
            const handler = sinon.spy();
            router.on("type", handler);
            expect(router.routes.type).to.equal(handler);
        });

        it("returns the router", () => {
            const router = getRouter();
            const handler = sinon.spy();
            const ret = router.on("type", handler);
            expect(router).to.equal(ret);
        });

    });

});

describe("`routeEvent`", () => {

    const routeEvent = getRouterRewireApi.__get__("routeEvent");

    it("calls the appropriate handler passing it the event", () => {
        const handler = sinon.spy();
        const router = getRouter().on("eventType", handler);
        const event = {
            type: "eventType"
        };
        routeEvent(router, event);
        expect(handler).to.have.been.calledWith(event);
    });

});
