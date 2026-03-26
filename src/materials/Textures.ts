import * as THREE from 'three';

const loader = new THREE.TextureLoader();
function tile(tex: THREE.Texture, x: number, y: number) {
    tex.generateMipmaps = true;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(x, y);
}



const wood_diff = loader.load('/textures/dark_wood_diff_4k.jpg');

tile(wood_diff, 1, 1);

wood_diff.colorSpace = THREE.SRGBColorSpace;

export const texture_wood = new THREE.MeshStandardMaterial({
    map: wood_diff,
    roughness: 1,
    metalness: 0,
});

const concrete_diff = loader.load('/textures/concrete_floor_damaged_01_diff_4k.jpg');

tile(concrete_diff, 2, 2);

concrete_diff.colorSpace = THREE.SRGBColorSpace;

export const texture_concrete = new THREE.MeshStandardMaterial({
    map: concrete_diff,
    roughness: 1,
    metalness: 0,
});


const table_diff = loader.load('/textures/wood_table_worn_diff_4k.jpg');

tile(table_diff, 1, 1);

table_diff.colorSpace = THREE.SRGBColorSpace;

export const texture_table = new THREE.MeshStandardMaterial({
    map: table_diff,
    roughness: 1,
    metalness: 0,
})

const plaster_diff = loader.load('/textures/plastered_wall_03_diff_4k.jpg');

tile(plaster_diff, 1, 1);

plaster_diff.colorSpace = THREE.SRGBColorSpace;

export const texture_plaster = new THREE.MeshStandardMaterial({
    map: plaster_diff,
    roughness: 1,
    metalness: 0,
})

const metal_diff = loader.load('/textures/rusty_metal_04_diff_4k.jpg');
const metal_metal = loader.load('/textures/rusty_metal_04_metal_4k.jpg');

tile(metal_diff, 1, 1);

metal_diff.colorSpace = THREE.SRGBColorSpace;

export const texture_metal = new THREE.MeshStandardMaterial({
    map: metal_diff,
    roughness: 1,
    metalnessMap: metal_metal,
})

const fabric_diff = loader.load('/textures/curly_teddy_natural_diff_4k.jpg');

tile(fabric_diff, 1, 1);

fabric_diff.colorSpace = THREE.SRGBColorSpace;

export const texture_fabric = new THREE.MeshStandardMaterial({
    map: fabric_diff,
    roughness: 1,
    metalness: 0,
});

const ceiling_diff = loader.load('/textures/ceiling_interior_diff_4k.jpg');

tile(ceiling_diff, 5, 5);

ceiling_diff.colorSpace = THREE.SRGBColorSpace;

export const texture_ceiling = new THREE.MeshStandardMaterial({
    map: ceiling_diff,
    roughness: 1,
    metalness: 0,
});

const tile_diff = loader.load('/textures/worn_tile_floor_diff_4k.jpg');
tile(tile_diff, 2, 2);
tile_diff.colorSpace = THREE.SRGBColorSpace;
export const texture_tile = new THREE.MeshStandardMaterial({
    map: tile_diff,
    roughness: 1,
    metalness: 0,
});