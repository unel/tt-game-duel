const TEMPLATE = 'XXXX-XXXX-XXXX-XXXX';


export function randomChoice(items: unknown[]): unknown {
    const idx = Math.round(Math.random() * (items.length - 1));
    
    return items[idx];
}

const ELEMENTS = [0,1,2,3,4,5,6,7,8,9,'A','B','C','D','E','F','G']
export function genRandomId(prefix = ''): string {
    return `${prefix}${TEMPLATE.replace(/X/g, () => String(randomChoice(ELEMENTS)))}`
}