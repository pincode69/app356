export interface Treasure {
  id: number;
  name: string;
  description: string;
  price: number;
  image: any; // require() image path
}

export const treasures: Treasure[] = [
  { id: 1, name: 'Golden Scarab', description: 'Sacred beetle of ancient Egypt', price: 50, image: require('@assets/images/treasures/Golden-Scarab.png') },
  { id: 2, name: 'Ankh Cross', description: 'Symbol of eternal life', price: 75, image: require('@assets/images/treasures/Ankh-Cross.png') },
  { id: 3, name: 'Eye of Horus', description: 'Protective amulet of the gods', price: 100, image: require('@assets/images/treasures/Eye-Of-Horus.png') },
  { id: 4, name: 'Pharaoh Crown', description: 'Royal headpiece of power', price: 125, image: require('@assets/images/treasures/Pharaoh-Crown.png') },
  { id: 5, name: 'Pyramid Stone', description: 'Ancient building block', price: 150, image: require('@assets/images/treasures/Pyramid-Stone.png') },
  { id: 6, name: 'Sphinx Statue', description: 'Guardian of the desert', price: 175, image: require('@assets/images/treasures/Sphinx-Statue.png') },
  { id: 7, name: 'Papyrus Scroll', description: 'Ancient knowledge preserved', price: 200, image: require('@assets/images/treasures/Papyrus-Scroll.png') },
  { id: 8, name: 'Lotus Flower', description: 'Symbol of rebirth', price: 225, image: require('@assets/images/treasures/Lotus-Flower.png') },
  { id: 9, name: 'Cobra Staff', description: 'Staff of the pharaoh', price: 250, image: require('@assets/images/treasures/Cobra-Staff.png') },
  { id: 10, name: 'Golden Mask', description: 'Funerary mask of royalty', price: 275, image: require('@assets/images/treasures/Golden-Mask.png') },
  { id: 11, name: 'Nile Water', description: 'Sacred river essence', price: 300, image: require('@assets/images/treasures/Nile-Water.png') },
  { id: 12, name: 'Desert Rose', description: 'Crystal formation of beauty', price: 325, image: require('@assets/images/treasures/Desert-Rose.png') },
  { id: 13, name: 'Obelisk Fragment', description: 'Ancient monument piece', price: 350, image: require('@assets/images/treasures/Obelisk-Fragment.png') },
  { id: 14, name: 'Hawk Feather', description: 'Feather of Horus', price: 375, image: require('@assets/images/treasures/Hawk-Feather.png') },
  { id: 15, name: 'Canopic Jar', description: 'Vessel for organs', price: 400, image: require('@assets/images/treasures/Canopic-Jar.png') },
  { id: 16, name: 'Solar Disc', description: 'Symbol of Ra', price: 425, image: require('@assets/images/treasures/Solar-Disc.png') },
  { id: 17, name: 'Crocodile Scale', description: 'Scale of Sobek', price: 450, image: require('@assets/images/treasures/Crocodile-Scale.png') },
  { id: 18, name: 'Sarcophagus', description: 'Ancient burial chamber', price: 475, image: require('@assets/images/treasures/Sarcophagus.png') },
  { id: 19, name: 'Hieroglyph Tablet', description: 'Ancient writing stone', price: 500, image: require('@assets/images/treasures/Hieroglyph-Tablet.png') },
  { id: 20, name: 'Desert Oasis', description: 'Life in the sand', price: 525, image: require('@assets/images/treasures/Desert-Oasis.png') },
  { id: 21, name: 'Golden Chariot', description: 'Royal vehicle', price: 550, image: require('@assets/images/treasures/Golden-Chariot.png') },
  { id: 22, name: 'Mummy Bandage', description: 'Preservation cloth', price: 575, image: require('@assets/images/treasures/Mummy-Bandage.png') },
  { id: 23, name: 'Sacred Cat', description: 'Bastet\'s companion', price: 600, image: require('@assets/images/treasures/Sacred-Cat.png') },
  { id: 24, name: 'Book of the Dead', description: 'Guide to the afterlife', price: 1000, image: require('@assets/images/treasures/Book-Of-The-Dead.png') },
];

