/**
 * Place Translations - Multilingual names for buildings, rooms, and areas
 * 
 * Used for the "wind" language transition effect that transforms
 * all place names when switching languages.
 */

export interface PlaceTranslation {
  name: string;
  greeting?: string;
  description?: string;
}

export interface PlaceTranslations {
  // Buildings
  home: PlaceTranslation;
  marketplace: PlaceTranslation;
  library: PlaceTranslation;
  gym: PlaceTranslation;
  clinic: PlaceTranslation;
  park: PlaceTranslation;
  temple: PlaceTranslation;
  plaza: PlaceTranslation;
  townHall: PlaceTranslation;
  
  // Home rooms
  bedroom: PlaceTranslation;
  bathroom: PlaceTranslation;
  kitchen: PlaceTranslation;
  diningRoom: PlaceTranslation;
  livingRoom: PlaceTranslation;
  guestRoom: PlaceTranslation;
  garage: PlaceTranslation;
  frontyard: PlaceTranslation;
  backyard: PlaceTranslation;
  garden: PlaceTranslation;
  street: PlaceTranslation;
  hallway: PlaceTranslation;
  
  // Town areas
  downtown: PlaceTranslation;
  mainStreet: PlaceTranslation;
  residential: PlaceTranslation;
  wilderness: PlaceTranslation;
  forest: PlaceTranslation;
  beach: PlaceTranslation;
  mountain: PlaceTranslation;
  
  // Directions
  north: string;
  south: string;
  east: string;
  west: string;
}

