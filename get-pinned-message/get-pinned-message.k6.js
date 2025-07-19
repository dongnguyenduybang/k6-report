
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
  path: '/MessageView/GetPinnedMessage',
  className: 'get-pinned-message',
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
      title: 'should return errors ["Could not resolve permission type"] when body {"workspaceId":123,"channelId":"{{channelId}}"}',
      payload: {"workspaceId":123,"channelId":"{{channelId}}"},
      expectedErrors: ["Could not resolve permission type"]
    },

    {
      number: 2,
      title: 'should return errors ["Could not resolve permission type"] when body {"workspaceId":"","channelId":"{{channelId}}"}',
      payload: {"workspaceId":"","channelId":"{{channelId}}"},
      expectedErrors: ["Could not resolve permission type"]
    },

    {
      number: 3,
      title: 'should return errors ["workspaceId should not be null"] when body {"workspaceId":null,"channelId":"{{channelId}}"}',
      payload: {"workspaceId":null,"channelId":"{{channelId}}"},
      expectedErrors: ["workspaceId should not be null"]
    },

    {
      number: 4,
      title: 'should return errors ["Invalid channel"] when body {"workspaceId":"invalid_value","channelId":"{{channelId}}"}',
      payload: {"workspaceId":"invalid_value","channelId":"{{channelId}}"},
      expectedErrors: ["Invalid channel"]
    },

    {
      number: 5,
      title: 'should return errors ["Could not resolve permission type"] when body {"workspaceId":"0","channelId":123}',
      payload: {"workspaceId":"0","channelId":123},
      expectedErrors: ["Could not resolve permission type"]
    },

    {
      number: 6,
      title: 'should return errors ["Could not resolve permission type"] when body {"workspaceId":"0","channelId":""}',
      payload: {"workspaceId":"0","channelId":""},
      expectedErrors: ["Could not resolve permission type"]
    },

    {
      number: 7,
      title: 'should return errors ["Could not resolve permission type"] when body {"workspaceId":"0","channelId":null}',
      payload: {"workspaceId":"0","channelId":null},
      expectedErrors: ["Could not resolve permission type"]
    },

    {
      number: 8,
      title: 'should return errors ["Invalid channel"] when body {"workspaceId":"0","channelId":"invalid_value"}',
      payload: {"workspaceId":"0","channelId":"invalid_value"},
      expectedErrors: ["Invalid channel"]
    },

    {
      number: 9,
      title: 'should return errors [] when body {"workspaceId":"0","channelId":"{{channelId}}"}',
      payload: {"workspaceId":"0","channelId":"{{channelId}}"},
      expectedErrors: []
    }
  ];

  testCases.forEach(test => {
    group(`Test case #${test.number}: ${test.title}`, () => {
      totalTests.add(1);
      const resolvedData = resolveVariables(test.payload, setupContext);
      const headers = resolveVariables({"x-session-token":"{{token}}"}, setupContext);
      const params = Object.keys(resolvedData).map(key => `${key}=${encodeURIComponent(resolvedData[key])}`).join('&');
        const url = 'https://api-dev.ziichat.dev/MessageView/GetPinnedMessage' + (params ? `?${params}` : '');
        const response = http.get(url, { headers });

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
