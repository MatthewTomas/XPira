/**
 * Asset Registry
 * 
 * Centralized system for all visual assets in XPira.
 * Currently uses emoji as placeholders - designed for easy swap to custom art.
 * 
 * Asset ID format: category.subcategory.name
 * Examples: player.default, npc.vendor.rosa, tile.terrain.grass
 */

export type AssetType = 'emoji' | 'image' | 'svg' | 'spritesheet';

export interface Asset {
  id: string;
  type: AssetType;
  // For emoji type
  emoji?: string;
  // For image/svg type
  src?: string;
  // For spritesheet type
  sheet?: string;
  frame?: { x: number; y: number; width: number; height: number };
  // Display properties
  defaultSize?: number;
  // Animation frames (for future use)
  frames?: string[];
  frameRate?: number;
}

// ============================================================================
// ASSET DEFINITIONS
// Organized by category for easy management
// ============================================================================

const PLAYER_ASSETS: Record<string, Asset> = {
  'player.default': { id: 'player.default', type: 'emoji', emoji: '🧑‍🎓', defaultSize: 32 },
  'player.wizard': { id: 'player.wizard', type: 'emoji', emoji: '🧙', defaultSize: 32 },
  'player.elf': { id: 'player.elf', type: 'emoji', emoji: '🧝', defaultSize: 32 },
  'player.hero': { id: 'player.hero', type: 'emoji', emoji: '🦸', defaultSize: 32 },
  'player.ninja': { id: 'player.ninja', type: 'emoji', emoji: '🥷', defaultSize: 32 },
  'player.astronaut': { id: 'player.astronaut', type: 'emoji', emoji: '👨‍🚀', defaultSize: 32 },
  'player.farmer': { id: 'player.farmer', type: 'emoji', emoji: '🧑‍🌾', defaultSize: 32 },
  'player.artist': { id: 'player.artist', type: 'emoji', emoji: '🧑‍🎨', defaultSize: 32 },
  'player.scientist': { id: 'player.scientist', type: 'emoji', emoji: '🧑‍🔬', defaultSize: 32 },
  'player.coder': { id: 'player.coder', type: 'emoji', emoji: '🧑‍💻', defaultSize: 32 },
  'player.fox': { id: 'player.fox', type: 'emoji', emoji: '🦊', defaultSize: 32 },
  'player.cat': { id: 'player.cat', type: 'emoji', emoji: '🐱', defaultSize: 32 },
  'player.bunny': { id: 'player.bunny', type: 'emoji', emoji: '🐰', defaultSize: 32 },
};

const NPC_ASSETS: Record<string, Asset> = {
  // Vendors
  'npc.vendor.farmer': { id: 'npc.vendor.farmer', type: 'emoji', emoji: '👩‍🌾', defaultSize: 36 },
  'npc.vendor.chef': { id: 'npc.vendor.chef', type: 'emoji', emoji: '👨‍🍳', defaultSize: 36 },
  'npc.vendor.cook': { id: 'npc.vendor.cook', type: 'emoji', emoji: '🧑‍🍳', defaultSize: 36 },
  'npc.vendor.mechanic': { id: 'npc.vendor.mechanic', type: 'emoji', emoji: '👩‍🔧', defaultSize: 36 },
  'npc.vendor.worker': { id: 'npc.vendor.worker', type: 'emoji', emoji: '🧑‍🏭', defaultSize: 36 },
  // Teachers
  'npc.teacher.default': { id: 'npc.teacher.default', type: 'emoji', emoji: '👩‍🏫', defaultSize: 36 },
  'npc.teacher.male': { id: 'npc.teacher.male', type: 'emoji', emoji: '👨‍🏫', defaultSize: 36 },
  'npc.teacher.elder': { id: 'npc.teacher.elder', type: 'emoji', emoji: '👴', defaultSize: 36 },
  'npc.teacher.elderwoman': { id: 'npc.teacher.elderwoman', type: 'emoji', emoji: '👵', defaultSize: 36 },
  'npc.teacher.wizard': { id: 'npc.teacher.wizard', type: 'emoji', emoji: '🧙‍♂️', defaultSize: 36 },
  // Citizens
  'npc.citizen.default': { id: 'npc.citizen.default', type: 'emoji', emoji: '🧑', defaultSize: 36 },
  'npc.citizen.woman': { id: 'npc.citizen.woman', type: 'emoji', emoji: '👩', defaultSize: 36 },
  'npc.citizen.man': { id: 'npc.citizen.man', type: 'emoji', emoji: '👨', defaultSize: 36 },
  'npc.citizen.child': { id: 'npc.citizen.child', type: 'emoji', emoji: '🧒', defaultSize: 36 },
  // Special
  'npc.special.princess': { id: 'npc.special.princess', type: 'emoji', emoji: '👸', defaultSize: 36 },
  'npc.special.prince': { id: 'npc.special.prince', type: 'emoji', emoji: '🤴', defaultSize: 36 },
  'npc.special.fairy': { id: 'npc.special.fairy', type: 'emoji', emoji: '🧚', defaultSize: 36 },
};

