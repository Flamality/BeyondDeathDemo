import * as THREE from "three";

const loader = new THREE.TextureLoader();

function setupTexture(tex: THREE.Texture) {
  tex.generateMipmaps = true;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
}

export function makeTiledMaterial(
  baseTexture: THREE.Texture,
  repeatX: number,
  repeatY: number,
  options: Partial<THREE.MeshStandardMaterialParameters> = {}
) {
  const map = baseTexture.clone();
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(repeatX, repeatY);
  map.needsUpdate = true;

  return new THREE.MeshStandardMaterial({
    map,
    roughness: 1,
    metalness: 0,
    ...options,
  });
}

export function makeTriplanarMaterial(
  baseTexture: THREE.Texture,
  scale = 0.25,
  options: Partial<THREE.MeshStandardMaterialParameters> = {}
) {
  const map = baseTexture.clone();
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(1, 1);
  map.needsUpdate = true;

  const material = new THREE.MeshStandardMaterial({
    map,
    roughness: 1,
    metalness: 0,
    ...options,
  });

  material.onBeforeCompile = (shader) => {
    shader.uniforms.triplanarMap = { value: map };
    shader.uniforms.triplanarScale = { value: scale };

    shader.vertexShader =
      `
      varying vec3 vLocalPosNoScale;
      varying vec3 vLocalNormal;

      vec3 getObjectScale(mat4 m) {
        return vec3(
          length(m[0].xyz),
          length(m[1].xyz),
          length(m[2].xyz)
        );
      }
      ` + shader.vertexShader;

    shader.vertexShader = shader.vertexShader.replace(
      "#include <begin_vertex>",
      `
      #include <begin_vertex>

      vec3 objectScale = getObjectScale(modelMatrix);

      vLocalPosNoScale = position / max(objectScale, vec3(0.0001));
      vLocalNormal = normalize(normal);
      `
    );

    shader.fragmentShader =
      `
      uniform sampler2D triplanarMap;
      uniform float triplanarScale;

      varying vec3 vLocalPosNoScale;
      varying vec3 vLocalNormal;

      vec4 sampleTriplanar(
        sampler2D tex,
        vec3 localPosNoScale,
        vec3 localNormal,
        float scale
      ) {
        vec3 blend = abs(normalize(localNormal));
        blend = pow(blend, vec3(4.0));
        blend /= max(dot(blend, vec3(1.0)), 0.0001);

        vec2 uvX = localPosNoScale.yz * scale;
        vec2 uvY = localPosNoScale.xz * scale;
        vec2 uvZ = localPosNoScale.xy * scale;

        vec4 xTex = texture2D(tex, uvX);
        vec4 yTex = texture2D(tex, uvY);
        vec4 zTex = texture2D(tex, uvZ);

        return xTex * blend.x + yTex * blend.y + zTex * blend.z;
      }
      ` + shader.fragmentShader;

    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <map_fragment>",
      `
      #ifdef USE_MAP
        vec4 sampledDiffuseColor = sampleTriplanar(
          triplanarMap,
          vLocalPosNoScale,
          vLocalNormal,
          triplanarScale
        );
        diffuseColor *= sampledDiffuseColor;
      #endif
      `
    );
  };

  material.customProgramCacheKey = () => `triplanar-object-aligned-worldscale-${scale}`;
  material.needsUpdate = true;

  return material;
}

/* TEXTURES */
export const wood_diff = loader.load("/textures/dark_wood_diff_4k.jpg", setupTexture);
wood_diff.colorSpace = THREE.SRGBColorSpace;

export const concrete_diff = loader.load("/textures/concrete_floor_damaged_01_diff_4k.jpg", setupTexture);
concrete_diff.colorSpace = THREE.SRGBColorSpace;

export const table_diff = loader.load("/textures/wood_table_worn_diff_4k.jpg", setupTexture);
table_diff.colorSpace = THREE.SRGBColorSpace;

export const plaster_diff = loader.load("/textures/plastered_wall_03_diff_4k.jpg", setupTexture);
plaster_diff.colorSpace = THREE.SRGBColorSpace;

export const metal_diff = loader.load("/textures/rusty_metal_04_diff_4k.jpg", setupTexture);
metal_diff.colorSpace = THREE.SRGBColorSpace;

export const metal_metal = loader.load("/textures/rusty_metal_04_metal_4k.jpg", setupTexture);

export const fabric_diff = loader.load("/textures/curly_teddy_natural_diff_4k.jpg", setupTexture);
fabric_diff.colorSpace = THREE.SRGBColorSpace;

export const ceiling_diff = loader.load("/textures/ceiling_interior_diff_4k.jpg", setupTexture);
ceiling_diff.colorSpace = THREE.SRGBColorSpace;

export const tile_diff = loader.load("/textures/worn_tile_floor_diff_4k.jpg", setupTexture);
tile_diff.colorSpace = THREE.SRGBColorSpace;

/* NORMAL MATERIALS */
export const texture_wood = makeTiledMaterial(wood_diff, 1, 1);
export const texture_concrete = makeTiledMaterial(concrete_diff, 2, 2);
export const texture_table = makeTiledMaterial(table_diff, 1, 1);
export const texture_plaster = makeTiledMaterial(plaster_diff, 1, 1);
export const texture_fabric = makeTiledMaterial(fabric_diff, 1, 1);
export const texture_ceiling = makeTiledMaterial(ceiling_diff, 1, 1);
export const texture_tile = makeTiledMaterial(tile_diff, 2, 2);

/* TRIPLANAR MATERIALS */
export const material_wood_world = makeTriplanarMaterial(wood_diff, 0.25);
export const material_concrete_world = makeTriplanarMaterial(concrete_diff, 0.5);
export const material_table_world = makeTriplanarMaterial(table_diff, 0.4);
export const material_plaster_world = makeTriplanarMaterial(plaster_diff, 0.35);
export const material_fabric_world = makeTriplanarMaterial(fabric_diff, 0.4);
export const material_ceiling_world = makeTriplanarMaterial(ceiling_diff, 0.5);
export const material_tile_world = makeTriplanarMaterial(tile_diff, 0.5);

export const material_metal_world = makeTriplanarMaterial(metal_diff, 0.25, {
  metalness: 1,
  metalnessMap: metal_metal,
});