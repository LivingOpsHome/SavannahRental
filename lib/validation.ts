import {z} from 'zod';
export const authSchema=z.object({email:z.email().max(254).transform(v=>v.trim().toLowerCase()),password:z.string().min(1).max(128),confirmPassword:z.string().max(128).optional(),name:z.string().trim().min(1).max(100).optional()});
const text=z.string().trim().max(250);const number=z.coerce.number().min(0).max(100);
const base={email:z.email().max(254),phone:text.optional(),address:text.optional(),message:z.string().trim().max(5000),language:z.enum(['en','zh']),consent:z.literal('on'),website:z.string().max(0).optional()};
export const leadSchema=z.discriminatedUnion('kind',[z.object({...base,kind:z.literal('contact'),name:text.min(1),message:z.string().trim().min(1).max(5000)}),z.object({...base,kind:z.literal('evaluation'),firstName:text.min(1),lastName:text.min(1),phone:text.min(5),address:text.min(3),city:text.min(1),state:text.min(1),zip:text.min(3),bedrooms:number.int(),bathrooms:number,status:z.enum(['rented','vacant','owner-occupied','renovation','purchasing']),interest:z.enum(['cash-flow','co-living','long-term','full-service','investment','unsure']),rent:z.union([z.literal(''),z.coerce.number().min(0).max(1000000)]).optional()})]);
export const propertySchema=z.object({owner_id:z.uuid(),title:text.min(1),address:text.min(1),strategy:z.enum(['long-term','co-living']),status:z.enum(['review','preparing','active','vacant']),bedrooms:z.coerce.number().int().min(0).max(100),contract_status:z.enum(['unsigned','signed']).default('unsigned'),notes:z.string().max(5000).default('')});

export const memberPropertySchema=z.object({title:text.min(1),address:text.min(1)}).strict();
export const contractStatusSchema=z.object({property_id:z.uuid(),contract_status:z.enum(['unsigned','signed'])}).strict();
