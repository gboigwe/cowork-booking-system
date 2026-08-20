// Single source of truth for ZoneIn Hub's real-world contact/location details.
// Email is still a placeholder pending the real address; swap here only.
export const CONTACT = {
  addressLine1: '19, Udeh Street',
  addressLine2: 'off Nightingale Academy, Ajanaku Street, Amikanle',
  addressLine3: 'Alagbado, Lagos',
  addressShort: 'Alagbado, Lagos',
  hours: 'Monday to Saturday, 6am - 6pm',
  phoneDisplay: '+234 904 622 8902',
  phoneTel: '+2349046228902',
  whatsappUrl: 'https://wa.me/2349046228902',
  email: 'zoneinhub@gmail.com',
  // Same location as the Plus Code used on the Google Business Profile listing.
  plusCode: 'M735+M9 Lagos',
  mapEmbedUrl: `https://www.google.com/maps?q=${encodeURIComponent('M735+M9 Lagos')}&output=embed`,
  // Nearby landmarks, since street addressing alone is unreliable for this area.
  landmarks: [
    'Around Nightingale Academy',
    'After Lizben Schools',
    'Around Community School, Surulere',
    'Off Amikanle, Alagbado, Lagos',
  ],
};
