// Coordinates from the 1050×750 Eriador crop (origin 1050,400) of Christopher
// Tolkien's 1980 map. All layers use the same affine projection into 1500×1000.
// Reference: https://tolkiengateway.net/wiki/File:Christopher_Tolkien_-_The_West_of_Middle-earth.png
export const projectMapPoint=(x:number,y:number)=>({x:x*1500/1050,y:y*1000/750});
export const canonicalPlaces={
  bree:projectMapPoint(181,408),
  weathertop:projectMapPoint(366,372),
  rivendell:projectMapPoint(809,378),
};
// Small segments are traced from the published river courses for moving highlights.
// They stop at crossings; the complete, authoritative linework is in the base map.
export const riverSegments=[
  'M880 141 C844 145 795 139 767 146 S743 179 723 193 S715 221 691 240 S651 251 635 272 S612 283 610 310 L592 352',
  'M583 378 L580 419 L573 452 L566 486 Q575 502 570 521 L558 574',
  'M758 425 Q749 452 735 461 L727 474 L700 495 Q680 510 654 524 L636 527 L610 550 L585 578 L561 589',
  'M891 331 Q876 342 858 345 L835 353 L813 368 L788 386',
  'M851 389 Q837 384 821 387 L805 388 L788 389',
];
export const mistRegions=[{x:130,y:305,w:245,h:82,delay:-9},{x:365,y:378,w:230,h:70,delay:-24},{x:847,y:340,w:335,h:92,delay:-17},{x:959,y:605,w:220,h:70,delay:-36}];
export const settlementLights=[{x:173,y:407},{x:181,y:406},{x:189,y:404},{x:810,y:377},{x:815,y:378}].map(p=>projectMapPoint(p.x,p.y));
// East Road, not Frodo's off-road itinerary. Ends at the Ford on this crop.
export const eastRoad='M181 408 C231 403 276 404 319 408 S373 409 414 389 S504 347 548 358 S583 365 589 366 S689 382 724 388 L774 398';