const EXPRESSION_ASSETS: Record<string, Asset> = {
  'expression.happy': { id: 'expression.happy', type: 'emoji', emoji: '😊', defaultSize: 16 },
  'expression.excited': { id: 'expression.excited', type: 'emoji', emoji: '😃', defaultSize: 16 },
  'expression.thinking': { id: 'expression.thinking', type: 'emoji', emoji: '🤔', defaultSize: 16 },
  'expression.surprised': { id: 'expression.surprised', type: 'emoji', emoji: '😮', defaultSize: 16 },
  'expression.angry': { id: 'expression.angry', type: 'emoji', emoji: '😠', defaultSize: 16 },
  'expression.sad': { id: 'expression.sad', type: 'emoji', emoji: '😢', defaultSize: 16 },
  'expression.love': { id: 'expression.love', type: 'emoji', emoji: '🤩', defaultSize: 16 },
  'expression.sleepy': { id: 'expression.sleepy', type: 'emoji', emoji: '😴', defaultSize: 16 },
  'expression.hug': { id: 'expression.hug', type: 'emoji', emoji: '🤗', defaultSize: 16 },
  // Gestures (great for teaching!)
  'gesture.wave': { id: 'gesture.wave', type: 'emoji', emoji: '👋', defaultSize: 16 },
  'gesture.point.up': { id: 'gesture.point.up', type: 'emoji', emoji: '👆', defaultSize: 16 },
  'gesture.point.right': { id: 'gesture.point.right', type: 'emoji', emoji: '👉', defaultSize: 16 },
  'gesture.point.down': { id: 'gesture.point.down', type: 'emoji', emoji: '👇', defaultSize: 16 },
  'gesture.point.left': { id: 'gesture.point.left', type: 'emoji', emoji: '👈', defaultSize: 16 },
  'gesture.celebrate': { id: 'gesture.celebrate', type: 'emoji', emoji: '🙌', defaultSize: 16 },
  'gesture.thumbsup': { id: 'gesture.thumbsup', type: 'emoji', emoji: '👍', defaultSize: 16 },
  'gesture.clap': { id: 'gesture.clap', type: 'emoji', emoji: '👏', defaultSize: 16 },
  // Speech bubbles
  'bubble.question': { id: 'bubble.question', type: 'emoji', emoji: '❓', defaultSize: 16 },
  'bubble.exclaim': { id: 'bubble.exclaim', type: 'emoji', emoji: '❗', defaultSize: 16 },
  'bubble.thought': { id: 'bubble.thought', type: 'emoji', emoji: '💭', defaultSize: 16 },
  'bubble.speech': { id: 'bubble.speech', type: 'emoji', emoji: '💬', defaultSize: 16 },
  'bubble.sparkle': { id: 'bubble.sparkle', type: 'emoji', emoji: '✨', defaultSize: 16 },
};

