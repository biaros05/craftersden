import { mat4, vec4, vec3 } from "gl-matrix";

export type Mesh = {
    geometry: Geometry
}

export type Geometry = Triangle[];

export type Triangle = [Vertex, Vertex, Vertex];

export type Vertex = [number, number, number];

/**
 * Gets the world ray (origin, direction) from the mouse position on the canvas.
 * The direction is a unit vector.
 * @param {number} x - x mouse position on canvas
 * @param {number} y - x mouse position on canvas
 * @param {mat4} viewMatrix - View matrix used by webGL
 * @param {mat4} projMatrix - Project matrix used by webGL
 * @param {object} viewport - Canvas size
 * @param {number} viewport.width - Canvas width
 * @param {number} viewport.height - Canvas height
 * @param {vec3} cameraPosition - Position of the camera in world space
 * @returns {{origin: vec3, direction: vec3}} The origin and direction of the ray vector
 */
export function screenToWorldRay(x: number, y: number, viewMatrix: mat4, projMatrix: mat4, viewport: { height: number; width: number; }, cameraPosition: vec3): { origin: vec3; direction: vec3; } {
    // Normalize device coordinates (-1 to 1 range)
    const ndcX = (2.0 * x) / viewport.width - 1.0;
    const ndcY = 1.0 - (2.0 * y) / viewport.height; // Flip Y axis
    const ndcZ = -1.0; // Start at near plane

    // Convert to 4D homogeneous clip space
    const clipCoords = vec4.set(vec4.create(), ndcX, ndcY, ndcZ, 1.0);

    // Invert projection matrix
    const invProj = mat4.invert(mat4.create(), projMatrix);
    const viewCoords = vec4.transformMat4(vec4.create(), clipCoords, invProj);
    // Force direction
    viewCoords[2] = -1.0; 
    // No translation
    viewCoords[3] = 0.0;

    // Invert view matrix
    const invView = mat4.invert(mat4.create(), viewMatrix);
    const worldRay = vec4.transformMat4(vec4.create(), viewCoords, invView);

    return {
        origin: cameraPosition,
        direction: vec3.normalize(vec3.create(), [worldRay[0], worldRay[1], worldRay[2]])
    };
}

/**
 * Checks if the ray ever intersects with the triangle denoted
 * by the 3 vertices. Returns the distance of the ray.
 * Using Möller–Trumbore algorithm
 * @param {vec3} rayOrigin - Origin of the ray
 * @param {vec3} rayDir - Unit vector representing ray direction
 * @param {vec3} v0 - First vertex of triange to check for intersection
 * @param {vec3} v1 - Second vertex of triange to check for intersection
 * @param {vec3} v2 - Third vertex of triange to check for intersection
 * @returns {number?} if it intersects the length of the ray 
 */
export function rayIntersectsTriangle(rayOrigin: vec3, rayDir: vec3, v0: vec3, v1: vec3, v2: vec3): number | null {
    const EPSILON = 1e-8;

    // Triangle edges
    const edge1 = vec3.subtract(vec3.create(), v1, v0);
    const edge2 = vec3.subtract(vec3.create(), v2, v0);

    // Compute determinant
    const pvec = vec3.cross(vec3.create(), rayDir, edge2);
    const det = vec3.dot(edge1, pvec);

    // If determinant is near zero, ray is parallel
    if (Math.abs(det) < EPSILON) return null;

    const invDet = 1.0 / det;

    // Calculate distance from V0 to ray origin
    const tvec = vec3.subtract(vec3.create(), rayOrigin, v0);

    // Calculate U parameter and test bounds
    const u = vec3.dot(tvec, pvec) * invDet;
    if (u < 0 || u > 1) return null;

    // Prepare to test V parameter
    const qvec = vec3.cross(vec3.create(), tvec, edge1);

    // Calculate V parameter and test bounds
    const v = vec3.dot(rayDir, qvec) * invDet;
    if (v < 0 || u + v > 1) return null;

    // Compute `t`, the distance along the ray
    const t = vec3.dot(edge2, qvec) * invDet;

    return t >= 0 ? t : null;
}

