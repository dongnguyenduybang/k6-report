
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
  path: '/Message/SendDmMessageMedia',
  className: 'send-dm-message-media',
  allSteps: [],
  failedTests: [],
  codedTest: [],
  warnings: [],
  passedTests: 0,
  totalTests: 0,
  failedStep: [],
  executionDate: new Date().toISOString(),
  environment: "dev",
  detailedResults: {
    summary: {},
    failedTests: [],
    warnings: [],
    passedTests: []
  }
};

export const options = optionData;

export function setup() {
  return setupData
}

export default function (data) {
  let setupContext = data.data;

  const testCases = [
    
    {
      number: 1,
      title: 'should return errors ["Could not resolve permission type"] when body {"userId":123,"attachmentType":0,"ref":"","mediaObjects":[]}',
      payload: {"userId":123,"attachmentType":0,"ref":"","mediaObjects":[]},
      expectedErrors: ["Could not resolve permission type"]
    },

    {
      number: 2,
      title: 'should return errors ["Could not resolve permission type"] when body {"userId":"","attachmentType":0,"ref":"","mediaObjects":[]}',
      payload: {"userId":"","attachmentType":0,"ref":"","mediaObjects":[]},
      expectedErrors: ["Could not resolve permission type"]
    },

    {
      number: 3,
      title: 'should return errors ["Could not resolve permission type"] when body {"userId":null,"attachmentType":0,"ref":"","mediaObjects":[]}',
      payload: {"userId":null,"attachmentType":0,"ref":"","mediaObjects":[]},
      expectedErrors: ["Could not resolve permission type"]
    },

    {
      number: 4,
      title: 'should return errors ["Unauthorized request"] when body {"userId":"invalid_value","attachmentType":0,"ref":"","mediaObjects":[]}',
      payload: {"userId":"invalid_value","attachmentType":0,"ref":"","mediaObjects":[]},
      expectedErrors: ["Unauthorized request"]
    },

    {
      number: 5,
      title: 'should return errors ["Could not resolve permission type"] when body {"userId":"","attachmentType":"invalid_enum_value","ref":"","mediaObjects":[]}',
      payload: {"userId":"","attachmentType":"invalid_enum_value","ref":"","mediaObjects":[]},
      expectedErrors: ["Could not resolve permission type"]
    },

    {
      number: 6,
      title: 'should return errors ["Could not resolve permission type"] when body {"userId":"","attachmentType":"","ref":"","mediaObjects":[]}',
      payload: {"userId":"","attachmentType":"","ref":"","mediaObjects":[]},
      expectedErrors: ["Could not resolve permission type"]
    },

    {
      number: 7,
      title: 'should return errors ["Could not resolve permission type"] when body {"userId":"","attachmentType":null,"ref":"","mediaObjects":[]}',
      payload: {"userId":"","attachmentType":null,"ref":"","mediaObjects":[]},
      expectedErrors: ["Could not resolve permission type"]
    },

    {
      number: 8,
      title: 'should return errors ["Could not resolve permission type"] when body {"userId":"","attachmentType":0,"ref":123,"mediaObjects":[]}',
      payload: {"userId":"","attachmentType":0,"ref":123,"mediaObjects":[]},
      expectedErrors: ["Could not resolve permission type"]
    },

    {
      number: 9,
      title: 'should return errors ["Could not resolve permission type"] when body {"userId":"","attachmentType":0,"ref":null,"mediaObjects":[]}',
      payload: {"userId":"","attachmentType":0,"ref":null,"mediaObjects":[]},
      expectedErrors: ["Could not resolve permission type"]
    },

    {
      number: 10,
      title: 'should return errors ["Could not resolve permission type"] when body {"userId":"","attachmentType":0,"ref":"","mediaObjects":"not_an_array"}',
      payload: {"userId":"","attachmentType":0,"ref":"","mediaObjects":"not_an_array"},
      expectedErrors: ["Could not resolve permission type"]
    },

    {
      number: 11,
      title: 'should return errors ["Could not resolve permission type"] when body {"userId":"","attachmentType":0,"ref":"","mediaObjects":["string"]}',
      payload: {"userId":"","attachmentType":0,"ref":"","mediaObjects":["string"]},
      expectedErrors: ["Could not resolve permission type"]
    },

    {
      number: 12,
      title: 'should return errors ["Could not resolve permission type"] when body {"userId":"","attachmentType":0,"ref":"","mediaObjects":[{}]}',
      payload: {"userId":"","attachmentType":0,"ref":"","mediaObjects":[{}]},
      expectedErrors: ["Could not resolve permission type"]
    },

    {
      number: 13,
      title: 'should return errors ["Could not resolve permission type"] when body {"userId":"","attachmentType":0,"ref":"","mediaObjects":["uniqueItem","uniqueItem"]}',
      payload: {"userId":"","attachmentType":0,"ref":"","mediaObjects":["uniqueItem","uniqueItem"]},
      expectedErrors: ["Could not resolve permission type"]
    },

    {
      number: 14,
      title: 'should return errors ["Could not resolve permission type"] when body {"userId":"","attachmentType":0,"ref":"","mediaObjects":[null]}',
      payload: {"userId":"","attachmentType":0,"ref":"","mediaObjects":[null]},
      expectedErrors: ["Could not resolve permission type"]
    },

    {
      number: 15,
      title: 'should return errors ["Could not resolve permission type"] when body {"userId":"","attachmentType":0,"ref":"","mediaObjects":[""]}',
      payload: {"userId":"","attachmentType":0,"ref":"","mediaObjects":[""]},
      expectedErrors: ["Could not resolve permission type"]
    },

    {
      number: 16,
      title: 'should return errors ["Could not resolve permission type"] when body {"userId":"","attachmentType":0,"ref":"","mediaObjects":""}',
      payload: {"userId":"","attachmentType":0,"ref":"","mediaObjects":""},
      expectedErrors: ["Could not resolve permission type"]
    },

    {
      number: 17,
      title: 'should return errors ["Could not resolve permission type"] when body {"userId":"","attachmentType":0,"ref":"","mediaObjects":null}',
      payload: {"userId":"","attachmentType":0,"ref":"","mediaObjects":null},
      expectedErrors: ["Could not resolve permission type"]
    }
  ];

  testCases.forEach(test => {
    group(`Test case #${test.number}: ${test.title}`, () => {
      totalTests.add(1);
      const resolvedData = resolveVariables(test.payload, setupContext);
      const headers = resolveVariables({"x-session-token":"{{token}}"}, setupContext);
      
      const response = http.post(
          'https://api-dev.ziichat.dev/Message/SendDmMessageMedia', 
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

      const allErrorsMatched = softExpectDetails.every(actualError => 
        test.expectedErrors.includes(actualError)
      );
      const exactMatch = allErrorsMatched && 
                       softExpectDetails.length === test.expectedErrors.length;

      let passed = exactMatch;
      let warning = !exactMatch && allErrorsMatched;
      
      // Store complete test result details
      const testResult = {
        testcase: test.number,
        title: test.title,
        status: passed ? 'passed' : warning ? 'warning' : 'failed',
        code: response.status,
        request: {
          method: 'POST',
          headers: headers,
          body: resolvedData
        },
        response: {
          status: response.status,
          headers: response.headers,
          body: response.body
        },
        actualErrors: softExpectDetails,
        expectedErrors: test.expectedErrors,
        timestamp: new Date().toISOString()
      };

      if (passed) {
        passedTests.add(1);
        testResults.passedTests++;
        testResults.codedTest.push(testResult);
        testResults.detailedResults.passedTests.push(testResult);
      } else if (warning) {
        warnings.add(1);
        testResult.message = "Actual errors include expected errors but don't match exactly";
        testResults.warnings.push(testResult);
        testResults.detailedResults.warnings.push(testResult);
      } else {
        failedTests.add(1);
        testResult.missing = softExpectDetails.filter(x => !test.expectedErrors.includes(x));
        testResult.extra = test.expectedErrors.filter(x => !softExpectDetails.includes(x));
        testResults.failedTests.push(testResult);
        testResults.detailedResults.failedTests.push(testResult);
      }
      
      testResults.allSteps.push(testResult);
      testResults.totalTests++;
      
      check(response, {
        [`Errors match for testcase #${test.number}`]: () => passed || warning
      });
      
      sleep(1);
    });
  });
}

export function handleSummary(data) {
  const metrics = data.metrics || {};

  // Build summary statistics
  testResults.detailedResults.summary = {
    totalTests: testResults.totalTests,
    passed: testResults.passedTests,
    failed: testResults.failedTests.length,
    warnings: testResults.warnings.length,
    successRate: (testResults.passedTests / testResults.totalTests * 100).toFixed(2) + '%',
    durationMetrics: {
      avg: metrics.http_req_duration?.values?.avg || 0,
      min: metrics.http_req_duration?.values?.min || 0,
      med: metrics.http_req_duration?.values?.med || 0,
      max: metrics.http_req_duration?.values?.max || 0,
      p90: metrics.http_req_duration?.values?.p90 || 0,
      p95: metrics.http_req_duration?.values?.p95 || 0
    }
  };

  const summary = {
    metrics: {
      http_reqs: metrics.http_reqs?.values || { count: 0 },
      http_req_duration: metrics.http_req_duration?.values || { avg: 0 },
      passedTestsMetric: metrics.passed_tests?.values || { count: 0 },
      failedTestsMetric: metrics.failed_tests?.values || { count: 0 },
      warningsMetric: metrics.warnings?.values || { count: 0 }
    },
    testResults: testResults
  };

  return {
    'summary.json': JSON.stringify(summary, null, 2),
    'stdout': textSummary(data, { indent: ' ', enableColors: true })
  };
}
