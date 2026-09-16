import Site from '@/components/site';
import {notFound,redirect} from 'next/navigation';
import {cookies} from 'next/headers';
import {getUser} from '@/lib/store';
const routes=['long-term','co-living','co-living/case-study','co-living/how-it-works','co-living/evaluate','about','contact','register','login','portal','portal/properties','portal/documents','admin'];
export async function generateMetadata({params}:{params:Promise<{slug:string[]}>}){const {slug}=await params; return {title:slug[slug.length-1].replaceAll('-',' '),robots:{index:!['portal','admin','login','register'].includes(slug[0]),follow:true}}}
export default async function Page({params,searchParams}:{params:Promise<{slug:string[]}>,searchParams:Promise<{lang?:string}>}){const {slug}=await params; const {lang}=await searchParams;const path=slug.join('/');const user=await getUser((await cookies()).get('sr-session')?.value);if((path==='admin'||path.startsWith('portal'))&&!user)redirect('/login?'+new URLSearchParams({lang:lang==='zh'?'zh':'en',next:'/'+path}).toString());if(path==='admin'&&user?.role!=='admin')redirect('/portal'+(lang==='zh'?'?lang=zh':''));if(['co-living/evaluate','co-living/case-study','co-living/how-it-works'].includes(path)){if(!user){const destination='/'+path+(lang==='zh'?'?lang=zh':'');redirect('/login?'+new URLSearchParams({lang:lang==='zh'?'zh':'en',next:destination}).toString())}} if(!routes.includes(path)&&!/^portal\/properties\/[^/]+$/.test(path))notFound(); return <Site signedIn={!!user} path={'/'+path} initialLang={lang==='zh'?'zh':lang==='en'?'en':undefined}/>}

