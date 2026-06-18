#pragma once

#include "geometry/geometry.h"
#include "world/map_bounds.h"

#include <cstdint>
#include <vector>

struct TerrainParams {
    float falloff_strength = 0.4f;
    float warp_strength = 1.5f;
};

struct TerrainData {
    std::vector<float> heightmap;
};

TerrainData generate_terrain(const MapBounds &bounds, uint32_t seed, const GeometryData &geometry, const TerrainParams &params);
