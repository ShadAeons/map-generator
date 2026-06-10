#include "world.h"

#include "geometry/geometry.h"
#include "terrain/terrain.h"

World::World(const WorldBuildParams &params) : m_bounds(params.bounds), m_seed(params.seed) {
    m_terrain_params.falloff_strength = params.falloff_strength;
    m_terrain_params.warp_strength = params.warp_strength;
    generate(params.n_cells);
}

const GeometryData &World::get_geometry() const {
    return m_geometry;
}

const TerrainData &World::get_terrain() const {
    return m_terrain;
}

void World::generate(uint32_t n_cells) {
    m_geometry = generate_geometry(m_bounds, m_seed, n_cells);

    m_terrain = generate_terrain(m_bounds, m_seed, m_geometry, m_terrain_params);
}