const TILE_ASSETS: Record<string, Asset> = {
  // Terrain
  'tile.terrain.grass': { id: 'tile.terrain.grass', type: 'emoji', emoji: '🌿', defaultSize: 40 },
  'tile.terrain.grass.alt': { id: 'tile.terrain.grass.alt', type: 'emoji', emoji: '🌱', defaultSize: 40 },
  'tile.terrain.clover': { id: 'tile.terrain.clover', type: 'emoji', emoji: '🍀', defaultSize: 40 },
  'tile.terrain.wheat': { id: 'tile.terrain.wheat', type: 'emoji', emoji: '🌾', defaultSize: 40 },
  'tile.terrain.desert': { id: 'tile.terrain.desert', type: 'emoji', emoji: '🏜️', defaultSize: 40 },
  'tile.terrain.snow': { id: 'tile.terrain.snow', type: 'emoji', emoji: '❄️', defaultSize: 40 },
  'tile.terrain.water': { id: 'tile.terrain.water', type: 'emoji', emoji: '🌊', defaultSize: 40 },
  'tile.terrain.water.drop': { id: 'tile.terrain.water.drop', type: 'emoji', emoji: '💧', defaultSize: 40 },
  'tile.terrain.sand': { id: 'tile.terrain.sand', type: 'emoji', emoji: '🏖️', defaultSize: 40 },
  // Nature
  'tile.nature.tree': { id: 'tile.nature.tree', type: 'emoji', emoji: '🌳', defaultSize: 40 },
  'tile.nature.pine': { id: 'tile.nature.pine', type: 'emoji', emoji: '🌲', defaultSize: 40 },
  'tile.nature.palm': { id: 'tile.nature.palm', type: 'emoji', emoji: '🌴', defaultSize: 40 },
  'tile.nature.cactus': { id: 'tile.nature.cactus', type: 'emoji', emoji: '🌵', defaultSize: 40 },
  'tile.nature.rock': { id: 'tile.nature.rock', type: 'emoji', emoji: '🪨', defaultSize: 40 },
  'tile.nature.mountain': { id: 'tile.nature.mountain', type: 'emoji', emoji: '⛰️', defaultSize: 40 },
  'tile.nature.flower.cherry': { id: 'tile.nature.flower.cherry', type: 'emoji', emoji: '🌸', defaultSize: 40 },
  'tile.nature.flower.sunflower': { id: 'tile.nature.flower.sunflower', type: 'emoji', emoji: '🌻', defaultSize: 40 },
  'tile.nature.flower.tulip': { id: 'tile.nature.flower.tulip', type: 'emoji', emoji: '🌷', defaultSize: 40 },
  'tile.nature.flower.hibiscus': { id: 'tile.nature.flower.hibiscus', type: 'emoji', emoji: '🌺', defaultSize: 40 },
  'tile.nature.mushroom': { id: 'tile.nature.mushroom', type: 'emoji', emoji: '🍄', defaultSize: 40 },
  // Paths
  'tile.path.dirt': { id: 'tile.path.dirt', type: 'emoji', emoji: '🟫', defaultSize: 40 },
  'tile.path.stone': { id: 'tile.path.stone', type: 'emoji', emoji: '⬛', defaultSize: 40 },
  'tile.path.sand': { id: 'tile.path.sand', type: 'emoji', emoji: '🟨', defaultSize: 40 },
  'tile.path.white': { id: 'tile.path.white', type: 'emoji', emoji: '⬜', defaultSize: 40 },
  'tile.path.brick': { id: 'tile.path.brick', type: 'emoji', emoji: '🧱', defaultSize: 40 },
};

