// Run with: node tests/multiplication.test.cjs
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'../multiplication.html'),'utf8');
const js=html.match(/<script>([\s\S]*?)<\/script>/)[1];new vm.Script(js);
const shuffle=js.slice(js.indexOf('const shuffle='),js.indexOf('const girl='));
const core=js.slice(js.indexOf('function buildQuestions'),js.indexOf('function renderQuestion'));
const context=vm.createContext({console});vm.runInContext(shuffle+core,context);
// Every possible non-empty selection; selected factors and unique choices stay valid.
for(let mask=1;mask<512;mask++){
 const tables=Array.from({length:9},(_,i)=>i+1).filter(n=>mask&(1<<(n-1)));context.tables=tables;
 const qs=vm.runInContext('buildQuestions(tables)',context);
 assert.equal(qs.length,12);assert.equal(new Set(qs.map(q=>q.type)).size,4);
 const counts=tables.map(a=>qs.filter(q=>q.a===a).length);assert(Math.max(...counts)-Math.min(...counts)<=1);
 for(const q of qs){assert(tables.includes(q.a));assert(q.b>=1&&q.b<=9);context.q=q;const answer=vm.runInContext('correct(q)',context),options=vm.runInContext('answerOptions(q)',context);assert.equal(answer,q.type==='missing'?q.b:q.a*q.b);assert.equal(options.length,4);assert.equal(new Set(options).size,4);assert.equal(options.filter(n=>n===answer).length,1);assert(options.every(n=>Number.isInteger(n)&&n>=1&&n<=(q.type==='missing'?9:81)));}
 for(const a of tables){const firstNine=qs.filter(q=>q.a===a).slice(0,9);assert.equal(new Set(firstNine.map(q=>q.b)).size,firstNine.length);}
}
console.log('Passed all 511 table selections: balanced coverage, valid facts, four question types, unique correct choices, no repeats before table exhaustion.');
