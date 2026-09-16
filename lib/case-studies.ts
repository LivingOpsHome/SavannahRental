export const caseStudies = [
  {
    id: 'pooler', city: {en:'Pooler · Savannah area',zh:'Pooler · 萨凡纳地区'}, zip:'31322',
    rent: {amount:2700,kind:'actual'},
    dues:4386.30,payout:3894.77,
    months:[{month:'2026-06',dues:0,payout:0},{month:'2026-07',dues:2903.82,payout:1789.22},{month:'2026-08',dues:4386.30,payout:3894.77}],
    ytd:{dues:7290.12,payout:5683.99},
    method:{en:'SavannahRental confirms actual whole-home rent of $2,700 per month for this property. This is the supplied rental baseline for the comparison.',zh:'SavannahRental 确认，该房产整套长租实际租金为每月 $2,700，本案例以此作为对比基准。'},
    sources:{en:'SavannahRental · actual rent supplied by owner',zh:'SavannahRental · 业主提供的实际租金'},
  },
  {
    id:'atlanta',city:{en:'Buckhead · Atlanta',zh:'Buchhead · 亚特兰大'},zip:'30342',
    rent:{amount:3200,kind:'listed'},
    dues:6720.11,payout:6000.09,
    months:[{month:'2026-06',dues:1985.34,payout:1385.69},{month:'2026-07',dues:4116.73,payout:3072.39},{month:'2026-08',dues:6720.11,payout:6000.09}],
    ytd:{dues:12950.90,payout:10642.17},
    method:{en:'SavannahRental confirms the whole-home listing rent was $3,200 per month. This is a listed asking rent, not a confirmed achieved lease rent or an automated estimate.',zh:'SavannahRental 确认，该房产整套长租挂牌租金为每月 $3,200。这是挂牌报价，不代表已确认的实际成交租金，也不是自动估值。'},
    sources:{en:'SavannahRental · listing rent confirmed by owner',zh:'SavannahRental · 业主确认的挂牌租金'},
  },
] as const;

