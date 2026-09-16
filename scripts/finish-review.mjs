import fs from 'node:fs/promises';import sharp from 'sharp';
const db=JSON.parse(await fs.readFile('.data/store.json','utf8'));const testEmail='browser-test-1789538581802@example.test';const ids=db.users.filter(u=>u.email===testEmail).map(u=>u.id);db.users=db.users.filter(u=>!ids.includes(u.id));db.sessions=db.sessions.filter(s=>!ids.includes(s.user_id));db.leads=db.leads.filter(l=>l.email!==testEmail);await fs.writeFile('.data/store.json',JSON.stringify(db,null,2));
for(const name of ['desktop','chinese','mobile-chinese'])await sharp('.data/'+name+'-final.png').resize({width:name==='mobile-chinese'?390:1100}).jpeg({quality:65}).toFile('.data/'+name+'-review.jpg');
console.log('Removed only the interrupted test account and its test inquiries.');
