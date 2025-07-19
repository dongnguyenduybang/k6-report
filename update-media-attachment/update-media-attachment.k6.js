
import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Counter } from 'k6/metrics';
import { resolveVariables } from '../common/utils.js'
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';

// Read the file during init stage
const setupDataRaw = open('./common/setup-data.k6.json');
let setupData = JSON.parse(setupDataRaw);
// read file option 
const optionDataRaw = open('./common/options.k6.json');
let optionData = JSON.parse(optionDataRaw)
const passedTests = new Counter('passed_tests');
const totalTests = new Counter('total_tests');
const failedTests = new Counter('failed_tests');
const warnings = new Counter('warnings');

let testResults = {
  path: '/Message/UpdateMediaAttachments',
  className: 'update-media-attachment',
  allSteps: [],
  failedTests: [],
  codedTest: [],
  warnings: [],
  passedTests: 0,
  totalTests: 0,
  failedStep: []
};

export const options = optionData;

export function setup() {
  return setupData
}

export default function (data) {
  let setupContext = data.data;
  let testCaseNumber = 0;

  const testCases = [
    
    {
      number: 1,
      title: 'should return errors ["Could not resolve permission type"] when body {"workspaceId":123,"channelId":"","messageId":"","attachmentType":0,"ref":"","mediaObjects":[]}',
      payload: {"workspaceId":123,"channelId":"","messageId":"","attachmentType":0,"ref":"","mediaObjects":[]},
      expectedErrors: ["Could not resolve permission type"]
    },

    {
      number: 2,
      title: 'should return errors ["Could not resolve permission type"] when body {"workspaceId":"","channelId":"","messageId":"","attachmentType":0,"ref":"","mediaObjects":[]}',
      payload: {"workspaceId":"","channelId":"","messageId":"","attachmentType":0,"ref":"","mediaObjects":[]},
      expectedErrors: ["Could not resolve permission type"]
    },

    {
      number: 3,
      title: 'should return errors ["Could not resolve permission type"] when body {"workspaceId":null,"channelId":"","messageId":"","attachmentType":0,"ref":"","mediaObjects":[]}',
      payload: {"workspaceId":null,"channelId":"","messageId":"","attachmentType":0,"ref":"","mediaObjects":[]},
      expectedErrors: ["Could not resolve permission type"]
    },

    {
      number: 4,
      title: 'should return errors ["Could not resolve permission type"] when body {"workspaceId":"invalid_value","channelId":"","messageId":"","attachmentType":0,"ref":"","mediaObjects":[]}',
      payload: {"workspaceId":"invalid_value","channelId":"","messageId":"","attachmentType":0,"ref":"","mediaObjects":[]},
      expectedErrors: ["Could not resolve permission type"]
    },

    {
      number: 5,
      title: 'should return errors ["Could not resolve permission type"] when body {"workspaceId":"","channelId":123,"messageId":"","attachmentType":0,"ref":"","mediaObjects":[]}',
      payload: {"workspaceId":"","channelId":123,"messageId":"","attachmentType":0,"ref":"","mediaObjects":[]},
      expectedErrors: ["Could not resolve permission type"]
    },

    {
      number: 6,
      title: 'should return errors ["Could not resolve permission type"] when body {"workspaceId":"","channelId":null,"messageId":"","attachmentType":0,"ref":"","mediaObjects":[]}',
      payload: {"workspaceId":"","channelId":null,"messageId":"","attachmentType":0,"ref":"","mediaObjects":[]},
      expectedErrors: ["Could not resolve permission type"]
    },

    {
      number: 7,
      title: 'should return errors ["Could not resolve permission type"] when body {"workspaceId":"","channelId":"invalid_value","messageId":"","attachmentType":0,"ref":"","mediaObjects":[]}',
      payload: {"workspaceId":"","channelId":"invalid_value","messageId":"","attachmentType":0,"ref":"","mediaObjects":[]},
      expectedErrors: ["Could not resolve permission type"]
    },

    {
      number: 8,
      title: 'should return errors ["Could not resolve permission type"] when body {"workspaceId":"","channelId":"","messageId":123,"attachmentType":0,"ref":"","mediaObjects":[]}',
      payload: {"workspaceId":"","channelId":"","messageId":123,"attachmentType":0,"ref":"","mediaObjects":[]},
      expectedErrors: ["Could not resolve permission type"]
    },

    {
      number: 9,
      title: 'should return errors ["Could not resolve permission type"] when body {"workspaceId":"","channelId":"","messageId":null,"attachmentType":0,"ref":"","mediaObjects":[]}',
      payload: {"workspaceId":"","channelId":"","messageId":null,"attachmentType":0,"ref":"","mediaObjects":[]},
      expectedErrors: ["Could not resolve permission type"]
    },

    {
      number: 10,
      title: 'should return errors ["Could not resolve permission type"] when body {"workspaceId":"","channelId":"","messageId":"invalid_ULID","attachmentType":0,"ref":"","mediaObjects":[]}',
      payload: {"workspaceId":"","channelId":"","messageId":"invalid_ULID","attachmentType":0,"ref":"","mediaObjects":[]},
      expectedErrors: ["Could not resolve permission type"]
    },

    {
      number: 11,
      title: 'should return errors ["Could not resolve permission type"] when body {"workspaceId":"","channelId":"","messageId":"","attachmentType":"invalid_enum_value","ref":"","mediaObjects":[]}',
      payload: {"workspaceId":"","channelId":"","messageId":"","attachmentType":"invalid_enum_value","ref":"","mediaObjects":[]},
      expectedErrors: ["Could not resolve permission type"]
    },

    {
      number: 12,
      title: 'should return errors ["Could not resolve permission type"] when body {"workspaceId":"","channelId":"","messageId":"","attachmentType":"","ref":"","mediaObjects":[]}',
      payload: {"workspaceId":"","channelId":"","messageId":"","attachmentType":"","ref":"","mediaObjects":[]},
      expectedErrors: ["Could not resolve permission type"]
    },

    {
      number: 13,
      title: 'should return errors ["Could not resolve permission type"] when body {"workspaceId":"","channelId":"","messageId":"","attachmentType":null,"ref":"","mediaObjects":[]}',
      payload: {"workspaceId":"","channelId":"","messageId":"","attachmentType":null,"ref":"","mediaObjects":[]},
      expectedErrors: ["Could not resolve permission type"]
    },

    {
      number: 14,
      title: 'should return errors ["Could not resolve permission type"] when body {"workspaceId":"","channelId":"","messageId":"","attachmentType":0,"ref":123,"mediaObjects":[]}',
      payload: {"workspaceId":"","channelId":"","messageId":"","attachmentType":0,"ref":123,"mediaObjects":[]},
      expectedErrors: ["Could not resolve permission type"]
    },

    {
      number: 15,
      title: 'should return errors ["Could not resolve permission type"] when body {"workspaceId":"","channelId":"","messageId":"","attachmentType":0,"ref":null,"mediaObjects":[]}',
      payload: {"workspaceId":"","channelId":"","messageId":"","attachmentType":0,"ref":null,"mediaObjects":[]},
      expectedErrors: ["Could not resolve permission type"]
    },

    {
      number: 16,
      title: 'should return errors ["Could not resolve permission type"] when body {"workspaceId":"","channelId":"","messageId":"","attachmentType":0,"ref":"","mediaObjects":"not_an_array"}',
      payload: {"workspaceId":"","channelId":"","messageId":"","attachmentType":0,"ref":"","mediaObjects":"not_an_array"},
      expectedErrors: ["Could not resolve permission type"]
    },

    {
      number: 17,
      title: 'should return errors ["Could not resolve permission type"] when body {"workspaceId":"","channelId":"","messageId":"","attachmentType":0,"ref":"","mediaObjects":["string"]}',
      payload: {"workspaceId":"","channelId":"","messageId":"","attachmentType":0,"ref":"","mediaObjects":["string"]},
      expectedErrors: ["Could not resolve permission type"]
    },

    {
      number: 18,
      title: 'should return errors ["Could not resolve permission type"] when body {"workspaceId":"","channelId":"","messageId":"","attachmentType":0,"ref":"","mediaObjects":[{}]}',
      payload: {"workspaceId":"","channelId":"","messageId":"","attachmentType":0,"ref":"","mediaObjects":[{}]},
      expectedErrors: ["Could not resolve permission type"]
    },

    {
      number: 19,
      title: 'should return errors ["Could not resolve permission type"] when body {"workspaceId":"","channelId":"","messageId":"","attachmentType":0,"ref":"","mediaObjects":["uniqueItem","uniqueItem"]}',
      payload: {"workspaceId":"","channelId":"","messageId":"","attachmentType":0,"ref":"","mediaObjects":["uniqueItem","uniqueItem"]},
      expectedErrors: ["Could not resolve permission type"]
    },

    {
      number: 20,
      title: 'should return errors ["Could not resolve permission type"] when body {"workspaceId":"","channelId":"","messageId":"","attachmentType":0,"ref":"","mediaObjects":[null]}',
      payload: {"workspaceId":"","channelId":"","messageId":"","attachmentType":0,"ref":"","mediaObjects":[null]},
      expectedErrors: ["Could not resolve permission type"]
    },

    {
      number: 21,
      title: 'should return errors ["Could not resolve permission type"] when body {"workspaceId":"","channelId":"","messageId":"","attachmentType":0,"ref":"","mediaObjects":[""]}',
      payload: {"workspaceId":"","channelId":"","messageId":"","attachmentType":0,"ref":"","mediaObjects":[""]},
      expectedErrors: ["Could not resolve permission type"]
    },

    {
      number: 22,
      title: 'should return errors ["Could not resolve permission type"] when body {"workspaceId":"","channelId":"","messageId":"","attachmentType":0,"ref":"","mediaObjects":""}',
      payload: {"workspaceId":"","channelId":"","messageId":"","attachmentType":0,"ref":"","mediaObjects":""},
      expectedErrors: ["Could not resolve permission type"]
    },

    {
      number: 23,
      title: 'should return errors ["Could not resolve permission type"] when body {"workspaceId":"","channelId":"","messageId":"","attachmentType":0,"ref":"","mediaObjects":null}',
      payload: {"workspaceId":"","channelId":"","messageId":"","attachmentType":0,"ref":"","mediaObjects":null},
      expectedErrors: ["Could not resolve permission type"]
    }
  ];

  testCases.forEach(test => {
    group(`Test case #${test.number}: ${test.title}`, () => {
      totalTests.add(1);
      const resolvedData = resolveVariables(test.payload, setupContext);
      const headers = resolveVariables({"x-session-token":"{{token}}"}, setupContext);
      const response = http.post(
          'https://api-dev.ziichat.dev/Message/UpdateMediaAttachments', 
          JSON.stringify(resolvedData), 
          { headers }
        );

      let expectDetails = [];
      let softExpectDetails = [];
      
      if ([200, 201, 400, 403, 404, 500].includes(response.status)) {
        const contentType = response.headers['Content-Type']?.toLowerCase() || '';
        if (contentType.includes('application/json')) {
          try {
            const data = JSON.parse(response.body || '{}');
            expectDetails = Array.isArray(data?.error?.details)
              ? data.error.details
              : data?.error?.details
                ? [data.error.details]
                : data?.ok === true
                  ? []
                  : data !== undefined && data !== null
                    ? [JSON.stringify(data)]
                    : [];

      
          } catch (e) {
            console.error(`Failed to parse JSON for test ${test.number}: ${e.message}`);
            expectDetails = [response.body || ''];
          }
        } else {
          expectDetails = response.body ? [response.body.trim()] : [];
        }
        softExpectDetails = [...expectDetails].sort();
      }

      console.log(softExpectDetails, test.expectedErrors)
      const allErrorsMatched = softExpectDetails.every(actualError => 
        test.expectedErrors.includes(actualError)
      );
      const exactMatch = allErrorsMatched && 
                       softExpectDetails.length === test.expectedErrors.length;

      let passed = exactMatch;
      let warning = !exactMatch && allErrorsMatched;
      check(response, {
        [`Errors match for testcase #${test.number}`]: () =>  passed || warning
      });

      if (exactMatch) {
        passedTests.add(1);
        testResults.passedTests++;
        testResults.codedTest.push({
          testcase: test.number,
          code: response.status,
          body: resolvedData
        });
      } else if (allErrorsMatched) {
        warnings.add(1);
        testResults.warnings.push({
          testcase: test.number,
          code: response.status,
          body: resolvedData,
          actualErrors: softExpectDetails,
          expectedErrors: test.expectedErrors,
          message: "Actual errors include expected errors"
        });
      } else {
        failedTests.add(1);
        testResults.failedTests.push({
          testcase: test.number,
          code: response.status,
          body: resolvedData,
          missing: softExpectDetails.filter(x => !test.expectedErrors.includes(x)),
          extra: test.expectedErrors.filter(x => !softExpectDetails.includes(x))
        });
      }
      testResults.totalTests++;
      sleep(1);
    });
  });
}

export function teardown(data) {
  
}

export function handleSummary(data) {
  const metrics = data.metrics || {};

  const jsonOutput = {
    stdout: JSON.stringify({
      metrics: {
        http_reqs: data.metrics.http_reqs?.values || { count: 0 },
        http_req_duration: data.metrics.http_req_duration?.values || { avg: 0 },
        passedTestsMetric: metrics.passed_tests?.values || { count: 0 },
        failedTestsMetric: metrics.failed_tests?.values || { count: 0 },
        warningsMetric: metrics.warnings?.values || { count: 0 }
      },
      testResults
    }, null, 2)
  };

  // Add the default text summary
  return {
    ...jsonOutput,
    'stdout': textSummary(data, { indent: ' ', enableColors: true })
  };
}
