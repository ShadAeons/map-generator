#include "voronoi.h"

#include "voronoi/jc_voronoi.h"

#include <cstring>

VoronoiDiagram build_voronoi(const MapBounds &bounds, const std::vector<Vector2> &sites) {
    size_t n = sites.size();

    // Converts the given Vector2 sites to jcv_point
    std::vector<jcv_point> points(n);
    for (size_t i = 0; i < n; ++i) {
        points[i].x = sites.at(i).x;
        points[i].y = sites.at(i).y;
    }

    jcv_rect bbox;
    bbox.min = {0, 0};
    bbox.max = {static_cast<float>(bounds.width), static_cast<float>(bounds.height)};

    jcv_diagram diagram;
    std::memset(&diagram, 0, sizeof(jcv_diagram));
    jcv_diagram_generate(static_cast<int>(n), points.data(), &bbox, nullptr, &diagram);

    VoronoiDiagram res;
    res.sites.resize(diagram.numsites);
    res.polygons.resize(diagram.numsites);
    res.neighbours.resize(diagram.numsites);

    const jcv_site *jcvsites = jcv_diagram_get_sites(&diagram);
    for (int i = 0; i < diagram.numsites; ++i) {
        const jcv_site *site = &jcvsites[i];
        int idx = site->index;

        // Converts the jcv_point sites back to Vector2 in the generated order
        res.sites[idx].x = site->p.x;
        res.sites[idx].y = site->p.y;

        const jcv_graphedge *edge = site->edges;
        while (edge != nullptr) {
            // Stores the cell shape
            res.polygons[idx].emplace_back(edge->pos[0].x, edge->pos[0].y);

            // Stores the neighbouring cells
            if (edge->neighbor) {
                res.neighbours[idx].push_back(edge->neighbor->index);
            }
            edge = edge->next;
        }
    }

    jcv_diagram_free(&diagram);

    return res;
}
