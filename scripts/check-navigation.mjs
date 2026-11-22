import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const source = await readFile('public/app.js','utf8');
const functionSource = source.slice(source.indexOf('async function renderAtPosition('),source.indexOf('let processObserver;'));
assert.ok(functionSource.startsWith('async function renderAtPosition('));
function scenario({hash='',reduced=false,fontsReady=Promise.resolve()}={}) {
  const calls=[];
  const context=vm.createContext({
    renderVersion:0,
    location:{hash},
    matchMedia:()=>({matches:reduced}),
    document:{fonts:{ready:fontsReady},getElementById:id=>({scrollIntoView:options=>calls.push({anchor:id,...options})})},
    window:{scrollTo:options=>calls.push(options)}
  });
  vm.runInContext('function render(){renderVersion++; return Promise.resolve();}\n'+functionSource,context);
  return {context,calls,run:(...args)=>context.renderAtPosition(...args)};
}
const initial=scenario();
await initial.run(null,'instant',{initial:true});
assert.equal(initial.calls.length,0,'Startup must not reset an early user scroll');
const back=scenario();
await back.run({damviScroll:{x:0,y:1450}});
assert.deepEqual(JSON.parse(JSON.stringify(back.calls)),[{left:0,top:1450,behavior:'instant'}],'Back must restore the exact position');
const anchor=scenario({hash:'#contact-form'});
await anchor.run(null,'smooth');
assert.equal(anchor.calls[0].anchor,'contact-form');
assert.equal(anchor.calls[0].behavior,'smooth');
const reduced=scenario({hash:'#contact-form',reduced:true});
await reduced.run(null,'smooth');
assert.equal(reduced.calls[0].behavior,'instant','Respect reduced motion');
let finishFonts;
const late=scenario({hash:'#services',fontsReady:new Promise(resolve=>finishFonts=resolve)});
const pending=late.run(null,'smooth');
await Promise.resolve();
late.context.renderVersion++;
finishFonts();
await pending;
assert.equal(late.calls.length,0,'A stale navigation must not scroll the next page');
console.log('Navigation checks passed: no startup reset, exact back position, native anchor scrolling, reduced motion and stale navigation cancellation.');
