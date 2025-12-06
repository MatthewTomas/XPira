/**
 * Sprite Component
 * 
 * Renders an asset from the registry.
 * Automatically handles emoji vs image rendering.
 * 
 * Usage:
 *   <Sprite id="player.default" size={32} />
 *   <Sprite id="npc.vendor.farmer" size={48} glow />
 */

import React from 'react';
import { AssetRegistry } from './AssetRegistry';

export interface SpriteProps {
  /** Asset ID from the registry */
  id: string;
  /** Size in pixels (overrides default) */
  size?: number;
  /** Additional CSS class */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
  /** Add golden glow effect */
  glow?: boolean;
  /** Add drop shadow */
  shadow?: boolean;
  /** Shadow intensity (0-1) */
  shadowIntensity?: number;
  /** Apply bounce animation */
  bounce?: boolean;
  /** Flip horizontally */
  flipX?: boolean;
  /** Scale on hover */
  hoverScale?: number;
  /** Click handler */
  onClick?: () => void;
  /** Alt text for accessibility */
  alt?: string;
}

export function Sprite({
  id,
  size,
  className = '',
  style = {},
  glow = false,
  shadow = false,
  shadowIntensity = 0.3,
  bounce = false,
  flipX = false,
  hoverScale,
  onClick,
  alt,
}: SpriteProps) {
  const asset = AssetRegistry.get(id);
  const actualSize = size ?? asset?.defaultSize ?? 32;

  if (!asset) {
    console.warn(`Sprite: Asset not found: ${id}`);
    return (
      <span 
        className={className}
        style={{ fontSize: actualSize, ...style }}
        role="img"
        aria-label="Unknown"
      >
        ❓
      </span>
    );
  }

  // Build filter string
  const filters: string[] = [];
  if (shadow) {
    filters.push(`drop-shadow(0 2px 4px rgba(0,0,0,${shadowIntensity}))`);
  }
  if (glow) {
    filters.push('drop-shadow(0 0 8px gold)');
  }

  // Build transform string
  const transforms: string[] = [];
  if (flipX) {
    transforms.push('scaleX(-1)');
  }

  const baseStyle: React.CSSProperties = {
    fontSize: actualSize,
    lineHeight: 1,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    filter: filters.length > 0 ? filters.join(' ') : undefined,
    transform: transforms.length > 0 ? transforms.join(' ') : undefined,
    transition: hoverScale ? 'transform 0.15s ease' : undefined,
    cursor: onClick ? 'pointer' : undefined,
    ...style,
  };

  // Handle hover scale with CSS variable
  const hoverStyle = hoverScale ? {
    '--hover-scale': hoverScale,
  } as React.CSSProperties : {};

  // Emoji rendering
  if (asset.type === 'emoji') {
    return (
      <span
        className={`${className} ${bounce ? 'animate-bounce' : ''} ${hoverScale ? 'hover:scale-110' : ''}`}
        style={{ ...baseStyle, ...hoverStyle }}
        onClick={onClick}
        role="img"
        aria-label={alt || id}
      >
        {asset.emoji}
      </span>
    );
  }

  // Image rendering (for when custom art is added)
  if (asset.type === 'image' && asset.src) {
    return (
      <img
        src={asset.src}
        alt={alt || id}
        className={`${className} ${bounce ? 'animate-bounce' : ''}`}
        style={{
          width: actualSize,
          height: actualSize,
          objectFit: 'contain',
          filter: filters.length > 0 ? filters.join(' ') : undefined,
          transform: transforms.length > 0 ? transforms.join(' ') : undefined,
          ...style,
        }}
        onClick={onClick}
      />
    );
  }

  // SVG rendering
  if (asset.type === 'svg' && asset.src) {
    return (
      <img
        src={asset.src}
        alt={alt || id}
        className={`${className} ${bounce ? 'animate-bounce' : ''}`}
        style={{
          width: actualSize,
          height: actualSize,
          ...style,
        }}
        onClick={onClick}
      />
    );
  }

  // Fallback
  return (
    <span 
      className={className}
      style={{ fontSize: actualSize, ...style }}
      role="img"
      aria-label={alt || 'Asset'}
    >
      🖼️
    </span>
  );
}

/**
 * Tile Component
 * 
 * Renders a tile with consistent sizing and optional content layer.
 */
export interface TileProps {
  /** Tile asset ID */
  tileId: string;
  /** Tile size in pixels */
  size?: number;
  /** Border radius */
  borderRadius?: number;
  /** Background color */
  bgColor?: string;
  /** Content to render on top of tile */
  children?: React.ReactNode;
  /** Click handler */
  onClick?: () => void;
  /** Additional class */
  className?: string;
}

export function Tile({
  tileId,
  size = 40,
  borderRadius = 4,
  bgColor = '#3d5a3d',
  children,
  onClick,
  className = '',
}: TileProps) {
  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor: bgColor,
        borderRadius,
        cursor: onClick ? 'pointer' : undefined,
      }}
      onClick={onClick}
    >
      <Sprite id={tileId} size={size * 0.6} />
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
}

/**
 * Character Component
 * 
 * Renders a character (player or NPC) with expression bubble support.
 */
export interface CharacterProps {
  /** Character asset ID */
  characterId: string;
  /** Character size */
  size?: number;
  /** Expression asset ID (shows as bubble) */
  expressionId?: string;
  /** Expression size */
  expressionSize?: number;
  /** Is nearby/highlighted */
  highlighted?: boolean;
  /** Direction facing */
  direction?: 'left' | 'right';
  /** Show idle animation */
  animated?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Additional class */
  className?: string;
}

export function Character({
  characterId,
  size = 36,
  expressionId,
  expressionSize = 16,
  highlighted = false,
  direction = 'right',
  animated = false,
  onClick,
  className = '',
}: CharacterProps) {
  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{
        cursor: onClick ? 'pointer' : undefined,
      }}
      onClick={onClick}
    >
      <Sprite
        id={characterId}
        size={size}
        glow={highlighted}
        shadow
        bounce={animated}
        flipX={direction === 'left'}
      />
      
      {/* Expression bubble */}
      {expressionId && (
        <div
          className="absolute -top-1 -right-1 bg-white rounded-full flex items-center justify-center shadow-md"
          style={{
            width: expressionSize + 8,
            height: expressionSize + 8,
          }}
        >
          <Sprite id={expressionId} size={expressionSize} />
        </div>
      )}
    </div>
  );
}
