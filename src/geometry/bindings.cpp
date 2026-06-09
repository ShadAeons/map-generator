#ifdef __EMSCRIPTEN__

#include <emscripten/bind.h>

#include "geometry.h"

using namespace emscripten;

static val js_generate_geometry(const MapBounds &bounds, uint32_t seed, uint32_t n) {
    GeometryData data = generate_geometry(bounds, seed, n);

    val result = val::object();

    val sites = val::array();
    for (size_t i = 0; i < data.sites.size(); ++i) {
        val site = val::object();
        site.set("x", data.sites[i].x);
        site.set("y", data.sites[i].y);
        sites.set(i, site);
    }
    result.set("sites", sites);

    val neighbours = val::array();
    for (size_t i = 0; i < data.neighbours.size(); ++i) {
        val site_neighbours = val::array();
        for (size_t j = 0; j < data.neighbours[i].size(); ++j) {
            site_neighbours.set(j, data.neighbours[i][j]);
        }
        neighbours.set(i, site_neighbours);
    }
    result.set("neighbours", neighbours);

    val polygons = val::array();
    for (size_t i = 0; i < data.polygons.size(); ++i) {
        val site_cell = val::array();
        for (size_t j = 0; j < data.polygons[i].size(); ++j) {
            site_cell.set(j, data.polygons[i][j]);
        }
        polygons.set(i, site_cell);
    }
    result.set("polygons", polygons);

    return result;
}

void bind_geometry() {
    register_vector<int>("VectorInt");

    function("generateGeometry", &js_generate_geometry);
}

#endif // __EMSCRIPTEN__