const BUILDING_ASSETS: Record<string, Asset> = {
  'building.home': { id: 'building.home', type: 'emoji', emoji: '🏠', defaultSize: 48 },
  'building.home.garden': { id: 'building.home.garden', type: 'emoji', emoji: '🏡', defaultSize: 48 },
  'building.office': { id: 'building.office', type: 'emoji', emoji: '🏢', defaultSize: 48 },
  'building.townhall': { id: 'building.townhall', type: 'emoji', emoji: '🏛️', defaultSize: 48 },
  'building.market': { id: 'building.market', type: 'emoji', emoji: '🏪', defaultSize: 48 },
  'building.hospital': { id: 'building.hospital', type: 'emoji', emoji: '🏥', defaultSize: 48 },
  'building.library': { id: 'building.library', type: 'emoji', emoji: '📚', defaultSize: 48 },
  'building.gym': { id: 'building.gym', type: 'emoji', emoji: '🏋️', defaultSize: 48 },
  'building.temple': { id: 'building.temple', type: 'emoji', emoji: '⛩️', defaultSize: 48 },
  'building.theater': { id: 'building.theater', type: 'emoji', emoji: '🎭', defaultSize: 48 },
  'building.castle': { id: 'building.castle', type: 'emoji', emoji: '🏰', defaultSize: 48 },
  'building.church': { id: 'building.church', type: 'emoji', emoji: '⛪', defaultSize: 48 },
  'building.mosque': { id: 'building.mosque', type: 'emoji', emoji: '🕌', defaultSize: 48 },
  'building.synagogue': { id: 'building.synagogue', type: 'emoji', emoji: '🕍', defaultSize: 48 },
  // Building progression stages
  'building.stage.foundation': { id: 'building.stage.foundation', type: 'emoji', emoji: '📍', defaultSize: 48 },
  'building.stage.camp': { id: 'building.stage.camp', type: 'emoji', emoji: '🏕️', defaultSize: 48 },
  'building.stage.house': { id: 'building.stage.house', type: 'emoji', emoji: '🏠', defaultSize: 48 },
  'building.stage.castle': { id: 'building.stage.castle', type: 'emoji', emoji: '🏰', defaultSize: 48 },
};

const DECORATION_ASSETS: Record<string, Asset> = {
  'decoration.fountain': { id: 'decoration.fountain', type: 'emoji', emoji: '⛲', defaultSize: 40 },
  'decoration.bench': { id: 'decoration.bench', type: 'emoji', emoji: '🪑', defaultSize: 40 },
  'decoration.plant': { id: 'decoration.plant', type: 'emoji', emoji: '🪴', defaultSize: 40 },
  'decoration.lantern': { id: 'decoration.lantern', type: 'emoji', emoji: '🏮', defaultSize: 40 },
  'decoration.tent': { id: 'decoration.tent', type: 'emoji', emoji: '🎪', defaultSize: 40 },
  'decoration.ferriswheel': { id: 'decoration.ferriswheel', type: 'emoji', emoji: '🎡', defaultSize: 40 },
  'decoration.rollercoaster': { id: 'decoration.rollercoaster', type: 'emoji', emoji: '🎢', defaultSize: 40 },
  'decoration.statue': { id: 'decoration.statue', type: 'emoji', emoji: '🗿', defaultSize: 40 },
  'decoration.well': { id: 'decoration.well', type: 'emoji', emoji: '🪣', defaultSize: 40 },
};

const ITEM_ASSETS: Record<string, Asset> = {
  // General
  'item.box': { id: 'item.box', type: 'emoji', emoji: '📦', defaultSize: 32 },
  'item.coins': { id: 'item.coins', type: 'emoji', emoji: '💰', defaultSize: 32 },
  'item.gift': { id: 'item.gift', type: 'emoji', emoji: '🎁', defaultSize: 32 },
  'item.key': { id: 'item.key', type: 'emoji', emoji: '🔑', defaultSize: 32 },
  'item.gem': { id: 'item.gem', type: 'emoji', emoji: '💎', defaultSize: 32 },
  // Equipment
  'item.sword': { id: 'item.sword', type: 'emoji', emoji: '⚔️', defaultSize: 32 },
  'item.shield': { id: 'item.shield', type: 'emoji', emoji: '🛡️', defaultSize: 32 },
  'item.bow': { id: 'item.bow', type: 'emoji', emoji: '🏹', defaultSize: 32 },
  'item.wand': { id: 'item.wand', type: 'emoji', emoji: '🪄', defaultSize: 32 },
  // Food (for marketplace/learning)
  'item.food.apple': { id: 'item.food.apple', type: 'emoji', emoji: '🍎', defaultSize: 32 },
  'item.food.orange': { id: 'item.food.orange', type: 'emoji', emoji: '🍊', defaultSize: 32 },
  'item.food.grape': { id: 'item.food.grape', type: 'emoji', emoji: '🍇', defaultSize: 32 },
  'item.food.banana': { id: 'item.food.banana', type: 'emoji', emoji: '🍌', defaultSize: 32 },
  'item.food.bread': { id: 'item.food.bread', type: 'emoji', emoji: '🍞', defaultSize: 32 },
  'item.food.croissant': { id: 'item.food.croissant', type: 'emoji', emoji: '🥐', defaultSize: 32 },
  'item.food.cheese': { id: 'item.food.cheese', type: 'emoji', emoji: '🧀', defaultSize: 32 },
  'item.food.egg': { id: 'item.food.egg', type: 'emoji', emoji: '🥚', defaultSize: 32 },
  'item.food.carrot': { id: 'item.food.carrot', type: 'emoji', emoji: '🥕', defaultSize: 32 },
  'item.food.tomato': { id: 'item.food.tomato', type: 'emoji', emoji: '🍅', defaultSize: 32 },
  // Books/learning
  'item.book': { id: 'item.book', type: 'emoji', emoji: '📖', defaultSize: 32 },
  'item.pencil': { id: 'item.pencil', type: 'emoji', emoji: '✏️', defaultSize: 32 },
  'item.scroll': { id: 'item.scroll', type: 'emoji', emoji: '📜', defaultSize: 32 },
  // Potions
  'item.potion': { id: 'item.potion', type: 'emoji', emoji: '🧪', defaultSize: 32 },
};

