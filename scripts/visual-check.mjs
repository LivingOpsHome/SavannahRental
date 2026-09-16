import {chromium} from 'playwright';
const browser=await chromium.launch({channel:'msedge',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1050}});
await page.goto('http://127.0.0.1:3000');await page.screenshot({path:'desktop-preview.png',fullPage:true});
console.log({title:await page.title(),images:await page.locator('img').evaluateAll(els=>els.map(e=>({src:e.src,width:e.naturalWidth}))),overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)});
await page.setViewportSize({width:390,height:844});await page.screenshot({path:'mobile-preview.png',fullPage:true});console.log({mobileOverflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)});
await browser.close();
