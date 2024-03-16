import type { HandlerEvent, HandlerContext } from "@netlify/functions";

export {
    mockEvent,
    mockContext
}

const mockEvent = (input={}):HandlerEvent =>
    ({
        rawUrl: '',
        rawQuery: '',
        path: '',
        httpMethod: '',
        headers: {
            'content-type': 'application/json; charset=utf-8'
        },
        multiValueHeaders: {},
        queryStringParameters: {},
        isBase64Encoded: true,
        multiValueQueryStringParameters: {},
        body: '',
        ...input
    });

const mockContext = (input={}):HandlerContext => 
    ({
        callbackWaitsForEmptyEventLoop: false,
        functionName: '',
        functionVersion: '1',
        invokedFunctionArn: 'arn:mock',
        memoryLimitInMB: '128',
        awsRequestId: 'testRequestId',
        logGroupName: 'testLogGroup',
        logStreamName: 'testLogStream',
        identity: null,
        clientContext: null,
        getRemainingTimeInMillis: () => 5000,
        done: () => {},
        fail: () => {},
        succeed: () => {},
        ...input
    });