export const site = {
 name: 'Rabata', email: 'rabataofficial111@gmail.com',
 instagram: 'https://www.instagram.com/rabata._.official/',
 founderInstagram: 'https://www.instagram.com/rathore._.tammana/',
}
export function pageHead(title: string, description: string) {
 return { meta: [{ title: `${title} | Rabata` }, { name: 'description', content: description }, { property: 'og:title', content: `${title} | Rabata` }, { property: 'og:description', content: description }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] }
}
