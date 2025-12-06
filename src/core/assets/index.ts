/**
 * Asset System Index
 * 
 * Central export for all asset-related functionality.
 */

export { AssetRegistry, getAssetVisual, AssetIds } from './AssetRegistry';
export type { Asset, AssetType } from './AssetRegistry';

export { AudioRegistry, AudioIds } from './AudioRegistry';
export type { AudioAsset, AudioType, AudioFormat } from './AudioRegistry';

export { Sprite, Tile, Character } from './Sprite';
export type { SpriteProps, TileProps, CharacterProps } from './Sprite';
