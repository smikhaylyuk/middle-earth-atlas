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
  {
    id:'tharbad',name:'Tharbad',overviewLabel:'Tharbad',kind:'A crossing in ruins',pinSubtitle:'The Greyflood',subtitle:'Where the old North–South Road meets the river',
    description:'Once a river port and road crossing, Tharbad is abandoned by the end of the Third Age. Its bridge has fallen into ruin. The Greyflood separates Minhiriath from Enedwaith here, downstream of the marshes of Swanfleet.',
    date:null,region:'south',major:true,source:'https://tolkiengateway.net/wiki/Tharbad',sourceLabel:'Unfinished Tales · The West of Middle-earth',
  },
  {
    id:'ost-in-edhil',name:'Ost-in-Edhil',overviewLabel:'Ost-in-Edhil',kind:'The lost city of the Elven-smiths',pinSubtitle:'Eregion · Hollin',subtitle:'Ruins above the Glanduin',
    description:'The capital of Eregion stood west of Moria, near the Glanduin. Celebrimbor and the Elven-smiths lived here in the Second Age. Sauron destroyed the city long before the journey of the Fellowship; only ruins belong in this landscape.',
    date:null,region:'south',major:false,source:'https://tolkiengateway.net/wiki/Ost-in-Edhil',sourceLabel:'Unfinished Tales · The History of Galadriel and Celeborn',
  },
  {
    id:'moria-west-gate',name:'Moria',overviewLabel:'Moria',kind:'The western entrance to Khazad-dûm',pinSubtitle:'The Doors of Durin',subtitle:'A hidden gate beneath the mountains',
    description:'The Doors of Durin open in the western wall of the Misty Mountains, facing Eregion. The Sirannon once ran below them; a dark pool lies before the doors when the Fellowship arrives. Khazad-dûm extends beneath the mountains, rather than standing as a city on their slopes.',
    date:null,region:'south',major:true,source:'https://tolkiengateway.net/wiki/Doors_of_Durin',sourceLabel:'Book II, ch. 4 · A Journey in the Dark',
  },
  {
    id:'lond-daer',name:'Lond Daer',overviewLabel:'Lond Daer',kind:'An ancient harbour',pinSubtitle:'The mouth of the Gwathló',subtitle:'Where the Greyflood reaches the sea',
    description:'Númenórean mariners founded this harbour at the mouth of the Greyflood. Its great days belong to the Second Age. The coast shown here holds the remnants of that old haven, far south of Círdan’s Grey Havens and on a different river.',
    date:null,region:'south',major:false,source:'https://tolkiengateway.net/wiki/Lond_Daer',sourceLabel:'Unfinished Tales · The Port of Lond Daer',
  },
  {
    id:'isengard',name:'Isengard',overviewLabel:'Isengard',kind:'The stronghold of Saruman',pinSubtitle:'Orthanc',subtitle:'At the southern end of the Misty Mountains',
    description:'Isengard stands in Nan Curunír, near the Gap of Rohan. A great ring of stone encloses the black tower of Orthanc. Dunland lies to the west and Fangorn beyond the mountains to the east. This is Saruman’s stronghold before the Ents break its walls.',
    date:null,region:'south',major:true,source:'https://tolkiengateway.net/wiki/Isengard',sourceLabel:'Book III, ch. 8 · The Road to Isengard',
  },
  ...easternPlaces.map(p=>({...p,...eastNotes[p.id],overviewLabel:p.id==='weathertop'?'Amon Sûl':p.name,region:'east' as const,major:true})),
] as const;
export type PlaceId = typeof places[number]['id'];
export const majorPlaces = places.filter(p=>p.major);
