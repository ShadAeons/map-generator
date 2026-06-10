#include "geometry.h"

#include "core/random.h"

#include "voronoi/jc_voronoi.h"

#include <algorithm>

namespace {
    constexpr int RELAXATION_ITERATIONS = 3;

    std::vector<jcv_point> generate_n_points(const MapBounds &bounds, uint32_t seed, uint32_t n) {
        std::vector<jcv_point> points(n);
        Random rng(seed);

        for (uint32_t i = 0; i < n; ++i) {
            points[i].x = rng.next_float(0.f, static_cast<float>(bounds.width));
            points[i].y = rng.next_float(0.f, static_cast<float>(bounds.height));
        }

        return points;
    }

    void relax_points(const jcv_diagram *diagram, jcv_point *points) {
        const jcv_site *sites = jcv_diagram_get_sites(diagram);
        for (int i = 0; i < diagram->numsites; ++i) {
            const jcv_site *site = &sites[i];
            jcv_point sum = site->p;
            int count = 1;

            const jcv_graphedge *edge = site->edges;

            while (edge) {
                sum.x += edge->pos[0].x;
                sum.y += edge->pos[0].y;
                ++count;
                edge = edge->next;
            }

            points[site->index].x = sum.x / count;
            points[site->index].y = sum.y / count;
        }
    }

    GeometryData build_geometry(jcv_diagram *diagram) {
        GeometryData data;
        data.sites.resize(diagram->numsites);
        data.neighbours.resize(diagram->numsites);
        data.polygons.resize(diagram->numsites);

        const jcv_site *sites = jcv_diagram_get_sites(diagram);

        for (int i = 0; i < diagram->numsites; ++i) {
            const jcv_site *site = &sites[i];
            int idx = site->index;

            data.sites[idx].x = site->p.x;
            data.sites[idx].y = site->p.y;

            const jcv_graphedge *edge = site->edges;
            while (edge) {
                Vector2 vertex(edge->pos[0].x, edge->pos[0].y);
                data.polygons[idx].push_back(vertex);

                if (edge->neighbor) {
                    data.neighbours[idx].push_back(edge->neighbor->index);
                }
                edge = edge->next;
            }
        }

        return data;
    }
}

GeometryData generate_geometry(const MapBounds &bounds, uint32_t seed, uint32_t n) {
    std::vector<jcv_point> points = generate_n_points(bounds, seed, n);

    jcv_rect bbox;
    bbox.min = {0, 0};
    bbox.max = {static_cast<float>(bounds.width), static_cast<float>(bounds.height)};

    jcv_diagram diagram;

    for (int i = 0; i < RELAXATION_ITERATIONS; ++i) {
        std::memset(&diagram, 0, sizeof(jcv_diagram));
        jcv_diagram_generate(static_cast<int>(n), points.data(), &bbox, nullptr, &diagram);

        relax_points(&diagram, points.data());

        jcv_diagram_free(&diagram);
    }

    std::memset(&diagram, 0, sizeof(jcv_diagram));
    jcv_diagram_generate(static_cast<int>(n), points.data(), &bbox, nullptr, &diagram);

    GeometryData res = build_geometry(&diagram);

    jcv_diagram_free(&diagram);

    return res;
}
