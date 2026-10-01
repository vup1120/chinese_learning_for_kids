// Run with: node tests/multiplication.test.cjs
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'../multiplication.html'),'utf8');
const js=html.match(/<script>([\s\S]*?)<\/script>/)[1];new vm.Script(js);
const shuffle=js.slice(js.indexOf('const shuffle='),js.indexOf('const girl='));
const core=js.slice(js.indexOf('function buildQuestions'),js.indexOf('function actors'));
const c=vm.createContext({});vm.runInContext(shuffle+core,c);
for(let mask=1;mask<512;mask++){
 c.tables=Array.from({length:9},(_,i)=>i+1).filter(n=>mask&(1<<(n-1)));
 const qs=vm.runInContext('buildQuestions(tables)',c);assert.equal(qs.length,10);
 const counts=c.tables.map(a=>qs.filter(q=>q.a===a).length);assert(Math.max(...counts)-Math.min(...counts)<=1);
 for(const q of qs){assert(c.tables.includes(q.a));assert(q.b>=1&&q.b<=9);c.q=q;const opts=vm.runInContext('answerOptions(q)',c);assert.equal(opts.length,3);assert.equal(new Set(opts).size,3);assert(opts.includes(q.a*q.b));assert(opts.every(n=>n>=1&&n<=81));}
 for(const a of c.tables){const facts=qs.filter(q=>q.a===a).slice(0,9);assert.equal(new Set(facts.map(q=>q.b)).size,facts.length);}
}
console.log('Passed all 511 table combinations: balanced 10-question rounds, valid facts, three unique houses, one correct answer.');
