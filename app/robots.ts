import {MetadataRoute} from 'next';
const SITE=process.env.NEXT_PUBLIC_SITE_URL||'https://doddy.in';
export default function r():MetadataRoute.Robots{return{rules:{userAgent:'*',allow:'/'},sitemap:`${SITE}/sitemap.xml`};}