/**
 * Computes position of the intersection point in world space
 * @param {number} t - Distance from origin to intersect
 * @param {vec3} origin - Origin position of the ray vector
 * @param {vec3} direction - Unit vector denoting direction 
 * @returns {vec3} Coordinates of the intersection point
 */
export function computePoint(t: number, origin: vec3, direction: vec3): vec3 {
    return vec3.add(vec3.create(), origin, vec3.scale(vec3.create(), direction, t));
}

/**
 * Compute the normal of a triangle defined by 3 vertices
 * @param {vec3} v0 - First vertex of triange to check for intersection
 * @param {vec3} v1 - Second vertex of triange to check for intersection
 * @param {vec3} v2 - Third vertex of triange to check for intersection
 * @returns {vec3} The triangle's normal
 */
export function computeTriangleNormal(v0: vec3, v1: vec3, v2: vec3): vec3 {
    const edge1 = vec3.subtract(vec3.create(), v1, v0);
    const edge2 = vec3.subtract(vec3.create(), v2, v0);
    const normal = vec3.cross(vec3.create(), edge1, edge2);
    vec3.normalize(normal, normal);
    return normal;
}

/**
 * @param {vec3} pos - Position of cube
 * @returns {Geometry} Triangles that make a cube
 */
export function computeTrianglesOfCube(pos: vec3): Geometry {
    const vertices: Vertex[] = [
        [pos[0],        pos[1],     pos[2]],        // 0
        [pos[0] + 1,    pos[1],     pos[2]],        // 1
        [pos[0],        pos[1],     pos[2] + 1],    // 2
        [pos[0] + 1,    pos[1],     pos[2] + 1],    // 3
        [pos[0],        pos[1] + 1, pos[2]],        // 4
        [pos[0] + 1,    pos[1] + 1, pos[2]],        // 5
        [pos[0],        pos[1] + 1, pos[2] + 1],    // 6
        [pos[0] + 1,    pos[1] + 1, pos[2] + 1],    // 7
    ]

    return [
        // Front face
        [vertices[2], vertices[3], vertices[7]],
        [vertices[2], vertices[7], vertices[6]],
        // Back face
        [vertices[0], vertices[4], vertices[5]],
        [vertices[0], vertices[5], vertices[1]],
        // Top face
        [vertices[4], vertices[6], vertices[7]],
        [vertices[4], vertices[7], vertices[5]],
        // Bottom face
        [vertices[0], vertices[1], vertices[3]],
        [vertices[0], vertices[3], vertices[2]],
        // Right face
        [vertices[1], vertices[5], vertices[7]],
        [vertices[1], vertices[7], vertices[3]],
        // Left face
        [vertices[0], vertices[2], vertices[6]],
        [vertices[0], vertices[6], vertices[4]]
    ];
}


/**
 * Compute the camera position from its viewMatrix
 * @param {mat4} viewMatrix View matrix used by camera
 * @returns {vec3} Camera position
 */
export function getCameraPosition(viewMatrix: mat4): vec3 {
    const invView = mat4.create();
    mat4.invert(invView, viewMatrix);

    const cameraPos = vec3.fromValues(invView[12], invView[13], invView[14]);
    return cameraPos;
}

/**
 * Checks a list of meshes for intersection from the ray
 * @param {Mesh[]} blocks - Blocks to check
 * @param {vec3} ray - Unit vector denoting direction of ray
 * @param {vec3} rayOrigin - Origin of ray
 * @returns {number} Length of the ray
 */
export function checkBlocksForIntersect(blocks: Mesh[], ray: vec3, rayOrigin: vec3): {distance: number, triangle: Triangle} | null {
    let minT = Infinity;
    let triangle: Triangle | null = null;
    for (let i = 0; i < blocks.length; i++) {
        for (let j = 0; j < blocks[i].geometry.length; j++) {
            const t = rayIntersectsTriangle(rayOrigin, ray, blocks[i].geometry[j][0], blocks[i].geometry[j][1], blocks[i].geometry[j][2]);
            if (t) {
                if (t < minT) {
                    minT = t;
                    triangle = blocks[i].geometry[j];
                }
            }
        }
    }
    return minT === Infinity ? null : {distance: minT, triangle: triangle!};
}
