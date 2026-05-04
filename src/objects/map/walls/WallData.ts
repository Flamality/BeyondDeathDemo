import type { WallDef } from "../../../context/MapEditor";

export const baseWalls: WallDef[] = [
  // EXTENDED HALLWAY
  { position: [0, 0, 20], length: 20 },
  { position: [-4, 0, 20], length: 20 },

  // Room M223
  { position: [4, 0, 0], width: 8 },
  { position: [8, 0, 5], length: 10 },
  { position: [4, 0, 10], width: 8 },
  { position: [0, 0, 2.75], length: 5.5 },
  { position: [0, 0, 8.75], length: 2.5 },

  // Room M221
  { position: [8, 0, -5], length: 10 },
  { position: [4, 0, -10], width: 8 },
  { position: [0, 0, -7.25], length: 5.5 },
  { position: [0, 0, -1.25], length: 2.5 },

  // Room M222
  { position: [-8, 0, 0], width: 8 },
  { position: [-12, 0, 5], length: 10 },
  { position: [-8, 0, 10], width: 8 },
  { position: [-4, 0, 2.75], length: 5.5 },
  { position: [-4, 0, 8.75], length: 2.5 },

  // Room M220
  { position: [-12, 0, -5], length: 10 },
  { position: [-5, 0, -10], width: 2 },
  { position: [-11, 0, -10], width: 6 },
  { position: [-4, 0, -7.25], length: 5.5 },
  { position: [-4, 0, -1.25], length: 2.5 },

  // Bathroom
  { position: [-8, 0, -18], width: 8 },
  { position: [-12, 0, -14], length: 8 },
  { position: [-4, 0, -14], length: 8 },

  // Stairwell
  { position: [-4, 0, -18.25], length: 0.5 },
  { position: [-4, 0, -23.75], length: 0.5 },
  { position: [-7, 0, -21], width: 6 },
  { position: [-7, 0, -24], width: 6 },
  { position: [-7, 0, -21], width: 6, floor: 0.5 },
  { position: [-7, 0, -24], width: 6, floor: 0.5 },

  { position: [-14, 0, -22], length: 20 },
  { position: [-14, 0, -22], length: 20, floor: 0.5 },

  // Hallway Endcap
  { position: [-4, 0, -26], length: 4 },
  { position: [-2, 0, -28], width: 4 },

  // Closet
  { position: [0, 0, -11], length: 2 },
  { position: [0, 0, -15], length: 2 },
  { position: [5, 0, -16], width: 10 },
  { position: [4, 0, -13], length: 6 },

  // Nurse area
  { position: [5, 0, -28], width: 10 },
  { position: [10, 0, -22], length: 12 },
  { position: [0, 0, -19], length: 6 },
  { position: [0, 0, -93.5], length: 1 },
  { position: [0, 0, -28], length: 4 },

  { position: [3.5, 0, -18], length: 4 },
  { position: [6.5, 0, -18], length: 4 },
];
