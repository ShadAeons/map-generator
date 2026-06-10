#ifdef __EMSCRIPTEN__

#include <emscripten/bind.h>

#include "world.h"

using namespace emscripten;

static val js_get_render_data(const World &world) {
    const GeometryData &geometry = world.get_geometry();
    const TerrainData &terrain = world.get_terrain();

    val result = val::object();

    // GeometryData JS representation
    val sites = val::array();
    for (size_t i = 0; i < geometry.sites.size(); ++i) {
        val site = val::object();
        site.set("x", geometry.sites[i].x);
        site.set("y", geometry.sites[i].y);
        sites.set(i, site);
    }
    result.set("sites", sites);

    val polygons = val::array();
    for (size_t i = 0; i < geometry.polygons.size(); ++i) {
        val polygon = val::array();
        for (size_t j = 0; j < geometry.polygons[i].size(); ++j) {
            val vertex = val::object();
            vertex.set("x", geometry.polygons[i][j].x);
            vertex.set("y", geometry.polygons[i][j].y);
            polygon.set(j, vertex);
        }
        polygons.set(i, polygon);
    }
    result.set("polygons", polygons);

    // TerrainData JS representation
    val heightmap = val::array();
    for (size_t i = 0; i < terrain.heightmap.size(); ++i) {
        heightmap.set(i, terrain.heightmap[i]);
    }
    result.set("heightmap", heightmap);

    return result;
}

void bind_world() {
    value_object<MapBounds>("MapBounds")
        .field("width", &MapBounds::width)
        .field("height", &MapBounds::height);

    value_object<WorldBuildParams>("WorldBuildParams")
        .field("bounds", &WorldBuildParams::bounds)
        .field("seed", &WorldBuildParams::seed)
        .field("nCells", &WorldBuildParams::n_cells)
        .field("falloffStrength", &WorldBuildParams::falloff_strength)
        .field("warpStrength", &WorldBuildParams::warp_strength);

    class_<World>("World")
        .constructor<WorldBuildParams>()
        .function("getRenderData", &js_get_render_data);
}

#endif // __EMSCRIPTEN__
