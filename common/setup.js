// Script/create-channel/common/setup.js
import { executeSteps } from './utils.js';

// Đọc file JSON trong init context
const setupData = JSON.parse(open('../../../mocks/setup-data.json')); // Điều chỉnh đường dẫn nếu cần

export function setup() {
  try {
    // Cập nhật globalContext từ file JSON
    globalContext.token = setupData.token || '__TOKEN__';
    globalContext.userId1 = setupData.userId1 || '__USER_ID__';
    // Thêm các biến khác nếu có (ví dụ: workspaceId)
    globalContext.workspaceId = setupData.workspaceId || '__WORKSPACE_ID__';
    console.log('Setup: Loaded setup data from JSON:', JSON.stringify(globalContext));

    let context = new TestContext();
    let contextData = context.clone();
    const beforeAllSteps = requestConfig.steps?.[0]?.actions?.beforeAll || [];

    if (beforeAllSteps.length > 0) {
      const results = executeSteps(beforeAllSteps, globalContext);
      results.forEach(result => {
        testResults.allSteps.push({
          ...result,
          caseTitle: `Setup`,
          phase: 'beforeAll'
        });
      });
    } else {
      contextData = globalContext;
    }
    return { contextData };
  } catch (error) {
    console.error('Setup failed:', error.message);
    throw error;
  }
}