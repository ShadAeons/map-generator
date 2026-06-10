#pragma once

#include "geometry/geometry.h"
#include "map_bounds.h"
#include "terrain/terrain.h"

struct WorldBuildParams {
    MapBounds bounds;
    uint32_t seed;
    uint32_t n_cells;
    float falloff_strength;
    float warp_strength;
};

class World {
    MapBounds m_bounds;
    uint32_t m_seed;

    GeometryData m_geometry;
    TerrainData m_terrain;

    TerrainParams m_terrain_params;

public:
    World(const WorldBuildParams &params);

    const GeometryData &get_geometry() const;
    const TerrainData &get_terrain() const;

private:
    void generate(uint32_t n_cells);
};
