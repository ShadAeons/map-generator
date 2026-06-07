#ifdef __EMSCRIPTEN__

#include <emscripten/bind.h>

#include "poisson.h"
#include "voronoi.h"

using namespace emscripten;

static val js_generate_sites(const MapBounds &bounds, uint32_t seed, const PoissonDiscConfig &config) {
    std::vector<Vector2> sites = generate_sites(bounds, seed, config);

    val result = val::array();

    for (size_t i = 0; i < sites.size(); ++i) {
        val s = val::object();
        s.set("x", sites[i].x);
        s.set("y", sites[i].y);
        result.set(i, s);
    }

    return result;
}

static val js_build_voronoi(const MapBounds &bounds, const val &js_sites) {
    std::vector<Vector2> sites;
    int len = js_sites["length"].as<int>();
    for (int i = 0; i < len; ++i) {
        val s = js_sites[i];
        sites.push_back(Vector2(s["x"].as<float>(), s["y"].as<float>()));
    }

    VoronoiDiagram diagram = build_voronoi(bounds, sites);

    val result = val::object();

    val res_sites = val::array();
    for (size_t i = 0; i < diagram.sites.size(); ++i) {
        val v = val::object();
        v.set("x", diagram.sites[i].x);
        v.set("y", diagram.sites[i].y);
        res_sites.set(i, v);
    }
    result.set("sites", res_sites);

    val polygons = val::array();
    for (size_t i = 0; i < diagram.polygons.size(); ++i) {
        val polygon = val::array();
        for (size_t j = 0; j < diagram.polygons[i].size(); ++j) {
            val vertex = val::object();
            vertex.set("x", diagram.polygons[i][j].x);
            vertex.set("y", diagram.polygons[i][j].y);
            polygon.set(j, vertex);
        }
        polygons.set(i, polygon);
    }
    result.set("polygons", polygons);

    val neighbours = val::array();
    for (size_t i = 0; i < diagram.neighbours.size(); ++i) {
        val list = val::array();
        for (size_t j = 0; j < diagram.neighbours[i].size(); ++j) {
            int idx = diagram.neighbours[i][j];

            val neighbour = val::object();
            neighbour.set("x", diagram.sites[idx].x);
            neighbour.set("y", diagram.sites[idx].y);
            list.set(j, neighbour);
        }
        neighbours.set(i, list);
    }
    result.set("neighbours", neighbours);

    return result;
}

void bind_geometry() {
    value_object<PoissonDiscConfig>("PoissonDiscConfig")
        .field("minDistance", &PoissonDiscConfig::min_distance)
        .field("maxAttempts", &PoissonDiscConfig::max_attempts);

    function("generateSites", &js_generate_sites);

    register_vector<int>("VectorInt");

    // value_object<VoronoiDiagram>("VoronoiDiagram")
    //     .field("sites", &VoronoiDiagram::sites)
    //     .field("polygons", &VoronoiDiagram::polygons)
    //     .field("neighbours", &VoronoiDiagram::neighbours);

    function("buildVoronoi", &js_build_voronoi);
}

#endif // __EMSCRIPTEN__