const UI_ASSETS: Record<string, Asset> = {
  // Attributes
  'ui.attr.str': { id: 'ui.attr.str', type: 'emoji', emoji: '💪', defaultSize: 24 },
  'ui.attr.dex': { id: 'ui.attr.dex', type: 'emoji', emoji: '🎯', defaultSize: 24 },
  'ui.attr.con': { id: 'ui.attr.con', type: 'emoji', emoji: '❤️', defaultSize: 24 },
  'ui.attr.int': { id: 'ui.attr.int', type: 'emoji', emoji: '📚', defaultSize: 24 },
  'ui.attr.wis': { id: 'ui.attr.wis', type: 'emoji', emoji: '🧘', defaultSize: 24 },
  'ui.attr.cha': { id: 'ui.attr.cha', type: 'emoji', emoji: '💬', defaultSize: 24 },
  // Navigation
  'ui.nav.settings': { id: 'ui.nav.settings', type: 'emoji', emoji: '⚙️', defaultSize: 24 },
  'ui.nav.stats': { id: 'ui.nav.stats', type: 'emoji', emoji: '📊', defaultSize: 24 },
  'ui.nav.map': { id: 'ui.nav.map', type: 'emoji', emoji: '🗺️', defaultSize: 24 },
  'ui.nav.inventory': { id: 'ui.nav.inventory', type: 'emoji', emoji: '🎒', defaultSize: 24 },
  'ui.nav.home': { id: 'ui.nav.home', type: 'emoji', emoji: '🏠', defaultSize: 24 },
  // Actions
  'ui.action.speak': { id: 'ui.action.speak', type: 'emoji', emoji: '🎤', defaultSize: 24 },
  'ui.action.listen': { id: 'ui.action.listen', type: 'emoji', emoji: '👂', defaultSize: 24 },
  'ui.action.confirm': { id: 'ui.action.confirm', type: 'emoji', emoji: '✅', defaultSize: 24 },
  'ui.action.cancel': { id: 'ui.action.cancel', type: 'emoji', emoji: '❌', defaultSize: 24 },
  // Status
  'ui.status.star': { id: 'ui.status.star', type: 'emoji', emoji: '⭐', defaultSize: 24 },
  'ui.status.xp': { id: 'ui.status.xp', type: 'emoji', emoji: '✨', defaultSize: 24 },
  'ui.status.coin': { id: 'ui.status.coin', type: 'emoji', emoji: '🪙', defaultSize: 24 },
  'ui.status.heart': { id: 'ui.status.heart', type: 'emoji', emoji: '❤️', defaultSize: 24 },
  'ui.status.fire': { id: 'ui.status.fire', type: 'emoji', emoji: '🔥', defaultSize: 24 },
};

// ============================================================================
// COMBINED REGISTRY
// ============================================================================

const ALL_ASSETS: Record<string, Asset> = {
  ...PLAYER_ASSETS,
  ...NPC_ASSETS,
  ...EXPRESSION_ASSETS,
  ...TILE_ASSETS,
  ...BUILDING_ASSETS,
  ...DECORATION_ASSETS,
  ...ITEM_ASSETS,
  ...UI_ASSETS,
};

