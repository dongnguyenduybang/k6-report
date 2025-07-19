import { executeSteps } from './utils.js';

export function teardown(data) {
  const afterAllSteps = requestConfig.steps?.[0]?.actions?.afterAll || [];
  let context = new TestContext();
  if (afterAllSteps.length > 0) {
    const results = executeSteps(afterAllSteps, context);
    results.forEach(result => {
      testResults.allSteps.push({
        ...result,
        caseTitle: `Teardown`,
        phase: 'afterAll'
      });
    });
  }
}