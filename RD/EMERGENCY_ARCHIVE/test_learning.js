// Test Learning System - Simulates LLM mistakes and learning
const fs = require('fs');
const path = require('path');
const { LearningSystem } = require('./learning_system');

// Mock logger
const logger = {
    log: (message) => console.log(`[TEST] ${message}`),
    error: (message) => console.log(`[TEST ERROR] ${message}`)
};

// Mock config
const config = {
    rdPath: 'g:/Code/CV/RD'
};

// Initialize learning system
const learningSystem = new LearningSystem(logger, config);

// Simulate testing different scenarios
console.log('\n🧪 TESTING LEARNING SYSTEM\n');

// Test 1: Safe change (should pass)
console.log('=== TEST 1: Safe Change ===');
const originalCode = `
function testFunction() {
    return 'hello world';
}

function anotherFunction() {
    return 'goodbye';
}
`;

const safeChange = `
function testFunction() {
    return 'hello world updated';
}

function anotherFunction() {
    return 'goodbye';
}

function newFunction() {
    return 'new feature';
}
`;

const safeValidation = learningSystem.validateProposedChange(originalCode, safeChange, 'test.js');
console.log('Safe change validation:', safeValidation.approved ? '✅ APPROVED' : '❌ REJECTED');

// Test 2: Destructive change (should reject)
console.log('\n=== TEST 2: Destructive Change ===');
const destructiveChange = `
// TODO: Implement functions here
`;

const destructiveValidation = learningSystem.validateProposedChange(originalCode, destructiveChange, 'test.js');
console.log('Destructive change validation:', destructiveValidation.approved ? '✅ APPROVED' : '❌ REJECTED');
if (!destructiveValidation.approved) {
    console.log('Rejection reasons:');
    destructiveValidation.reasons.forEach(reason => console.log(`  - ${reason}`));
}

// Test 3: Major function deletion (should reject)
console.log('\n=== TEST 3: Function Deletion ===');
const functionDeletion = `
function testFunction() {
    return 'hello world';
}
// Deleted anotherFunction
`;

const deletionValidation = learningSystem.validateProposedChange(originalCode, functionDeletion, 'test.js');
console.log('Function deletion validation:', deletionValidation.approved ? '✅ APPROVED' : '❌ REJECTED');

// Generate learning report
console.log('\n=== LEARNING REPORT ===');
const report = learningSystem.generateLearningReport();
console.log(`Total mistakes recorded: ${report.totalMistakes}`);
console.log(`Prevention rules active: ${report.preventionRules.length}`);
console.log('Prevention rules:');
report.preventionRules.forEach((rule, index) => {
    console.log(`  ${index + 1}. ${rule}`);
});

console.log('\n✅ Learning system test completed');
