#pragma once

#include "core/vector2.h"
#include "world/world.h"

#include <vector>

struct VoronoiDiagram {
    std::vector<Vector2> sites;
    // to be optimised later by flattening the array to store vertices
    std::vector<std::vector<Vector2>> polygons;
    std::vector<std::vector<int>> neighbours;
};

VoronoiDiagram build_voronoi(const MapBounds &bounds, const std::vector<Vector2> &sites);
