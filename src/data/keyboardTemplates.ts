import { ConceptKey } from '../types';

export interface KeyboardTemplate {
  id: string;
  name: string;
  description: string;
  category: 'integrated' | 'split';
  keys: Omit<ConceptKey, 'id'>[];
}

// Helper function to generate default key
const createKey = (x: number, y: number, w = 1, h = 1): Omit<ConceptKey, 'id'> => ({
  x,
  y,
  w,
  h,
  color: '#f0f0f0',
  labelStyle: '1',
  labels: ['KC_NO', 'KC_NO', 'KC_NO', 'KC_NO'],
});

export const keyboardTemplates: KeyboardTemplate[] = [
  // === 一体型 ===
  {
    id: '60-percent',
    name: '60%キーボード',
    description: '61キー、コンパクトな一体型レイアウト',
    category: 'integrated',
    keys: [
      // Row 0 (数字行)
      ...Array.from({ length: 14 }, (_, i) => createKey(i, 0)),

      // Row 1
      createKey(0, 1, 1.5), // Tab
      ...Array.from({ length: 12 }, (_, i) => createKey(1.5 + i, 1)),
      createKey(13.5, 1, 1.5), // Backslash

      // Row 2
      createKey(0, 2, 1.75), // Caps
      ...Array.from({ length: 11 }, (_, i) => createKey(1.75 + i, 2)),
      createKey(12.75, 2, 2.25), // Enter

      // Row 3
      createKey(0, 3, 2.25), // Shift
      ...Array.from({ length: 10 }, (_, i) => createKey(2.25 + i, 3)),
      createKey(12.25, 3, 2.75), // Right Shift

      // Row 4
      createKey(0, 4, 1.25), // Ctrl
      createKey(1.25, 4, 1.25), // Win
      createKey(2.5, 4, 1.25), // Alt
      createKey(3.75, 4, 6.25), // Space
      createKey(10, 4, 1.25), // Alt
      createKey(11.25, 4, 1.25), // Win
      createKey(12.5, 4, 1.25), // Menu
      createKey(13.75, 4, 1.25), // Ctrl
    ],
  },

  {
    id: '40-percent',
    name: '40%キーボード',
    description: '48キー、超コンパクトな一体型',
    category: 'integrated',
    keys: [
      // Row 0
      ...Array.from({ length: 12 }, (_, i) => createKey(i, 0)),

      // Row 1
      createKey(0, 1, 1.25),
      ...Array.from({ length: 10 }, (_, i) => createKey(1.25 + i, 1)),
      createKey(11.25, 1, 1.75),

      // Row 2
      createKey(0, 2, 1.75),
      ...Array.from({ length: 10 }, (_, i) => createKey(1.75 + i, 2)),
      createKey(11.75, 2, 1.25),

      // Row 3
      createKey(0, 3, 1.25),
      createKey(1.25, 3, 1.25),
      createKey(2.5, 3, 1.25),
      createKey(3.75, 3, 6.25),
      createKey(10, 3, 1.25),
      createKey(11.25, 3, 1.75),
    ],
  },

  // === 分割型 ===
  {
    id: 'corne-3x6',
    name: 'Corne 3x6（42キー）',
    description: '人気の分割型、3行6列 + 親指3キー',
    category: 'split',
    keys: [
      // 左手
      // Row 0
      ...Array.from({ length: 6 }, (_, i) => createKey(i, 0)),
      // Row 1
      ...Array.from({ length: 6 }, (_, i) => createKey(i, 1)),
      // Row 2
      ...Array.from({ length: 6 }, (_, i) => createKey(i, 2)),
      // 親指
      createKey(2, 3),
      createKey(3, 3),
      createKey(4, 3),

      // 右手
      // Row 0
      ...Array.from({ length: 6 }, (_, i) => createKey(8 + i, 0)),
      // Row 1
      ...Array.from({ length: 6 }, (_, i) => createKey(8 + i, 1)),
      // Row 2
      ...Array.from({ length: 6 }, (_, i) => createKey(8 + i, 2)),
      // 親指
      createKey(9, 3),
      createKey(10, 3),
      createKey(11, 3),
    ],
  },

  {
    id: 'ergodox-style',
    name: 'Ergodox風',
    description: '本格的な分割エルゴノミックキーボード',
    category: 'split',
    keys: [
      // 左手
      // Row 0
      createKey(0, 0, 1.5),
      ...Array.from({ length: 5 }, (_, i) => createKey(1.5 + i, 0)),
      createKey(6.5, 0),

      // Row 1
      createKey(0, 1, 1.5),
      ...Array.from({ length: 5 }, (_, i) => createKey(1.5 + i, 1)),
      createKey(6.5, 1),

      // Row 2
      createKey(0, 2, 1.5),
      ...Array.from({ length: 5 }, (_, i) => createKey(1.5 + i, 2)),

      // Row 3
      createKey(0, 3, 1.5),
      ...Array.from({ length: 5 }, (_, i) => createKey(1.5 + i, 3)),
      createKey(6.5, 3),

      // Row 4 (下段)
      createKey(0.5, 4),
      createKey(1.5, 4),
      createKey(2.5, 4),
      createKey(3.5, 4),
      createKey(4.5, 4),

      // 親指クラスタ
      createKey(5.5, 5),
      createKey(6.5, 5),
      createKey(5.5, 6),
      createKey(6.5, 6),
      createKey(5.5, 7, 2),

      // 右手
      // Row 0
      createKey(10, 0),
      ...Array.from({ length: 5 }, (_, i) => createKey(11 + i, 0)),
      createKey(16, 0, 1.5),

      // Row 1
      createKey(10, 1),
      ...Array.from({ length: 5 }, (_, i) => createKey(11 + i, 1)),
      createKey(16, 1, 1.5),

      // Row 2
      ...Array.from({ length: 5 }, (_, i) => createKey(11 + i, 2)),
      createKey(16, 2, 1.5),

      // Row 3
      createKey(10, 3),
      ...Array.from({ length: 5 }, (_, i) => createKey(11 + i, 3)),
      createKey(16, 3, 1.5),

      // Row 4
      createKey(12, 4),
      createKey(13, 4),
      createKey(14, 4),
      createKey(15, 4),
      createKey(16, 4),

      // 親指クラスタ
      createKey(10, 5),
      createKey(11, 5),
      createKey(10, 6),
      createKey(11, 6),
      createKey(10, 7, 2),
    ],
  },

  {
    id: 'simple-split',
    name: 'シンプル分割型',
    description: '左右対称の小型分割キーボード（各手30キー）',
    category: 'split',
    keys: [
      // 左手
      ...Array.from({ length: 5 }, (_, i) => createKey(i, 0)),
      ...Array.from({ length: 5 }, (_, i) => createKey(i, 1)),
      ...Array.from({ length: 5 }, (_, i) => createKey(i, 2)),
      // 小指列下
      createKey(0, 3),
      // 親指
      createKey(2, 4),
      createKey(3, 4),
      createKey(4, 4),

      // 右手
      ...Array.from({ length: 5 }, (_, i) => createKey(7 + i, 0)),
      ...Array.from({ length: 5 }, (_, i) => createKey(7 + i, 1)),
      ...Array.from({ length: 5 }, (_, i) => createKey(7 + i, 2)),
      // 小指列下
      createKey(11, 3),
      // 親指
      createKey(7, 4),
      createKey(8, 4),
      createKey(9, 4),
    ],
  },
];
