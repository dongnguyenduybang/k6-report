
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
  path: '/FriendView/GetFriend',
  className: 'get-friend',
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
      title: 'should return errors ["Could not resolve permission type"] when body {"userId":123}',
      payload: {"userId":123},
      expectedErrors: ["Could not resolve permission type"]
    },

    {
      number: 2,
      title: 'should return errors ["Could not resolve permission type"] when body {"userId":""}',
      payload: {"userId":""},
      expectedErrors: ["Could not resolve permission type"]
    },

    {
      number: 3,
      title: 'should return errors ["Could not resolve permission type"] when body {"userId":null}',
      payload: {"userId":null},
      expectedErrors: ["Could not resolve permission type"]
    },

    {
      number: 4,
      title: 'should return errors ["Unauthorized request"] when body {"userId":"invalid_value"}',
      payload: {"userId":"invalid_value"},
      expectedErrors: ["Unauthorized request"]
    },

    {
      number: 5,
      title: 'should return errors [] when body {"userId":"{{userId}}"}',
      payload: {"userId":"{{userId}}"},
      expectedErrors: []
    }
  ];

  testCases.forEach(test => {
    group(`Test case #${test.number}: ${test.title}`, () => {
      totalTests.add(1);
      const resolvedData = resolveVariables(test.payload, setupContext);
      const headers = resolveVariables({"x-session-token":"{{token1}}"}, setupContext);
      
      const params = Object.keys(resolvedData).map(key => `${key}=${encodeURIComponent(resolvedData[key])}`).join('&');
      const url = 'https://api-dev.ziichat.dev/FriendView/GetFriend' + (params ? `?${params}` : '');
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

      const allErrorsMatched = softExpectDetails.every(actualError => 
        test.expectedErrors.includes(actualError)
      );
      const exactMatch = allErrorsMatched && 
                       softExpectDetails.length === test.expectedErrors.length;

      let passed = exactMatch;
      let warning = !exactMatch && allErrorsMatched;
      console.log(test.expectedErrors, softExpectDetails )
      // Store complete test result details
      const testResult = {
        testcase: test.number,
        title: test.title,
        status: passed ? 'passed' : warning ? 'warning' : 'failed',
        code: response.status,
        request: {
          method: 'GET',
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
        [`Errors match for testcase # [${testResult.status}]: ${test.number} ${test.expectedErrors}; ${softExpectDetails}`]: () => passed
      });
      
      sleep(1);
    });
  });
}

export function handleSummary(data) {
  const metrics = data.metrics || {};
  const testResults = {
    detailedResults: {
      summary: {
        totalTests: 0,
        passed: 0,
        failed: 0,
        warnings: 0,
        successRate: "0%",
      },
      failedTests: [],
      warnings: [],
      passedTests: [],
    },
  };

  data.root_group.groups.forEach(group => {
    const check = group.checks[0];
    const log = check.name;
    const path = group.path;

    // extract status from name ([passed], [failed], [warning])
    const testCaseStatusMatch = log.match(/\[(\w+)\]/);
    const testCaseStatus = testCaseStatusMatch ? testCaseStatusMatch[1].toLowerCase() : 'passed';

    // parse expected errors from the path field
    let expectedErrors = [];
    const expectedErrorsMatch = path.match(/should return errors \[(.*?)\]/);
    if (expectedErrorsMatch) {
     try {
        // Replace single quotes with double quotes for valid JSON, if needed
        const errorsStr = expectedErrorsMatch[1].replace(/'/g, '"');
        expectedErrors = JSON.parse(`[${errorsStr}]`);
      } catch (e) {
        console.error(`Failed to parse expected errors from path: ${path}`, e);
        // Fallback: split on commas, but this may not preserve commas in error messages
        expectedErrors = expectedErrorsMatch[1].split(',').map(e => e.trim()).filter(e => e);
      }

    }

    // Parse actual errors from the name field (after the semicolon)
    let actualErrors = [];
    const stripped = log.replace(/Errors match for testcase #\s*\[\w+\]:\s*\d+\s*/, '');
    const semicolonIndex = stripped.indexOf(';');
    if (semicolonIndex !== -1) {
      const actualErrorsRaw = stripped.substring(semicolonIndex + 1).trim();
      actualErrors = actualErrorsRaw ? actualErrorsRaw.split(',').map(e => e.trim()).filter(e => e) : [];
    } else {
      // If no semicolon, assume only actual errors are present
      actualErrors = stripped ? stripped.split(',').map(e => e.trim()).filter(e => e) : [];
    }

    // Create result entry
    const resultEntry = {
      expectedErrors,
      actualErrors,
      path: group.path,
      id: check.id || '',
      timestamp: new Date().toISOString(),
    };

    // Categorize based on status
    if (testCaseStatus === 'failed') {
      resultEntry.missing = actualErrors.filter(x => !expectedErrors.includes(x));
      resultEntry.extra = expectedErrors.filter(x => !actualErrors.includes(x));
      testResults.detailedResults.failedTests.push(resultEntry);
    } else if (testCaseStatus === 'warning') {
      resultEntry.warningMessage = `Actual errors include expected errors but don't match exactly`;
      testResults.detailedResults.warnings.push(resultEntry);
    } else {
      testResults.detailedResults.passedTests.push(resultEntry);
    }
  });

  // Update summary metrics
  testResults.detailedResults.summary.totalTests = data.root_group.groups.length;
  testResults.detailedResults.summary.passed = testResults.detailedResults.passedTests.length;
  testResults.detailedResults.summary.failed = testResults.detailedResults.failedTests.length;
  testResults.detailedResults.summary.warnings = testResults.detailedResults.warnings.length;
  testResults.detailedResults.summary.successRate =
    testResults.detailedResults.summary.totalTests > 0
      ? (
        (testResults.detailedResults.summary.passed /
          testResults.detailedResults.summary.totalTests) *
        100
      ).toFixed(2) + '%'
      : '0%';

  const summary = {
    testResults: testResults,
    metrics: {
      http_reqs: metrics.http_reqs?.values || { count: 0 },
      http_req_duration: metrics.http_req_duration?.values || { avg: 0 },
      http_req_connecting: metrics.http_req_connecting?.values || { avg: 0 },
      http_req_tls_handshaking: metrics.http_req_tls_handshaking?.values || { avg: 0 },
      http_req_duration: metrics.http_req_duration?.values || { avg: 0 },
      iteration_duration: metrics.iteration_duration?.values || { avg: 0 },
      http_req_waiting: metrics.http_req_waiting?.values || { avg: 0 },
      http_req_sending: metrics.http_req_sending?.values || { avg: 0 },
      http_req_receiving: metrics.http_req_receiving?.values || { avg: 0 },
      http_req_blocked: metrics.http_req_blocked?.values || { avg: 0 },
      vus: metrics.vus?.values || { count: 0 },
      vus_max: metrics.vus_max?.values || { count: 0 },
      totalTestsMetric: metrics.total_tests?.values || { count: 0 },
      passedTestsMetric: metrics.passed_tests?.values || { count: 0 },
      failedTestsMetric: metrics.failed_tests?.values || { count: 0 },
      warningsMetric: metrics.warnings?.values || { count: 0 },
    },
  };

  return {
    'summary.json': JSON.stringify(summary, null, 2),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  };
}

