import type { Metadata } from 'next';
import '@fontsource/manrope/600.css';
import '@fontsource/manrope/700.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/600.css';
import './globals.css';
export const metadata: Metadata = { title: {default:'SavannahRental | Better Property Performance',template:'%s | SavannahRental'}, description:'Smarter rental strategies and hands-on property management in the Savannah area. Explore long-term rental and professionally operated co-living. 萨凡纳长租与中租·共居物业管理。',robots:{index:true,follow:true} };
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning><body>{children}</body></html> }


