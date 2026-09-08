import { places as easternPlaces } from './terrain';

const eastNotes = {
  bree: {pinSubtitle:'The crossroads',source:'https://tolkiengateway.net/wiki/At_the_Sign_of_the_Prancing_Pony',sourceLabel:'Book I, ch. 9 · Appendix B'},
  weathertop: {pinSubtitle:'Amon Sûl',source:'https://tolkiengateway.net/wiki/A_Knife_in_the_Dark',sourceLabel:'Book I, ch. 11 · Appendix B'},
  rivendell: {pinSubtitle:'Imladris',source:'https://tolkiengateway.net/wiki/Third_Age_3018',sourceLabel:'Book I, ch. 12 · Book II, ch. 1 · Appendix B'},
};

export const places = [
  {
    id:'grey-havens',name:'Grey Havens',overviewLabel:'Havens',kind:'The harbours of Círdan',pinSubtitle:'Mithlond',subtitle:'At the head of the Gulf of Lune',
    description:'The Grey Havens occupy both shores at the inner end of the Gulf of Lune, near the mouth of the Lhûn. Círdan keeps these Elven harbours in Lindon, west of the Shire.',
    date:null,region:'west',major:true,source:'https://tolkiengateway.net/wiki/Grey_Havens',sourceLabel:'The West of Middle-earth · Reference notes',
  },
  {
    id:'hobbiton',name:'Hobbiton',overviewLabel:'Hobbiton',kind:'The heart of the Westfarthing',pinSubtitle:'The Shire',subtitle:'The village beneath the Hill',
    description:'Hobbiton lies beside the Water in the Shire. Bag End overlooks the village from the Hill; a lane leads through nearby Bywater to the East Road farther south.',
    date:null,region:'west',major:true,source:'https://tolkiengateway.net/wiki/Hobbiton',sourceLabel:'A Part of the Shire · Reference notes',
  },
  {
    id:'michel-delving',name:'Michel Delving',overviewLabel:'Michel Delving',kind:'The chief town of the Shire',pinSubtitle:'The White Downs',subtitle:'Among the hills of the Westfarthing',
    description:'Michel Delving stands in the White Downs. The town is the seat of the Shire’s Mayor and home to the Mathom-house, where Hobbits keep curious things they have no immediate use for.',
    date:null,region:'west',major:false,source:'https://tolkiengateway.net/wiki/Michel_Delving',sourceLabel:'Prologue · Reference notes',
  },
  {
    id:'brandywine-bridge',name:'Brandywine Bridge',overviewLabel:'Brandywine Bridge',kind:'The Bridge of Stonebows',pinSubtitle:'The eastern border',subtitle:'Where the East Road crosses the Baranduin',
    description:'This old stone bridge carries the East Road over the Brandywine. Buckland and the Old Forest lie farther south on the eastern bank. Frodo’s party leaves the Shire by the ferry rather than this bridge in 3018.',
    date:null,region:'west',major:false,source:'https://tolkiengateway.net/wiki/Brandywine_Bridge',sourceLabel:'Book I, ch. 5 · Prologue · Reference notes',
  },
  ...easternPlaces.map(p=>({...p,...eastNotes[p.id],overviewLabel:p.id==='weathertop'?'Amon Sûl':p.name,region:'east' as const,major:true})),
] as const;
export type PlaceId = typeof places[number]['id'];
export const majorPlaces = places.filter(p=>p.major);
