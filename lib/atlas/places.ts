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
  {
    id:'gladden-fields',name:'Gladden Fields',overviewLabel:'Gladden Fields',kind:'Marshes of the Great River',pinSubtitle:'The Gladden & Anduin',subtitle:'Where the mountain river meets the Anduin',
    description:'The Gladden Fields spread around the meeting of the Gladden and the Anduin, north of Lórien. Isildur was ambushed here early in the Third Age. Centuries later, Déagol found the One Ring in the river nearby.',
    date:null,region:'anduin',major:true,source:'https://tolkiengateway.net/wiki/Gladden_Fields',sourceLabel:'Unfinished Tales · The Disaster of the Gladden Fields',
  },
  {
    id:'dimrill-dale',name:'Dimrill Dale',overviewLabel:'Dimrill Dale',kind:'The eastern threshold of Moria',pinSubtitle:'Azanulbizar',subtitle:'Below the three peaks of Khazad-dûm',
    description:'Dimrill Dale lies outside Moria’s eastern gate. Mirrormere rests in the valley beneath the mountains, and the Silverlode runs southeast toward Lórien. The Fellowship emerges here after passing beneath the mountain range.',
    date:null,region:'anduin',major:true,source:'https://tolkiengateway.net/wiki/Dimrill_Dale',sourceLabel:'Book II, ch. 6 · Lothlórien',
  },
  {
    id:'cerin-amroth',name:'Cerin Amroth',overviewLabel:'Cerin Amroth',kind:'A hill in the Golden Wood',pinSubtitle:'Lórien',subtitle:'Among white trunks and golden boughs',
    description:'Cerin Amroth stands north of Caras Galadhon. A grassy mound and two rings of trees surround the great tree where Amroth once dwelt. Aragorn and Arwen pledged their love on this hill.',
    date:null,region:'anduin',major:false,source:'https://tolkiengateway.net/wiki/Cerin_Amroth',sourceLabel:'Book II, ch. 6 · Appendix A',
  },
  {
    id:'caras-galadhon',name:'Caras Galadhon',overviewLabel:'Lórien',kind:'The city of the Galadhrim',pinSubtitle:'The Golden Wood',subtitle:'High among the mallorn trees',
    description:'Caras Galadhon stands in Lórien, west of the Anduin and north of the Silverlode. Its dwellings rise among the mallorn boughs on a hill enclosed by a wall and a deep ditch. Here Celeborn and Galadriel receive the Fellowship.',
    date:null,region:'anduin',major:true,source:'https://tolkiengateway.net/wiki/Caras_Galadhon',sourceLabel:'Book II, ch. 7 · The Mirror of Galadriel',
  },
  {
    id:'dol-guldur',name:'Dol Guldur',overviewLabel:'Dol Guldur',kind:'The Hill of Sorcery',pinSubtitle:'Southern Mirkwood',subtitle:'A shadow across the Great River',
    description:'Dol Guldur rises in southwestern Mirkwood, east of the Anduin. Sauron once hid here as the Necromancer. By the War of the Ring, his servants again hold the stronghold, threatening Lórien across the river.',
    date:null,region:'anduin',major:true,source:'https://tolkiengateway.net/wiki/Dol_Guldur',sourceLabel:'Appendix B · The Third Age',
  },
  {
    id:'fords-of-isen',name:'Fords of Isen',overviewLabel:'Fords of Isen',kind:'The western entrance to Rohan',pinSubtitle:'The Gap of Rohan',subtitle:'Two shallow crossings around a stony island',
    description:'South of Isengard, the Isen spreads into two shallow arms around an island. The road crosses here, just before the river turns west toward the sea. The open Gap of Rohan lies between the southern Misty Mountains and the northern arm of the White Mountains.',
    date:null,region:'rohan',major:true,source:'https://tolkiengateway.net/wiki/Fords_of_Isen',sourceLabel:'Unfinished Tales · The Battles of the Fords of Isen',
  },
  {
    id:'helms-deep',name:'Helm’s Deep',overviewLabel:'Helm’s Deep',kind:'A stronghold of the Westfold',pinSubtitle:'The Hornburg',subtitle:'A guarded gorge beneath the Thrihyrne',
    description:'Helm’s Deep cuts into the northern White Mountains, southeast of the Fords of Isen. The Deeping-stream passes through the Deeping Wall and around the foot of the Hornburg. Its known course is shown within the gorge; its eventual confluence is not established in the published maps.',
    date:null,region:'rohan',major:true,source:'https://tolkiengateway.net/wiki/Helm%27s_Deep',sourceLabel:'Book III, ch. 7 · Helm’s Deep',
  },
  {
    id:'edoras',name:'Edoras',overviewLabel:'Edoras',kind:'The courts of the kings of Rohan',pinSubtitle:'The Golden Hall',subtitle:'A hill above the Snowbourn',
    description:'Edoras stands at the mouth of Harrowdale, with Meduseld, the Golden Hall, on its summit. The Snowbourn comes north from the mountains past the town, then turns east to the Entwash. Beyond the gates, the burial mounds of the kings lie beside the road.',
    date:null,region:'rohan',major:true,source:'https://tolkiengateway.net/wiki/Edoras',sourceLabel:'Book III, ch. 6 · The King of the Golden Hall',
  },
  {
    id:'dunharrow',name:'Dunharrow',overviewLabel:'Dunharrow',kind:'The refuge above Harrowdale',pinSubtitle:'The Firienfeld',subtitle:'An upland beneath the shadow of the mountains',
    description:'South of Edoras, a winding road climbs the eastern cliff of Harrowdale to the grassy Firienfeld. Standing stones lead toward the Dimholt and the Dark Door under the Dwimorberg. This high refuge is an ancient place, older than the kingdom of Rohan.',
    date:null,region:'rohan',major:false,source:'https://tolkiengateway.net/wiki/Dunharrow',sourceLabel:'Book V, ch. 3 · The Muster of Rohan',
  },
  {
    id:'argonath',name:'Argonath',overviewLabel:'Argonath',kind:'The Pillars of the Kings',pinSubtitle:'The Great River',subtitle:'At the northern entrance to Nen Hithoel',
    description:'The stone figures of Isildur and Anárion stand on opposite banks of the Anduin, facing north with their left hands raised. Below them, the river passes through a chasm into Nen Hithoel. The falls of Rauros lie beyond the lake’s southern end.',
    date:null,region:'rohan',major:true,source:'https://tolkiengateway.net/wiki/Argonath',sourceLabel:'Book II, ch. 9 · The Great River',
  },
  {
    id:'nen-hithoel',name:'Nen Hithoel',overviewLabel:'Nen Hithoel',kind:'The lake within the hills',pinSubtitle:'The Great River',subtitle:'Between the Argonath and Rauros',
    description:'South of the Argonath, the Anduin opens into the long lake of Nen Hithoel. Wooded slopes and bare grey hilltops enclose its shores. At its southern outlet, Tol Brandir stands between the western hill of Amon Hen and Amon Lhaw on the east.',
    date:null,region:'rauros',major:true,source:'https://tolkiengateway.net/wiki/Nen_Hithoel',sourceLabel:'Book II, ch. 9–10 · The Great River · The Breaking of the Fellowship',
  },
  {
    id:'amon-hen',name:'Amon Hen',overviewLabel:'Amon Hen',kind:'The Hill of Seeing',pinSubtitle:'The western shore',subtitle:'Above the green lawn of Parth Galen',
    description:'Amon Hen rises on the western side of Nen Hithoel’s southern end. An ancient stone seat stands on its summit. Across the water is Amon Lhaw, the Hill of Hearing; Tol Brandir stands between them in the river.',
    date:null,region:'rauros',major:false,source:'https://tolkiengateway.net/wiki/Amon_Hen',sourceLabel:'Book II, ch. 10 · The Breaking of the Fellowship',
  },
  {
    id:'parth-galen',name:'Parth Galen',overviewLabel:'Parth Galen',kind:'A green lawn beside the lake',pinSubtitle:'At the foot of Amon Hen',subtitle:'On the western shore above the falls',
    description:'Parth Galen is a grassy clearing at the foot of Amon Hen, beside the southern end of Nen Hithoel. Here the Fellowship camps before its breaking. Frodo and Sam leave this shore to cross toward the eastern Emyn Muil.',
    date:null,region:'rauros',major:false,source:'https://tolkiengateway.net/wiki/Parth_Galen',sourceLabel:'Book II, ch. 10 · The Breaking of the Fellowship',
  },
  {
    id:'tol-brandir',name:'Tol Brandir',overviewLabel:'Tol Brandir',kind:'The Tindrock',pinSubtitle:'The island above Rauros',subtitle:'A steep rock between the river’s arms',
    description:'Tol Brandir rises from the southern end of Nen Hithoel, between Amon Hen and Amon Lhaw. Its steep sides descend directly into the water. It is an uninhabited island, with no bridge or landing linking it to either shore.',
    date:null,region:'rauros',major:false,source:'https://tolkiengateway.net/wiki/Tol_Brandir',sourceLabel:'Book II, ch. 10 · The Breaking of the Fellowship',
  },
  {
    id:'rauros',name:'Rauros',overviewLabel:'Rauros',kind:'The roaring falls',pinSubtitle:'The southern edge of Emyn Muil',subtitle:'Where the Anduin leaves the lake',
    description:'Below Nen Hithoel, the Anduin plunges over Rauros into the lower country beside Nindalf. A portage known as the North Stair bypasses the falls on the western side. The Entwash joins the Great River farther downstream, below the lake and falls.',
    date:null,region:'rauros',major:true,source:'https://tolkiengateway.net/wiki/Rauros',sourceLabel:'Book III, ch. 1 · The Departure of Boromir · Published map',
  },
  {
    id:'nindalf',name:'Nindalf',overviewLabel:'Nindalf',kind:'The Wetwang',pinSubtitle:'Below the Emyn Muil',subtitle:'Marshland east of the Anduin',
    description:'Nindalf is the broad wetland east of the Anduin below Rauros. Across the river, the Entwash spreads into several mouths before meeting the Great River. The Dead Marshes lie farther northeast, beyond the eastern Emyn Muil.',
    date:null,region:'rauros',major:true,source:'https://tolkiengateway.net/wiki/Nindalf',sourceLabel:'The Return of the King · Map of Rohan, Gondor, and Mordor',
  },
  {
    id:'emyn-muil',name:'Emyn Muil',overviewLabel:'Emyn Muil',kind:'The eastern crags',pinSubtitle:'A maze of grey ridges',subtitle:'Above the lowlands east of the Great River',
    description:'The Emyn Muil enclose Nen Hithoel and extend east of the Anduin. Their eastern ridges end in a steep descent toward the lower country. Frodo and Sam struggle through these hills after leaving the Fellowship, before Gollum guides them toward the marshes.',
    date:null,region:'morannon',major:false,source:'https://tolkiengateway.net/wiki/Emyn_Muil',sourceLabel:'Book IV, ch. 1 · The Taming of Sméagol',
  },
  {
    id:'dead-marshes',name:'Dead Marshes',overviewLabel:'Dead Marshes',kind:'The haunted wetlands',pinSubtitle:'Pools beneath the mist',subtitle:'Between Emyn Muil and Dagorlad',
    description:'Southeast of Emyn Muil, reeds and treacherous pools cover the Dead Marshes. Over long years the wetlands have spread over ancient graves from the battle on Dagorlad. Frodo, Sam and Gollum cross here on their way toward the Black Gate; strange lights draw the eye after dark.',
    date:null,region:'morannon',major:true,source:'https://tolkiengateway.net/wiki/Dead_Marshes',sourceLabel:'Book IV, ch. 2 · The Passage of the Marshes',
  },
  {
    id:'dagorlad',name:'Dagorlad',overviewLabel:'Dagorlad',kind:'The Battle Plain',pinSubtitle:'Before the gates of Mordor',subtitle:'Dry country east of the marshes',
    description:'Dagorlad lies north of the Morannon, beyond the eastern edge of the Dead Marshes. Here the Last Alliance fought Sauron’s armies in the Second Age. By the time of the War of the Ring, this is a desolate approach to Mordor, rather than a settled land.',
    date:null,region:'morannon',major:false,source:'https://tolkiengateway.net/wiki/Dagorlad',sourceLabel:'The Return of the King · Published map · Appendix B',
  },
  {
    id:'black-gate',name:'Black Gate',overviewLabel:'Black Gate',kind:'The Morannon',pinSubtitle:'The gate of Mordor',subtitle:'Where the mountain ranges meet',
    description:'The Black Gate closes the northern mouth of Cirith Gorgor, between the Ephel Dúath and Ered Lithui. A stone rampart and iron doors guard the pass, watched by the Towers of the Teeth. Beyond the entrance lies Udûn. The gate is shown intact, before Sauron’s fall.',
    date:null,region:'morannon',major:true,source:'https://tolkiengateway.net/wiki/Black_Gate',sourceLabel:'Book IV, ch. 3 · The Black Gate is Closed',
  },
  {
    id:'udun',name:'Udûn',overviewLabel:'Udûn',kind:'The basin behind the Gate',pinSubtitle:'Within the mountain walls',subtitle:'The northern threshold of Mordor',
    description:'Udûn lies inside the northwestern corner of Mordor, enclosed where the Ephel Dúath and Ered Lithui meet. The Morannon guards its northern entrance; the Isenmouthe opens south toward the plateau of Gorgoroth. The fortress of Durthang overlooks the valley from the western mountains.',
    date:null,region:'mordor',major:true,source:'https://tolkiengateway.net/wiki/Ud%C3%BBn_(valley)',sourceLabel:'The Return of the King · Map of Rohan, Gondor, and Mordor',
  },
  {
    id:'isenmouthe',name:'Isenmouthe',overviewLabel:'Isenmouthe',kind:'Carach Angren',pinSubtitle:'The southern jaws of Udûn',subtitle:'A narrow passage into Gorgoroth',
    description:'Mountain spurs constrict the southern end of Udûn into the Isenmouthe. An earthen rampart and a fence of iron posts guard the opening, with a bridge across a deep ditch. Beyond these defences the country opens onto Gorgoroth.',
    date:null,region:'mordor',major:false,source:'https://tolkiengateway.net/wiki/Carach_Angren',sourceLabel:'Book VI, ch. 2 · The Land of Shadow · Published map',
  },
  {
    id:'mount-doom',name:'Mount Doom',overviewLabel:'Mount Doom',kind:'Orodruin · Amon Amarth',pinSubtitle:'The fire beneath the ash',subtitle:'An isolated volcano on Gorgoroth',
    description:'Orodruin rises alone from the desolate plateau of Gorgoroth. Sauron forged the One Ring in the Sammath Naur within the mountain. A road approaches its eastern flank from Barad-dûr. The mountain is shown before the Ring’s destruction, with its fire still stirring.',
    date:null,region:'mordor',major:true,source:'https://tolkiengateway.net/wiki/Mount_Doom',sourceLabel:'Book VI, ch. 3 · Mount Doom',
  },
  {
    id:'barad-dur',name:'Barad-dûr',overviewLabel:'Barad-dûr',kind:'The Dark Tower',pinSubtitle:'The stronghold of Sauron',subtitle:'At the end of a spur of Ered Lithui',
    description:'Sauron’s fortress stands on the end of a long southwestern spur of the Ash Mountains, east of Mount Doom. Its western road leads to the volcano; another runs northwest toward Udûn and the Black Gate. The tower is shown intact, before the downfall of Sauron.',
    date:null,region:'mordor',major:true,source:'https://tolkiengateway.net/wiki/Barad-d%C3%BBr',sourceLabel:'Book VI, ch. 3 · Mount Doom · Published map',
  },
  {
    id:'cair-andros',name:'Cair Andros',overviewLabel:'Cair Andros',kind:'The Ship of Long-foam',pinSubtitle:'The island crossing',subtitle:'Between two arms of the Anduin',
    description:'A long wooded island divides the Anduin east of Anórien. Its northern rocks split the current like a ship’s prow. Gondor guards this crossing north of Minas Tirith; the two channels remain open around the island.',
    date:null,region:'gondor',major:true,source:'https://tolkiengateway.net/wiki/Cair_Andros',sourceLabel:'The Return of the King · The Siege of Gondor · Published map',
  },
  {
    id:'henneth-annun',name:'Henneth Annûn',overviewLabel:'Henneth Annûn',kind:'The Window on the West',pinSubtitle:'North Ithilien',subtitle:'A refuge concealed behind falling water',
    description:'Northeast of Cair Andros, a west-facing waterfall hides a cave used by the Rangers of Ithilien. The water falls into a shaded pool below. Faramir brings Frodo and Sam to this secret refuge, hidden in the wooded country west of Mordor.',
    date:null,region:'gondor',major:true,source:'https://tolkiengateway.net/wiki/Henneth_Ann%C3%BBn',sourceLabel:'Book IV, ch. 5–6 · The Window on the West · The Forbidden Pool',
  },
  {
    id:'druadan-forest',name:'Drúadan Forest',overviewLabel:'Drúadan Forest',kind:'The woods of the Drúedain',pinSubtitle:'Anórien',subtitle:'Beneath the northeastern White Mountains',
    description:'The Drúadan Forest lies west of the Anduin, near the eastern end of the White Mountains. The Great West Road skirts its northern edge. These woods are home to the Drúedain, whose leader Ghân-buri-Ghân guides the Rohirrim through the hills.',
    date:null,region:'gondor',major:true,source:'https://tolkiengateway.net/wiki/Dr%C3%BAadan_Forest',sourceLabel:'Book V, ch. 5 · The Ride of the Rohirrim · Published map',
  },
  {
    id:'amon-din',name:'Amon Dîn',overviewLabel:'Amon Dîn',kind:'The easternmost beacon',pinSubtitle:'The Silent Hill',subtitle:'A watch above the eastern edge of the woods',
    description:'Amon Dîn stands east of the Drúadan Forest. It is the first of Gondor’s seven warning beacons when counted from Minas Tirith. The hill overlooks the northern approaches and the crossings of the Anduin; its beacon remains unlit in this view.',
    date:null,region:'gondor',major:false,source:'https://tolkiengateway.net/wiki/Amon_D%C3%AEn',sourceLabel:'Unfinished Tales · Cirion and Eorl · Published map',
  },
  {
    id:'minas-tirith',name:'Minas Tirith',overviewLabel:'Minas Tirith',kind:'The Tower of Guard',pinSubtitle:'The White City',subtitle:'Seven levels beneath Mindolluin',
    description:'Minas Tirith rises on a hill joined to Mount Mindolluin by a narrow shoulder. Its seven walled levels face east across the Pelennor toward Osgiliath. A black outer wall guards the white city; the Tower of Ecthelion stands above the Citadel.',
    date:null,region:'pelennor',major:true,source:'https://tolkiengateway.net/wiki/Minas_Tirith',sourceLabel:'Book V, ch. 1 · Minas Tirith · Published map',
  },
  {
    id:'osgiliath',name:'Osgiliath',overviewLabel:'Osgiliath',kind:'The Citadel of the Stars',pinSubtitle:'The ruined capital',subtitle:'An old city on both banks of the Anduin',
    description:'Gondor’s first capital stood across the Anduin, northeast of Minas Tirith. By the War of the Ring its streets and halls lie in ruins. Its last bridge fell in June 3018, leaving the river crossing contested between Gondor and the forces of Mordor.',
    date:null,region:'pelennor',major:true,source:'https://tolkiengateway.net/wiki/Osgiliath',sourceLabel:'Book II, ch. 2 · The Council of Elrond · Appendix B',
  },
  {
    id:'harlond',name:'Harlond',overviewLabel:'Harlond',kind:'The southern quays',pinSubtitle:'The harbour of Minas Tirith',subtitle:'Along the western bank of the Great River',
    description:'Harlond is the river port of Minas Tirith, a few miles south of the city. Its quays receive vessels from the southern lands of Gondor, beside the Rammas Echor. During the Battle of the Pelennor Fields, Aragorn and his company land here from the fleet brought upriver.',
    date:null,region:'pelennor',major:true,source:'https://tolkiengateway.net/wiki/Harlond_(Gondor)',sourceLabel:'Book V, ch. 1 & 6 · Minas Tirith · The Battle of the Pelennor Fields',
  },
  {
    id:'emyn-arnen',name:'Emyn Arnen',overviewLabel:'Emyn Arnen',kind:'The hills beside the water',pinSubtitle:'South Ithilien',subtitle:'Within the bend of the Anduin',
    description:'Emyn Arnen rises east of the Anduin and south of Osgiliath. The river curves around the feet of these hills, an outlier of the Ephel Dúath. After the War of the Ring, Faramir becomes Lord of Emyn Arnen; this view shows the country before his new household is established.',
    date:null,region:'pelennor',major:false,source:'https://tolkiengateway.net/wiki/Emyn_Arnen',sourceLabel:'Unfinished index · Appendix A · Published map',
  },
  {
    id:'cross-roads',name:'Cross-roads',overviewLabel:'Cross-roads',kind:'The meeting of four ways',pinSubtitle:'The Fallen King',subtitle:'Where Ithilien’s roads meet',
    description:'The north–south Harad Road meets the road from Osgiliath to Minas Morgul among great trees. Beside the western road stands a defaced statue of a king of Gondor. Its fallen head rests nearby, crowned by small flowers.',
    date:null,region:'morgul',major:true,source:'https://tolkiengateway.net/wiki/Cross-roads',sourceLabel:'Book IV, ch. 7 · Journey to the Cross-roads · Published map',
  },
  {
    id:'minas-morgul',name:'Minas Morgul',overviewLabel:'Minas Morgul',kind:'The Tower of Sorcery',pinSubtitle:'The fallen Moon-tower',subtitle:'A pale city within the mountain valley',
    description:'Once Minas Ithil, this stronghold now belongs to the Nazgûl. A white bridge crosses the Morgulduin to its northern gate. Pale light clings to the walls; the meadows beside the cold stream bear poisonous white flowers.',
    date:null,region:'morgul',major:true,source:'https://tolkiengateway.net/wiki/Minas_Morgul',sourceLabel:'Book IV, ch. 8 · The Stairs of Cirith Ungol',
  },
  {
    id:'morgul-stairs',name:'Morgul Stairs',overviewLabel:'Morgul Stairs',kind:'The hidden ascent',pinSubtitle:'Above the valley',subtitle:'A narrow way toward Cirith Ungol',
    description:'Before the bridge to Minas Morgul, a narrow path turns north and climbs the valley’s wall. The Straight Stair and Winding Stair lead toward the tunnel of Torech Ungol. This hidden ascent is separate from the broader road over the Morgul Pass.',
    date:null,region:'morgul',major:false,source:'https://tolkiengateway.net/wiki/Stairs_of_Cirith_Ungol',sourceLabel:'Book IV, ch. 8–9 · The Stairs of Cirith Ungol · Shelob’s Lair',
  },
  {
    id:'cirith-ungol',name:'Cirith Ungol',overviewLabel:'Cirith Ungol',kind:'The watch above the pass',pinSubtitle:'The eastern tower',subtitle:'On the Mordor side of the mountains',
    description:'The tower guards the eastern exit of Cirith Ungol. Three tiers of pointed bastions face into Mordor beneath a round turret. Beyond the pass lie the trough of the Morgai and Gorgoroth. The fortress was built by Gondor but is now held by Orcs.',
    date:null,region:'morgul',major:true,source:'https://tolkiengateway.net/wiki/Tower_of_Cirith_Ungol',sourceLabel:'Book VI, ch. 1 · The Tower of Cirith Ungol',
  },
  {
    id:'erech',name:'Erech',overviewLabel:'Erech',kind:'The Stone of Isildur',pinSubtitle:'At the mouth of Blackroot Vale',subtitle:'A black stone upon a quiet hill',
    description:'South of the White Mountains, a smooth black globe stands upon the Hill of Erech. Isildur brought the stone from Númenor. Here the King of the Mountains swore his oath, and here Aragorn later summons the Dead to fulfil it.',
    date:null,region:'lamedon',major:true,source:'https://tolkiengateway.net/wiki/Erech',sourceLabel:'Book V, ch. 2 · The Passing of the Grey Company · Published map',
  },
  {
    id:'tarlangs-neck',name:'Tarlang’s Neck',overviewLabel:'Tarlang’s Neck',kind:'The pass into Lamedon',pinSubtitle:'A southern mountain spur',subtitle:'Between Blackroot Vale and the eastern valleys',
    description:'The road from Erech crosses a low neck in a rocky spur of the White Mountains. Beyond this divide lie the valleys of Lamedon and the road to Calembel. The pass runs over the spur; the Paths of the Dead lie farther north.',
    date:null,region:'lamedon',major:true,source:'https://tolkiengateway.net/wiki/Tarlang%27s_Neck',sourceLabel:'Book V, ch. 2 · Nomenclature · Published map',
  },
  {
    id:'calembel',name:'Calembel',overviewLabel:'Calembel',kind:'A hill-town of Lamedon',pinSubtitle:'Beside the fords of Ciril',subtitle:'A green valley beneath the White Mountains',
    description:'Calembel stands on a small hill near the fords of the Ciril. The road from Erech crosses the river here before continuing east toward Ethring and the southern lands of Gondor. In the War of the Ring, Aragorn finds the town deserted as its people take refuge in the hills.',
    date:null,region:'lamedon',major:true,source:'https://tolkiengateway.net/wiki/Calembel',sourceLabel:'Book V, ch. 2 · The Passing of the Grey Company · Published map',
  },
  {
    id:'ethring',name:'Ethring',overviewLabel:'Ethring',kind:'The crossing of Ringló',pinSubtitle:'East of Lamedon',subtitle:'A bridge on the road through southern Gondor',
    description:'At Ethring the road from Calembel crosses the Ringló, then turns south toward Linhir and Pelargir. The published map marks a crossing here without identifying a town. The river flows southwest to meet the Ciril and, farther downstream, the Morthond.',
    date:null,region:'lamedon',major:true,source:'https://tolkiengateway.net/wiki/Ethring',sourceLabel:'Published map · Book V, ch. 9 · The Last Debate',
  },
  {
    id:'druwaith-iaur',name:'Drúwaith Iaur',overviewLabel:'Drúwaith Iaur',kind:'The Old Púkel-wilderness',pinSubtitle:'Woods above the western coast',subtitle:'On the northwestern slopes of Andrast',
    description:'Dark woods shelter the western slopes of the mountains of Andrast. The Drúedain lived here in secret into the late Third Age. This remote country was never settled by the Númenóreans and lies outside Gondor’s inhabited lands; it is separate from Drúadan Forest near Minas Tirith.',
    date:null,region:'anfalas',major:true,source:'https://tolkiengateway.net/wiki/Dr%C3%BAwaith_Iaur',sourceLabel:'Unfinished Tales · The Drúedain · Published map',
  },
  {
    id:'lefnui',name:'Lefnui',overviewLabel:'Lefnui',kind:'The western river',pinSubtitle:'From mountain spring to firth',subtitle:'The western boundary of Gondor',
    description:'The Lefnui rises in the western White Mountains and winds southwest, west of Pinnath Gelin. Its lower waters open into a long, narrow firth on the Bay of Belfalas. The river marks Gondor’s western boundary, separating its lands from the mountainous promontory of Andrast.',
    date:null,region:'anfalas',major:true,source:'https://tolkiengateway.net/wiki/Lefnui',sourceLabel:'Published map · The Rivers and Beacon-hills of Gondor',
  },
  {
    id:'pinnath-gelin',name:'Pinnath Gelin',overviewLabel:'Pinnath Gelin',kind:'The Green Hills',pinSubtitle:'North of the long shore',subtitle:'Between the Lefnui and the Morthond',
    description:'A line of green hills rises north of Anfalas in western Gondor. During the War of the Ring, Hirluin the Fair brings three hundred men clad in green from this country to defend Minas Tirith. This marker identifies the hill country; the published map names no capital here.',
    date:null,region:'anfalas',major:true,source:'https://tolkiengateway.net/wiki/Pinnath_Gelin',sourceLabel:'Book V, ch. 1 · Minas Tirith · Published map',
  },
  {
    id:'anfalas',name:'Anfalas',overviewLabel:'Anfalas',kind:'The long shore',pinSubtitle:'Langstrand of Gondor',subtitle:'Below the green hills, beside the sea',
    description:'Anfalas is the coastal fief between the Lefnui and Morthond, south of Pinnath Gelin. Its name is also rendered Langstrand. Golasgil leads hunters, herdsmen and men of its small villages to the defence of Minas Tirith. The atlas currently shows the western part of this long coast.',
    date:null,region:'anfalas',major:true,source:'https://tolkiengateway.net/wiki/Anfalas',sourceLabel:'Book V, ch. 1 · Minas Tirith · Published map',
  },
  {
    id:'edhellond',name:'Edhellond',overviewLabel:'Edhellond',kind:'The deserted Elf-haven',pinSubtitle:'At the meeting of river and sea',subtitle:'The old haven north of Dol Amroth',
    description:'The Ringló joins the Morthond above this ancient haven, near the sheltered waters of Cobas Haven. Elves once sailed west from here. In Third Age 1981, Amroth was lost at sea and the last Elven ship departed. By the War of the Ring the harbour stood deserted, remembered in the traditions of Gondor.',
    date:null,region:'belfalas',major:true,source:'https://tolkiengateway.net/wiki/Edhellond',sourceLabel:'Unfinished Tales · Amroth and Nimrodel · Published map',
  },
  {
    id:'cobas-haven',name:'Cobas Haven',overviewLabel:'Cobas Haven',kind:'The sheltered bay',pinSubtitle:'Beneath the headland',subtitle:'Where the rivers reach the Bay of Belfalas',
    description:'The combined waters of the Morthond and Ringló enter this small coastal bay. Edhellond lies near the river mouth; the high headland of Dol Amroth shelters the haven to the south. Beyond it opens the greater Bay of Belfalas.',
    date:null,region:'belfalas',major:true,source:'https://tolkiengateway.net/wiki/Cobas_Haven',sourceLabel:'Published map · The War of the Ring · The Second Map',
  },
  {
    id:'dol-amroth',name:'Dol Amroth',overviewLabel:'Dol Amroth',kind:'The city of the Swan-knights',pinSubtitle:'The castle above the sea',subtitle:'The seat of the Princes of Belfalas',
    description:'A castle and port-city stand on a high headland on the western coast of Belfalas, south of Edhellond. The Sea-ward Tower overlooks the water. Prince Imrahil leads the Swan-knights of Dol Amroth to the defence of Minas Tirith; his house bears a ship with a swan-prow on its banner.',
    date:null,region:'belfalas',major:true,source:'https://tolkiengateway.net/wiki/Dol_Amroth',sourceLabel:'Book V, ch. 1 · Minas Tirith · The Adventures of Tom Bombadil, preface',
  },
  {
    id:'belfalas',name:'Belfalas',overviewLabel:'Belfalas',kind:'A shoreland of Gondor',pinSubtitle:'Hills above the surf',subtitle:'The mountainous peninsula south of Lamedon',
    description:'Wooded hills and rocky heights run through this southern promontory of Gondor. The lower Ringló and Morthond lie to the west, while the Gilrain marks the fief’s eastern side. Dol Amroth is its chief city, overlooking the sea from the western shore.',
    date:null,region:'belfalas',major:true,source:'https://tolkiengateway.net/wiki/Belfalas',sourceLabel:'Published map · Unfinished Tales · Cirion and Eorl, note 39',
  },
  {
    id:'linhir',name:'Linhir',overviewLabel:'Linhir',kind:'The haven on Gilrain',pinSubtitle:'Below the meeting of the rivers',subtitle:'A crossing on the road through southern Gondor',
    description:'Linhir stands on the west bank below the meeting of the Gilrain and Serni. The road from Erech crosses here on its way to Pelargir. Tolkien describes fords in the story and a haven with a ferrybridge in his unfinished index. The combined waters run south from the town into the Bay of Belfalas.',
    date:null,region:'linhir',major:true,source:'https://tolkiengateway.net/wiki/Linhir',sourceLabel:'Book V, ch. 9 · The Last Debate · Unfinished index',
  },
  {
    id:'gilrain',name:'Gilrain',overviewLabel:'Gilrain',kind:'The border river',pinSubtitle:'Between Belfalas and Lebennin',subtitle:'From the mountains to the haven',
    description:'The Gilrain descends from the White Mountains, marking the eastern side of Belfalas. Above Linhir it meets the Serni, which approaches from the northeast. Their combined waters pass the haven before reaching the sea.',
    date:null,region:'linhir',major:false,source:'https://tolkiengateway.net/wiki/Gilrain',sourceLabel:'Published map · Book V, ch. 9 · The Last Debate',
  },
  {
    id:'serni',name:'Serni',overviewLabel:'Serni',kind:'A river of Lebennin',pinSubtitle:'The eastern branch above Linhir',subtitle:'Southwest from the mountain foothills',
    description:'The Serni rises south of the eastern White Mountains and flows southwest through Lebennin to meet the Gilrain just above Linhir. It reaches the sea through their shared lower course, separate from the great river Anduin farther east.',
    date:null,region:'linhir',major:false,source:'https://tolkiengateway.net/wiki/Serni',sourceLabel:'Published map · The Rivers and Beacon-hills of Gondor',
  },
  {
    id:'western-lebennin',name:'Western Lebennin',overviewLabel:'Lebennin',kind:'The land of five streams',pinSubtitle:'East of the Gilrain',subtitle:'The western countryside of southern Gondor',
    description:'Lebennin stretches south of the White Mountains, between the Gilrain and Anduin. This part of the atlas follows its western fields and coast eastward from Linhir. Farther east lie the other rivers of the land and the great haven of Pelargir, beyond the present sheet.',
    date:null,region:'linhir',major:true,source:'https://tolkiengateway.net/wiki/Lebennin',sourceLabel:'Published map · Book V, ch. 9 · The Last Debate',
  },
  ...easternPlaces.map(p=>({...p,...eastNotes[p.id],overviewLabel:p.id==='weathertop'?'Amon Sûl':p.name,region:'east' as const,major:true})),
] as const;
export type PlaceId = typeof places[number]['id'];
export const majorPlaces = places.filter(p=>p.major);
