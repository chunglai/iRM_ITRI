import { Injectable } from '@angular/core';
import { ScaleType, Color } from '@swimlane/ngx-charts';

@Injectable({
  providedIn: 'root'
})
export class ColorService {
  private predefinedColors = [
    '#FF4500', // Orange Red
    '#32CD32', // Lime Green
    '#1E90FF', // Dodger Blue
    '#FFD700', // Gold
    '#FF69B4', // Hot Pink
    '#8A2BE2', // Blue Violet
    '#00CED1', // Dark Turquoise
    '#FF6347', // Tomato
    '#4682B4', // Steel Blue
    '#7FFF00', // Chartreuse
    '#DC143C', // Crimson
    '#00FA9A', // Medium Spring Green
    '#FF1493', // Deep Pink
    '#00BFFF', // Deep Sky Blue
    '#FF8C00', // Dark Orange
    '#8B0000', // Dark Red
    '#ADFF2F', // Green Yellow
    '#20B2AA', // Light Sea Green
    '#9370DB', // Medium Purple
    '#FFB6C1'  // Light Pink
  ];

  private getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  getColorScheme(dataLength: number): Color {
    let colorDomain = [...this.predefinedColors];
    if (dataLength > this.predefinedColors.length) {
      const additionalColors = dataLength - this.predefinedColors.length;
      for (let i = 0; i < additionalColors; i++) {
        colorDomain.push(this.getRandomColor());
      }
    }
    return {
      name: 'dynamic',
      selectable: true,
      group: ScaleType.Ordinal,
      domain: colorDomain
    };
  }
}
