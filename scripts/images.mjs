import fs from 'node:fs/promises';
import sharp from 'sharp';
for(const name of ['home','room','shared']){await sharp('public/images/'+name+'.jpg').rotate().resize({width:1600,withoutEnlargement:true}).webp({quality:84}).toFile('public/images/'+name+'.webp');await fs.unlink('public/images/'+name+'.jpg');}