// ============================================================================
// ASSET REGISTRY CLASS
// ============================================================================

class AssetRegistryClass {
  private assets: Map<string, Asset> = new Map();
  private loadedImages: Map<string, HTMLImageElement> = new Map();

  constructor() {
    // Load all default assets
    Object.values(ALL_ASSETS).forEach(asset => {
      this.assets.set(asset.id, asset);
    });
  }

  /**
   * Get an asset by ID
   */
  get(id: string): Asset | undefined {
    return this.assets.get(id);
  }

  /**
   * Get the emoji for an asset (for current emoji-based rendering)
   */
  getEmoji(id: string): string {
    const asset = this.assets.get(id);
    if (!asset) {
      console.warn(`Asset not found: ${id}`);
      return '❓';
    }
    if (asset.type === 'emoji') {
      return asset.emoji || '❓';
    }
    // For image-based assets, return a placeholder emoji
    return '🖼️';
  }

  /**
   * Get the source URL for an image asset
   */
  getImageSrc(id: string): string | undefined {
    const asset = this.assets.get(id);
    return asset?.src;
  }

  /**
   * Get default size for an asset
   */
  getDefaultSize(id: string): number {
    const asset = this.assets.get(id);
    return asset?.defaultSize || 32;
  }

  /**
   * Register a new asset (for custom art)
   */
  register(asset: Asset): void {
    this.assets.set(asset.id, asset);
  }

  /**
   * Override an existing asset with custom art
   */
  override(id: string, overrides: Partial<Asset>): void {
    const existing = this.assets.get(id);
    if (existing) {
      this.assets.set(id, { ...existing, ...overrides });
    }
  }

  /**
   * Preload image assets
   */
  async preloadImages(): Promise<void> {
    const imageAssets = Array.from(this.assets.values())
      .filter(a => a.type === 'image' && a.src);

    await Promise.all(
      imageAssets.map(asset => this.loadImage(asset.id, asset.src!))
    );
  }

  private loadImage(id: string, src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.loadedImages.set(id, img);
        resolve();
      };
      img.onerror = reject;
      img.src = src;
    });
  }

  /**
   * Get loaded image element
   */
  getImage(id: string): HTMLImageElement | undefined {
    return this.loadedImages.get(id);
  }

  /**
   * Get all assets in a category
   */
  getCategory(prefix: string): Asset[] {
    return Array.from(this.assets.values())
      .filter(a => a.id.startsWith(prefix));
  }

  /**
   * Check if an asset has custom (non-emoji) art
   */
  hasCustomArt(id: string): boolean {
    const asset = this.assets.get(id);
    return asset?.type !== 'emoji';
  }

  /**
   * Export all asset IDs (for documentation)
   */
  getAllIds(): string[] {
    return Array.from(this.assets.keys()).sort();
  }
}

// Singleton instance
export const AssetRegistry = new AssetRegistryClass();

// ============================================================================
// HELPER HOOKS & COMPONENTS
// ============================================================================

/**
 * Get an asset's visual representation for rendering
 * Returns emoji string for now, will return React component later
 */
export function getAssetVisual(id: string, _size?: number): string {
  return AssetRegistry.getEmoji(id);
}

/**
 * Asset ID constants for type safety
 */
export const AssetIds = {
  player: {
    default: 'player.default',
    wizard: 'player.wizard',
    elf: 'player.elf',
    hero: 'player.hero',
    ninja: 'player.ninja',
  },
  npc: {
    vendor: {
      farmer: 'npc.vendor.farmer',
      chef: 'npc.vendor.chef',
    },
    teacher: {
      default: 'npc.teacher.default',
      elder: 'npc.teacher.elder',
    },
  },
  tile: {
    grass: 'tile.terrain.grass',
    water: 'tile.terrain.water',
    tree: 'tile.nature.tree',
    path: 'tile.path.dirt',
  },
  building: {
    home: 'building.home',
    market: 'building.market',
    library: 'building.library',
  },
  gesture: {
    pointUp: 'gesture.point.up',
    pointRight: 'gesture.point.right',
    wave: 'gesture.wave',
  },
} as const;
