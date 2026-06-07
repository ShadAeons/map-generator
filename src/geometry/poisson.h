#pragma once

#include "core/vector2.h"
#include "world/world.h"

#include <cstdint>
#include <vector>

struct PoissonDiscConfig {
    float min_distance;
    uint8_t max_attempts = 30;
};

std::vector<Vector2> generate_sites(const MapBounds &bounds, uint32_t seed, const PoissonDiscConfig &config);
