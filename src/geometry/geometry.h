#pragma once

#include "core/vector2.h"
#include "world/world.h"

#include <cstdint>
#include <vector>

struct GeometryData {
    std::vector<Vector2> sites;
    std::vector<std::vector<Vector2>> polygons;
    std::vector<std::vector<int>> neighbours;
};

GeometryData generate_geometry(const MapBounds &bounds, uint32_t seed, uint32_t n);
