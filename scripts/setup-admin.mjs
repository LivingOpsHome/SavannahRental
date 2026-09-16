import fs from 'node:fs/promises';
import {randomUUID,randomBytes,scryptSync} from 'node:crypto';
import {createInterface} from 'node:readline/promises';
const email='agentkelly2024@gmail.com';
await fs.mkdir('.data',{recursive:true});
let db;try{db=JSON.parse(await fs.readFile('.data/store.json','utf8'))}catch(e){if(e.code!=='ENOENT')throw e;db={users:[],sessions:[],properties:[],documents:[],leads:[]}}
if(db.users.some(u=>u.email===email)){console.log('Admin account already exists. No changes made.');process.exit(0)}
let password=process.env.ADMIN_INITIAL_PASSWORD;let generated=false;
if(!password){password=randomBytes(20).toString('base64url');generated=true}
if(password.length<12)throw Error('Administrator password must have at least 12 characters');
const salt=randomBytes(16).toString('hex');
db.users.push({id:randomUUID(),email,name:'Kelly',role:'admin',password:salt+':'+scryptSync(password,salt,64).toString('hex')});
await fs.writeFile('.data/store.json',JSON.stringify(db,null,2),{mode:0o600});
if(generated){await fs.writeFile('.data/LOCAL-ADMIN-LOGIN.txt','LOCAL PREVIEW ONLY\nEmail: '+email+'\nPassword: '+password+'\nKeep this file private. Do not reuse this password for a live deployment.\n',{mode:0o600});console.log('Local administrator created. Login details are in .data/LOCAL-ADMIN-LOGIN.txt (gitignored).')}else console.log('Local administrator created with the provided password.');
