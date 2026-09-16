'use client';
import Link from 'next/link';
import {createContext,useContext} from 'react';
import type {ComponentProps} from 'react';
export const MembershipContext=createContext(false);
export default function MemberLink({href,...props}:ComponentProps<typeof Link>){
 const signedIn=useContext(MembershipContext);
 const target=typeof href==='string'?href:'';
 if(!signedIn&&target.startsWith('/')&&!target.startsWith('//')){
  const url=new URL(target,'http://local');
  const lang=url.searchParams.get('lang')==='zh'?'zh':'en';
  return <Link {...props} href={'/login?'+new URLSearchParams({lang,next:target}).toString()}/>;
 }
 return <Link {...props} href={href}/>;
}