// All translations by language code
export const PLACE_TRANSLATIONS: Record<string, PlaceTranslations> = {
  // English (default)
  en: {
    home: { name: 'Home', greeting: 'Home sweet home!', description: 'Your cozy home' },
    marketplace: { name: 'Marketplace', greeting: 'Welcome to the market!', description: 'Buy and sell goods' },
    library: { name: 'Library', greeting: 'Shh, quiet please!', description: 'Knowledge awaits' },
    gym: { name: 'Fitness Center', greeting: 'Let\'s get moving!', description: 'Train your body' },
    clinic: { name: 'Wellness Clinic', greeting: 'How are you feeling?', description: 'Health and wellness' },
    park: { name: 'Village Park', greeting: 'Enjoy the outdoors!', description: 'Fresh air and nature' },
    temple: { name: 'Meditation Temple', greeting: 'Find your peace.', description: 'Mindfulness and wisdom' },
    plaza: { name: 'Social Plaza', greeting: 'Nice to see you!', description: 'Meet new friends' },
    townHall: { name: 'Town Hall', greeting: 'Welcome, citizen!', description: 'The heart of the town' },
    
    bedroom: { name: 'Bedroom', description: 'Rest and recharge' },
    bathroom: { name: 'Bathroom', description: 'Freshen up' },
    kitchen: { name: 'Kitchen', description: 'Cook delicious meals' },
    diningRoom: { name: 'Dining Room', description: 'Enjoy your meals' },
    livingRoom: { name: 'Living Room', description: 'Relax and unwind' },
    guestRoom: { name: 'Guest Room', description: 'For visitors' },
    garage: { name: 'Garage', description: 'Tools and vehicles' },
    frontyard: { name: 'Front Yard', description: 'Welcome visitors' },
    backyard: { name: 'Backyard', description: 'Private outdoor space' },
    garden: { name: 'Garden', description: 'Grow your own food' },
    street: { name: 'Street', description: 'The neighborhood' },
    hallway: { name: 'Hallway', description: 'Connecting rooms' },
    
    downtown: { name: 'Downtown', description: 'The busy center' },
    mainStreet: { name: 'Main Street', description: 'Shops and services' },
    residential: { name: 'Residential Area', description: 'Quiet neighborhood' },
    wilderness: { name: 'Wilderness', description: 'The great unknown' },
    forest: { name: 'Forest', description: 'Ancient trees' },
    beach: { name: 'Beach', description: 'Sandy shores' },
    mountain: { name: 'Mountain', description: 'Towering peaks' },
    
    north: 'North',
    south: 'South',
    east: 'East',
    west: 'West',
  },
  
  // Spanish
  es: {
    home: { name: 'Casa', greeting: '¡Hogar dulce hogar!', description: 'Tu casa acogedora' },
    marketplace: { name: 'El Mercado', greeting: '¡Bienvenido al mercado!', description: 'Compra y vende' },
    library: { name: 'La Biblioteca', greeting: '¡Silencio, por favor!', description: 'El conocimiento espera' },
    gym: { name: 'El Gimnasio', greeting: '¡Vamos a movernos!', description: 'Entrena tu cuerpo' },
    clinic: { name: 'La Clínica', greeting: '¿Cómo te sientes?', description: 'Salud y bienestar' },
    park: { name: 'El Parque', greeting: '¡Disfruta del aire libre!', description: 'Aire fresco y naturaleza' },
    temple: { name: 'El Templo', greeting: 'Encuentra tu paz.', description: 'Meditación y sabiduría' },
    plaza: { name: 'La Plaza', greeting: '¡Qué gusto verte!', description: 'Conoce nuevos amigos' },
    townHall: { name: 'El Ayuntamiento', greeting: '¡Bienvenido, ciudadano!', description: 'El corazón del pueblo' },
    
    bedroom: { name: 'El Dormitorio', description: 'Descansa y recarga' },
    bathroom: { name: 'El Baño', description: 'Refréscate' },
    kitchen: { name: 'La Cocina', description: 'Cocina platos deliciosos' },
    diningRoom: { name: 'El Comedor', description: 'Disfruta tus comidas' },
    livingRoom: { name: 'La Sala', description: 'Relájate y descansa' },
    guestRoom: { name: 'La Habitación de Huéspedes', description: 'Para visitantes' },
    garage: { name: 'El Garaje', description: 'Herramientas y vehículos' },
    frontyard: { name: 'El Jardín Delantero', description: 'Recibe visitantes' },
    backyard: { name: 'El Patio Trasero', description: 'Espacio privado al aire libre' },
    garden: { name: 'El Huerto', description: 'Cultiva tu comida' },
    street: { name: 'La Calle', description: 'El vecindario' },
    hallway: { name: 'El Pasillo', description: 'Conectando habitaciones' },
    
    downtown: { name: 'El Centro', description: 'El centro animado' },
    mainStreet: { name: 'Calle Principal', description: 'Tiendas y servicios' },
    residential: { name: 'Zona Residencial', description: 'Barrio tranquilo' },
    wilderness: { name: 'La Naturaleza Salvaje', description: 'Lo desconocido' },
    forest: { name: 'El Bosque', description: 'Árboles antiguos' },
    beach: { name: 'La Playa', description: 'Orillas arenosas' },
    mountain: { name: 'La Montaña', description: 'Picos imponentes' },
    
    north: 'Norte',
    south: 'Sur',
    east: 'Este',
    west: 'Oeste',
  },
  
  // French
  fr: {
    home: { name: 'Maison', greeting: 'Chez soi, c\'est le mieux!', description: 'Votre maison douillette' },
    marketplace: { name: 'Le Marché', greeting: 'Bienvenue au marché!', description: 'Acheter et vendre' },
    library: { name: 'La Bibliothèque', greeting: 'Chut, silence!', description: 'Le savoir vous attend' },
    gym: { name: 'La Salle de Sport', greeting: 'Bougeons!', description: 'Entraînez votre corps' },
    clinic: { name: 'La Clinique', greeting: 'Comment allez-vous?', description: 'Santé et bien-être' },
    park: { name: 'Le Parc', greeting: 'Profitez du plein air!', description: 'Air frais et nature' },
    temple: { name: 'Le Temple', greeting: 'Trouvez votre paix.', description: 'Méditation et sagesse' },
    plaza: { name: 'La Place', greeting: 'Ravi de vous voir!', description: 'Rencontrez des amis' },
    townHall: { name: 'L\'Hôtel de Ville', greeting: 'Bienvenue, citoyen!', description: 'Le cœur de la ville' },
    
    bedroom: { name: 'La Chambre', description: 'Repos et détente' },
    bathroom: { name: 'La Salle de Bain', description: 'Rafraîchissez-vous' },
    kitchen: { name: 'La Cuisine', description: 'Cuisinez de bons plats' },
    diningRoom: { name: 'La Salle à Manger', description: 'Savourez vos repas' },
    livingRoom: { name: 'Le Salon', description: 'Détendez-vous' },
    guestRoom: { name: 'La Chambre d\'Amis', description: 'Pour les visiteurs' },
    garage: { name: 'Le Garage', description: 'Outils et véhicules' },
    frontyard: { name: 'Le Jardin de Devant', description: 'Accueillez les visiteurs' },
    backyard: { name: 'L\'Arrière-cour', description: 'Espace extérieur privé' },
    garden: { name: 'Le Potager', description: 'Cultivez votre nourriture' },
    street: { name: 'La Rue', description: 'Le quartier' },
    hallway: { name: 'Le Couloir', description: 'Reliant les pièces' },
    
    downtown: { name: 'Le Centre-Ville', description: 'Le centre animé' },
    mainStreet: { name: 'Rue Principale', description: 'Boutiques et services' },
    residential: { name: 'Zone Résidentielle', description: 'Quartier calme' },
    wilderness: { name: 'La Nature Sauvage', description: 'L\'inconnu' },
    forest: { name: 'La Forêt', description: 'Arbres anciens' },
    beach: { name: 'La Plage', description: 'Rivages sablonneux' },
    mountain: { name: 'La Montagne', description: 'Sommets imposants' },
    
    north: 'Nord',
    south: 'Sud',
    east: 'Est',
    west: 'Ouest',
  },
  
  // German
  de: {
    home: { name: 'Zuhause', greeting: 'Trautes Heim, Glück allein!', description: 'Dein gemütliches Zuhause' },
    marketplace: { name: 'Der Marktplatz', greeting: 'Willkommen auf dem Markt!', description: 'Kaufen und verkaufen' },
    library: { name: 'Die Bibliothek', greeting: 'Psst, Ruhe bitte!', description: 'Wissen erwartet Sie' },
    gym: { name: 'Das Fitnessstudio', greeting: 'Los geht\'s!', description: 'Trainiere deinen Körper' },
    clinic: { name: 'Die Klinik', greeting: 'Wie geht es Ihnen?', description: 'Gesundheit und Wohlbefinden' },
    park: { name: 'Der Park', greeting: 'Genieß die Natur!', description: 'Frische Luft und Natur' },
    temple: { name: 'Der Tempel', greeting: 'Finde deinen Frieden.', description: 'Meditation und Weisheit' },
    plaza: { name: 'Der Platz', greeting: 'Schön dich zu sehen!', description: 'Neue Freunde treffen' },
    townHall: { name: 'Das Rathaus', greeting: 'Willkommen, Bürger!', description: 'Das Herz der Stadt' },
    
    bedroom: { name: 'Das Schlafzimmer', description: 'Ruhe und Erholung' },
    bathroom: { name: 'Das Badezimmer', description: 'Erfrische dich' },
    kitchen: { name: 'Die Küche', description: 'Koche leckere Gerichte' },
    diningRoom: { name: 'Das Esszimmer', description: 'Genieß deine Mahlzeiten' },
    livingRoom: { name: 'Das Wohnzimmer', description: 'Entspanne dich' },
    guestRoom: { name: 'Das Gästezimmer', description: 'Für Besucher' },
    garage: { name: 'Die Garage', description: 'Werkzeuge und Fahrzeuge' },
    frontyard: { name: 'Der Vorgarten', description: 'Empfange Besucher' },
    backyard: { name: 'Der Hinterhof', description: 'Privater Außenbereich' },
    garden: { name: 'Der Garten', description: 'Baue dein Essen an' },
    street: { name: 'Die Straße', description: 'Die Nachbarschaft' },
    hallway: { name: 'Der Flur', description: 'Verbindet Räume' },
    
    downtown: { name: 'Die Innenstadt', description: 'Das belebte Zentrum' },
    mainStreet: { name: 'Hauptstraße', description: 'Geschäfte und Dienste' },
    residential: { name: 'Wohngebiet', description: 'Ruhige Nachbarschaft' },
    wilderness: { name: 'Die Wildnis', description: 'Das Unbekannte' },
    forest: { name: 'Der Wald', description: 'Alte Bäume' },
    beach: { name: 'Der Strand', description: 'Sandige Ufer' },
    mountain: { name: 'Der Berg', description: 'Hohe Gipfel' },
    
    north: 'Norden',
    south: 'Süden',
    east: 'Osten',
    west: 'Westen',
  },
  
  // Japanese
  ja: {
    home: { name: 'おうち', greeting: 'ただいま！', description: '居心地の良い我が家' },
    marketplace: { name: '市場', greeting: 'いらっしゃいませ！', description: '売り買いの場所' },
    library: { name: '図書館', greeting: 'お静かに！', description: '知識が待っています' },
    gym: { name: 'ジム', greeting: '頑張りましょう！', description: '体を鍛える場所' },
    clinic: { name: 'クリニック', greeting: 'お体の調子はいかがですか？', description: '健康とウェルネス' },
    park: { name: '公園', greeting: '外を楽しんで！', description: '新鮮な空気と自然' },
    temple: { name: 'お寺', greeting: '心の平和を見つけて。', description: '瞑想と知恵' },
    plaza: { name: '広場', greeting: 'お会いできて嬉しいです！', description: '新しい友達に会う' },
    townHall: { name: '町役場', greeting: 'ようこそ、市民の皆様！', description: '町の中心' },
    
    bedroom: { name: '寝室', description: '休息と回復' },
    bathroom: { name: 'お風呂', description: 'リフレッシュ' },
    kitchen: { name: '台所', description: '美味しい料理を作る' },
    diningRoom: { name: 'ダイニング', description: '食事を楽しむ' },
    livingRoom: { name: 'リビング', description: 'くつろぐ場所' },
    guestRoom: { name: '客室', description: 'お客様のため' },
    garage: { name: 'ガレージ', description: '道具と車' },
    frontyard: { name: '前庭', description: 'お客様をお迎え' },
    backyard: { name: '裏庭', description: 'プライベートな屋外空間' },
    garden: { name: '菜園', description: '自分の食べ物を育てる' },
    street: { name: '通り', description: '近所' },
    hallway: { name: '廊下', description: '部屋をつなぐ' },
    
    downtown: { name: '繁華街', description: '賑やかな中心地' },
    mainStreet: { name: 'メインストリート', description: '店舗とサービス' },
    residential: { name: '住宅地', description: '静かな近所' },
    wilderness: { name: '荒野', description: '未知の世界' },
    forest: { name: '森', description: '古代の木々' },
    beach: { name: '海岸', description: '砂浜' },
    mountain: { name: '山', description: 'そびえ立つ峰' },
    
    north: '北',
    south: '南',
    east: '東',
    west: '西',
  },
  
  // Italian
  it: {
    home: { name: 'Casa', greeting: 'Casa dolce casa!', description: 'La tua casa accogliente' },
    marketplace: { name: 'Il Mercato', greeting: 'Benvenuto al mercato!', description: 'Comprare e vendere' },
    library: { name: 'La Biblioteca', greeting: 'Silenzio, per favore!', description: 'La conoscenza ti aspetta' },
    gym: { name: 'La Palestra', greeting: 'Muoviamoci!', description: 'Allena il tuo corpo' },
    clinic: { name: 'La Clinica', greeting: 'Come ti senti?', description: 'Salute e benessere' },
    park: { name: 'Il Parco', greeting: 'Goditi l\'aria aperta!', description: 'Aria fresca e natura' },
    temple: { name: 'Il Tempio', greeting: 'Trova la tua pace.', description: 'Meditazione e saggezza' },
    plaza: { name: 'La Piazza', greeting: 'Che piacere vederti!', description: 'Incontra nuovi amici' },
    townHall: { name: 'Il Municipio', greeting: 'Benvenuto, cittadino!', description: 'Il cuore della città' },
    
    bedroom: { name: 'La Camera da Letto', description: 'Riposo e relax' },
    bathroom: { name: 'Il Bagno', description: 'Rinfrescati' },
    kitchen: { name: 'La Cucina', description: 'Cucina piatti deliziosi' },
    diningRoom: { name: 'La Sala da Pranzo', description: 'Goditi i tuoi pasti' },
    livingRoom: { name: 'Il Soggiorno', description: 'Rilassati' },
    guestRoom: { name: 'La Camera degli Ospiti', description: 'Per i visitatori' },
    garage: { name: 'Il Garage', description: 'Attrezzi e veicoli' },
    frontyard: { name: 'Il Giardino Anteriore', description: 'Accogli i visitatori' },
    backyard: { name: 'Il Cortile', description: 'Spazio esterno privato' },
    garden: { name: 'L\'Orto', description: 'Coltiva il tuo cibo' },
    street: { name: 'La Strada', description: 'Il vicinato' },
    hallway: { name: 'Il Corridoio', description: 'Collega le stanze' },
    
    downtown: { name: 'Il Centro', description: 'Il centro animato' },
    mainStreet: { name: 'Via Principale', description: 'Negozi e servizi' },
    residential: { name: 'Zona Residenziale', description: 'Quartiere tranquillo' },
    wilderness: { name: 'La Natura Selvaggia', description: 'L\'ignoto' },
    forest: { name: 'La Foresta', description: 'Alberi antichi' },
    beach: { name: 'La Spiaggia', description: 'Rive sabbiose' },
    mountain: { name: 'La Montagna', description: 'Vette imponenti' },
    
    north: 'Nord',
    south: 'Sud',
    east: 'Est',
    west: 'Ovest',
  },
  
  // Portuguese
  pt: {
    home: { name: 'Casa', greeting: 'Lar doce lar!', description: 'Sua casa aconchegante' },
    marketplace: { name: 'O Mercado', greeting: 'Bem-vindo ao mercado!', description: 'Comprar e vender' },
    library: { name: 'A Biblioteca', greeting: 'Silêncio, por favor!', description: 'O conhecimento espera' },
    gym: { name: 'A Academia', greeting: 'Vamos nos mexer!', description: 'Treine seu corpo' },
    clinic: { name: 'A Clínica', greeting: 'Como você está se sentindo?', description: 'Saúde e bem-estar' },
    park: { name: 'O Parque', greeting: 'Aproveite o ar livre!', description: 'Ar fresco e natureza' },
    temple: { name: 'O Templo', greeting: 'Encontre sua paz.', description: 'Meditação e sabedoria' },
    plaza: { name: 'A Praça', greeting: 'Que bom te ver!', description: 'Conheça novos amigos' },
    townHall: { name: 'A Prefeitura', greeting: 'Bem-vindo, cidadão!', description: 'O coração da cidade' },
    
    bedroom: { name: 'O Quarto', description: 'Descanso e recuperação' },
    bathroom: { name: 'O Banheiro', description: 'Refresque-se' },
    kitchen: { name: 'A Cozinha', description: 'Cozinhe pratos deliciosos' },
    diningRoom: { name: 'A Sala de Jantar', description: 'Aproveite suas refeições' },
    livingRoom: { name: 'A Sala de Estar', description: 'Relaxe' },
    guestRoom: { name: 'O Quarto de Hóspedes', description: 'Para visitantes' },
    garage: { name: 'A Garagem', description: 'Ferramentas e veículos' },
    frontyard: { name: 'O Jardim da Frente', description: 'Receba visitantes' },
    backyard: { name: 'O Quintal', description: 'Espaço externo privado' },
    garden: { name: 'A Horta', description: 'Cultive sua comida' },
    street: { name: 'A Rua', description: 'A vizinhança' },
    hallway: { name: 'O Corredor', description: 'Conectando cômodos' },
    
    downtown: { name: 'O Centro', description: 'O centro movimentado' },
    mainStreet: { name: 'Rua Principal', description: 'Lojas e serviços' },
    residential: { name: 'Área Residencial', description: 'Bairro tranquilo' },
    wilderness: { name: 'A Natureza Selvagem', description: 'O desconhecido' },
    forest: { name: 'A Floresta', description: 'Árvores antigas' },
    beach: { name: 'A Praia', description: 'Praias arenosas' },
    mountain: { name: 'A Montanha', description: 'Picos imponentes' },
    
    north: 'Norte',
    south: 'Sul',
    east: 'Leste',
    west: 'Oeste',
  },
};

/**
 * Get translation for a place
 */
export function getPlaceTranslation(
  placeId: string, 
  languageCode: string = 'en'
): PlaceTranslation {
  const langTranslations = PLACE_TRANSLATIONS[languageCode] || PLACE_TRANSLATIONS.en;
  
  // Try to get the translation, fall back to English
  const translation = (langTranslations as Record<string, PlaceTranslation | string>)[placeId] as PlaceTranslation | undefined;
  if (translation && typeof translation === 'object') return translation;
  
  // Fall back to English
  const englishTranslation = (PLACE_TRANSLATIONS.en as Record<string, PlaceTranslation | string>)[placeId] as PlaceTranslation | undefined;
  if (englishTranslation && typeof englishTranslation === 'object') return englishTranslation;
  
  // Last resort: return the placeId as the name
  return { name: placeId, description: '' };
}

/**
 * Get direction translation
 */
export function getDirectionTranslation(
  direction: 'north' | 'south' | 'east' | 'west',
  languageCode: string = 'en'
): string {
  const langTranslations = PLACE_TRANSLATIONS[languageCode] || PLACE_TRANSLATIONS.en;
  return langTranslations[direction] || PLACE_TRANSLATIONS.en[direction];
}
