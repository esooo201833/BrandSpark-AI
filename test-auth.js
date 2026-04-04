#!/usr/bin/env node

/**
 * Email Verification API Test Script
 * Tests all auth endpoints: signup, verify, login
 */

/* eslint-disable @typescript-eslint/no-require-imports */
const http = require('http');

const API_BASE = 'http://localhost:3002/api/auth';

// ANSI colors for output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(color, ...args) {
  console.log(color, ...args, colors.reset);
}

// Make HTTP request
function makeRequest(method, endpoint, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(endpoint);
    
    const options = {
      hostname: url.hostname,
      port: url.port || 80,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed });
        } catch {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

// Test functions
async function testSignup() {
  log(colors.cyan, '\n📝 Test 1: SIGNUP');
  log(colors.yellow, '================');
  
  const userData = {
    name: 'احمد علي',
    email: `test-${Date.now()}@gmail.com`,
    password: 'TestPassword123'
  };

  try {
    log(colors.blue, 'Sending:', JSON.stringify(userData, null, 2));
    
    const response = await makeRequest('POST', `${API_BASE}/signup`, userData);
    
    if (response.status === 201 && response.data.success) {
      log(colors.green, '✅ Signup successful!');
      log(colors.blue, JSON.stringify(response.data, null, 2));
      return { success: true, email: userData.email, token: response.data.token };
    } else {
      log(colors.red, '❌ Signup failed!');
      log(colors.blue, `Status: ${response.status}`);
      log(colors.blue, JSON.stringify(response.data, null, 2));
      return { success: false };
    }
  } catch (error) {
    log(colors.red, '❌ Error during signup:', error.message);
    return { success: false };
  }
}

async function testLogin(email, password) {
  log(colors.cyan, '\n🔐 Test 3: LOGIN');
  log(colors.yellow, '================');
  
  const credentials = { email, password };

  try {
    log(colors.blue, 'Sending:', JSON.stringify(credentials, null, 2));
    
    const response = await makeRequest('POST', `${API_BASE}/login`, credentials);
    
    if (response.status === 200 && response.data.success) {
      log(colors.green, '✅ Login successful!');
      log(colors.blue, JSON.stringify(response.data, null, 2));
      return { success: true };
    } else if (response.status === 403) {
      log(colors.yellow, '⚠️  Email not verified');
      log(colors.blue, JSON.stringify(response.data, null, 2));
      return { success: false, needsVerification: true };
    } else {
      log(colors.red, '❌ Login failed!');
      log(colors.blue, `Status: ${response.status}`);
      log(colors.blue, JSON.stringify(response.data, null, 2));
      return { success: false };
    }
  } catch (error) {
    log(colors.red, '❌ Error during login:', error.message);
    return { success: false };
  }
}

async function testVerify(email) {
  log(colors.cyan, '\n✉️ Test 2: VERIFY EMAIL');
  log(colors.yellow, '=======================');
  
  log(colors.yellow, '⚠️  Manual step: Check email for verification link');
  log(colors.yellow, `Email sent to: ${email}`);
  log(colors.yellow, '\nVerification link format: /api/auth/verify?token=TOKEN&email=EMAIL');
  log(colors.yellow, '\nTo simulate verification, you can:');
  log(colors.blue, `1. Check database: SELECT emailToken FROM User WHERE email='${email}'`);
  log(colors.blue, `2. Call: GET /api/auth/verify?token=TOKEN_VALUE&email=${email}`);
  
  return { manual: true };
}

async function runTests() {
  log(colors.cyan, '\n🚀 BrandSpark AI - Email Verification Testing\n');
  
  try {
    // Test 1: Signup
    const signupResult = await testSignup();
    
    if (!signupResult.success) {
      log(colors.red, '\n❌ Signup failed, cannot proceed with further tests');
      return;
    }

    // Test 2: Verify (manual)
    await testVerify(signupResult.email);

    // Test 3: Login (will fail - email not verified)
    const loginResult = await testLogin(signupResult.email, 'TestPassword123');
    
    if (loginResult.needsVerification) {
      log(colors.yellow, '\n✅ Test passed: Email verification is required');
    }

    log(colors.cyan, '\n' + '='.repeat(50));
    log(colors.green, '\n✅ All tests completed!');
    log(colors.cyan, '\nNext steps:');
    log(colors.blue, '1. Check email for verification link');
    log(colors.blue, '2. Click link to verify');
    log(colors.blue, '3. Try login again');
    log(colors.blue, '4. Access dashboard');
    
  } catch (error) {
    log(colors.red, '\n❌ Test suite error:', error.message);
  }
}

// Run tests
runTests().catch(console.error);
