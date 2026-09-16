import {NextRequest,NextResponse} from 'next/server';
import {getUser,listSharedResources,local,scoped} from '@/lib/store';
import {promises as fs} from 'node:fs';
import path from 'node:path';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export async function GET(req:NextRequest,{params}:{params:Promise<{id:string}>}){
 // Validate the session before looking up or reading any member document.
 const token=req.cookies.get('sr-session')?.value;const user=await getUser(token);
 if(!user)return NextResponse.json({error:'Authentication required'},{status:401,headers:{'Cache-Control':'no-store'}});
 const {id}=await params;const resource=(await listSharedResources(token)).find(r=>r.id===id);
 if(!resource)return NextResponse.json({error:'Not found'},{status:404});
 if(!local){const {data,error}=await scoped(token).storage.from('member-resources').createSignedUrl(resource.file,60,{download:resource.filename});if(error)return NextResponse.json({error:'Not found'},{status:404});return NextResponse.redirect(data.signedUrl,{status:303,headers:{'Cache-Control':'private, no-store'}})}
 try{const bytes=await fs.readFile(path.join(process.cwd(),'.data','member-resources',resource.file));return new NextResponse(new Uint8Array(bytes),{headers:{'Content-Type':resource.mime,'Content-Disposition':"attachment; filename*=UTF-8''"+encodeURIComponent(resource.filename),'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'}})}catch{return NextResponse.json({error:'Resource unavailable'},{status:404})}
}
