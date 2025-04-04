class StatusError extends Error {
  status: number | undefined;
}

type Cuboid = {
  from: [number, number, number],
  to: [number, number, number],
  faces : object
};

type SelectedBlock = {
  name: string,
  parent: string,
  cuboids: Cuboid[],
  texture: string
};

type SerializedBlockType = {
  id: string,
  name: string,
  position: [number, number, number],
  worldPosition?: [number, number, number] | undefined,
  geometry: object,
  textureURLs: string[],
  rotation?: [number, number, number] | undefined,
  rotationIndex?: number | undefined
}


export { SerializedBlockType, SelectedBlock, StatusError };
