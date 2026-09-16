import Site from '@/components/site';
import {cookies} from 'next/headers';
import {getUser} from '@/lib/store';
export default async function Page({searchParams}:{searchParams:Promise<{lang?:string}>}){const {lang}=await searchParams;const user=await getUser((await cookies()).get('sr-session')?.value);return <Site signedIn={!!user} path="/" initialLang={lang==='zh'?'zh':lang==='en'?'en':undefined}/>}
