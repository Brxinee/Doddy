import fs from 'fs';import path from 'path';import matter from 'gray-matter';import readingTime from 'reading-time';
const dir=path.join(process.cwd(),'content/posts');
export const CATEGORIES=['Sweat & Smell','Grooming','Hygiene','Style','Confidence','Gym & Fitness'];
export const catSlug=(c:string)=>c.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
export type Post={slug:string;title:string;date:string;category:string;excerpt:string;author:string;content:string;readingTime:string};
export function getAllPosts():Post[]{return fs.readdirSync(dir).filter(f=>f.endsWith('.mdx')).map(f=>{const slug=f.replace(/\.mdx$/,'');const src=fs.readFileSync(path.join(dir,f),'utf8');const{data,content}=matter(src);return{slug,content,readingTime:readingTime(content).text,...(data as any)} as Post;}).sort((a,b)=>(a.date<b.date?1:-1));}
export function getPost(slug:string){return getAllPosts().find(p=>p.slug===slug);}
export function relatedPosts(p:Post,n=3){return getAllPosts().filter(x=>x.category===p.category&&x.slug!==p.slug).slice(0,n);}