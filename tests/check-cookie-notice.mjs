import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
const source=await readFile('public/app.js','utf8');
const code=source.slice(source.indexOf('function setupCookieNotice()'),source.indexOf("history.scrollRestoration = 'manual'"));
const key='damvi-technical-notice-v1',now=1000;
function scenario(value=null,blocked=false){
 let node=null,writes=[];
 const document={querySelector:()=>node,body:{append(el){node=el;}},createElement(){const el={setAttribute(){},remove(){node=null;},querySelector(){return {addEventListener(type,fn){el.click=fn;}};}};return el;}};
 const context=vm.createContext({document,Date:{now:()=>now},Number,JSON,withBasePath:x=>x,localStorage:{getItem(k){assert.equal(k,key);if(blocked)throw Error('Disabled');return value;},setItem(k,v){if(blocked)throw Error('Disabled');writes.push([k,v]);value=v;}},fetch(){throw Error('Notice must not transmit data');}});
 vm.runInContext(code,context);context.setupCookieNotice();
 return {context,writes,get node(){return node;},get value(){return value;}};
}
const first=scenario();assert.ok(first.node);assert.equal(first.writes.length,0,'Storage was written before OK');assert.ok(first.node.innerHTML.includes('href="/privacy"'));first.context.setupCookieNotice();assert.equal(first.writes.length,0);first.node.click();assert.equal(first.node,null);assert.equal(first.writes.length,1);assert.deepEqual(JSON.parse(first.value),{version:1,expiresAt:now+180*24*60*60*1000});
assert.equal(scenario(first.value).node,null,'Valid choice must suppress the notice');
for(const value of ['bad JSON',JSON.stringify({version:1,expiresAt:now-1}),JSON.stringify({version:2,expiresAt:now+10000})]){const s=scenario(value);assert.ok(s.node);assert.equal(s.writes.length,0);}
const denied=scenario(null,true);assert.ok(denied.node);denied.node.click();assert.equal(denied.node,null);assert.equal(denied.writes.length,0);
console.log('Cookie notice passed: no writes before OK, minimal 180-day local record, remembered dismissal, expired/corrupt state and disabled storage. No network calls.');
