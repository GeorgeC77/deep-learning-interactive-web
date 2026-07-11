#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

/* -------------------------------------------------------------------------- */
/* 期望绑定映射                                                                */
/* -------------------------------------------------------------------------- */
const EXPECTED = {
  'AttentionLab': {
    imports: ['multiHeadAttention', 'softmax', 'matMul', 'divisors', 'sinusoidalPE'],
    calls: ['multiHeadAttention'],
    renders: ['attentionResult.concat', 'attentionResult.finalOutput'],
  },
  'BackpropagationLab': {
    imports: ['forwardPass', 'backwardPass', 'centralDiff', 'NodeSpec'],
    calls: ['forwardPass', 'backwardPass', 'centralDiff'],
    renders: ['fwdVals', 'bwdResult.grads'],
  },
  'EMELBOLab': {
    imports: ['eStep', 'mStep', 'logLikelihood', 'gaussianPdf', 'eigen2x2', 'GMMParams'],
    calls: ['eStep(', 'mStep(', 'logLikelihood(', 'eigen2x2('],
    renders: ['responsibilities', 'ellipsePts'],
  },
  'DiffusionTimelineLab': {
    imports: ['makeBetaSchedule', 'alphaBar', 'generateGaussianNoise', 'forwardClosed', 'boxMuller'],
    calls: ['forwardClosed('],
    renders: ['zt', 'x0Pred'],
  },
  'OptimizationLandscapeLab': {
    imports: ['loss', 'analyticalGrad', 'stationaryPoint', 'hessianEigen', 'step', 'type Optimizer'],
    calls: ['loss(', 'analyticalGrad(', 'stationaryPoint(', 'step('],
    renders: ['contours', 'results'],
  },
};

const BANNED_INTERNAL = {
  'AttentionLab': ['function softmax', 'function matMul', 'function multiHead'],
  'BackpropagationLab': ['function forwardPass', 'function backwardPass'],
  'EMELBOLab': ['function eStep', 'function mStep', 'function emIteration'],
  'DiffusionTimelineLab': ['function makeBetaSchedule', 'function alphaBar', 'function forwardClosed'],
  'OptimizationLandscapeLab': ['function loss(', 'function grad(', 'function step('],
};

/* -------------------------------------------------------------------------- */
/* 检查单文件                                                                  */
/* -------------------------------------------------------------------------- */
function checkFile(demoName, demoPath) {
  const content = fs.readFileSync(demoPath, 'utf8');
  const expected = EXPECTED[demoName];
  const banned = BANNED_INTERNAL[demoName];
  const results = [];

  // Check imports
  const importLine = content.split('\n').find((l) => l.includes("from '@/lib/math/"));
  if (!importLine) {
    results.push(`❌ ${demoName}: NO import from @/lib/math/`);
    return results;
  }

  for (const imp of expected.imports) {
    if (!importLine.includes(imp)) {
      results.push(`❌ ${demoName}: missing import ${imp}`);
    }
  }

  // Check function calls in JSX/computation
  for (const call of expected.calls) {
    if (!content.includes(call)) {
      results.push(`❌ ${demoName}: function ${call} not called`);
    }
  }

  // Check renders
  for (const render of expected.renders) {
    if (!content.includes(render)) {
      results.push(`❌ ${demoName}: ${render} not rendered in JSX`);
    }
  }

  // Check banned internal definitions
  for (const ban of banned) {
    if (content.includes(ban)) {
      results.push(`❌ ${demoName}: internal redefinition detected: ${ban}`);
    }
  }

  if (results.length === 0) results.push(`✅ ${demoName}: all checks passed`);
  return results;
}

/* -------------------------------------------------------------------------- */
/* 主程序                                                                      */
/* -------------------------------------------------------------------------- */
const base = path.resolve(__dirname, '..');
const demos = [
  ['AttentionLab', 'src/components/demos/AttentionLab.tsx'],
  ['BackpropagationLab', 'src/components/demos/BackpropagationLab.tsx'],
  ['EMELBOLab', 'src/components/demos/EMELBOLab.tsx'],
  ['DiffusionTimelineLab', 'src/components/demos/DiffusionTimelineLab.tsx'],
  ['OptimizationLandscapeLab', 'src/components/demos/OptimizationLandscapeLab.tsx'],
];

let allPassed = true;
for (const [name, relPath] of demos) {
  const fullPath = path.join(base, relPath);
  const results = checkFile(name, fullPath);
  for (const r of results) {
    console.log(r);
    if (r.startsWith('❌')) allPassed = false;
  }
}

// Generate report
const report = allPassed
  ? '✅ All 5 flagship demos correctly import and use math library functions.'
  : '❌ Some demos fail the math-binding audit.';

console.log(`\n${report}`);
process.exit(allPassed ? 0 : 1);
