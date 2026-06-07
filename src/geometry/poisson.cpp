#include "poisson.h"

#include "core/random.h"

#include <cmath>
#include <numbers>

namespace {
    constexpr int EMPTY_CELL = -1;
    constexpr float TAU = 2 * std::numbers::pi_v<float>;

    struct PoissonDiscContext {
        MapBounds bounds;
        float cell_size;
        float sq_radius;
        int cols, rows;
        std::vector<Vector2> samples;
        std::vector<int> active;
        std::vector<int> grid;
    };

    bool has_neighbour(const PoissonDiscContext &ctx, const Vector2 &p) {
        int x = static_cast<int>(p.x / ctx.cell_size);
        int y = static_cast<int>(p.y / ctx.cell_size);

        // Determines the 5x5 grid taking the bounds into consideration
        int i0 = std::max(0, x - 2);
        int im = std::min(ctx.cols - 1, x + 2);
        int j0 = std::max(0, y - 2);
        int jm = std::min(ctx.rows - 1, y + 2);

        // Checks the surrounding cells (5x5 grid) if sample p is too close
        for (int j = j0; j <= jm; j++) {
            for (int i = i0; i <= im; i++) {
                int idx = i + j * ctx.cols;
                if (ctx.grid.at(idx) == EMPTY_CELL)
                    continue;

                const Vector2 &q = ctx.samples.at(ctx.grid.at(idx));
                Vector2 d = q - p;
                if (d.x * d.x + d.y * d.y < ctx.sq_radius)
                    return true;
            }
        }

        return false;
    }

    bool is_valid_candidate(const PoissonDiscContext &ctx, const Vector2 &p) {
        return p.x >= 0 && p.y >= 0 && p.x < ctx.bounds.width && p.y < ctx.bounds.height && !has_neighbour(ctx, p);
    }

    void insert_grid(PoissonDiscContext &ctx, int sample_idx) {
        const Vector2 &p = ctx.samples.at(sample_idx);
        int x = static_cast<int>(p.x / ctx.cell_size);
        int y = static_cast<int>(p.y / ctx.cell_size);
        ctx.grid[x + y * ctx.cols] = sample_idx;
    }
}

std::vector<Vector2> generate_sites(const MapBounds &bounds, uint32_t seed, const PoissonDiscConfig &config) {
    Random rand(seed);

    // Sets up the context instance
    PoissonDiscContext ctx;
    ctx.bounds = bounds;
    ctx.cell_size = config.min_distance / std::sqrt(2);
    ctx.sq_radius = config.min_distance * config.min_distance;
    ctx.cols = static_cast<int>(std::ceil(bounds.width / ctx.cell_size) + 1);
    ctx.rows = static_cast<int>(std::ceil(bounds.height / ctx.cell_size) + 1);

    // Adds the initial sample point to the samples, active and grid lists.
    Vector2 initial(rand.next_float(bounds.width), rand.next_float(bounds.height));
    ctx.samples.push_back(initial);
    ctx.active.push_back(0);
    ctx.grid.assign(ctx.cols * ctx.rows, EMPTY_CELL);
    insert_grid(ctx, 0);

    while (!ctx.active.empty()) {
        bool found = false;

        // Selects a random sample point from the active list
        int active_idx = rand.next_int(ctx.active.size() - 1);
        int sample_idx = ctx.active.at(active_idx);
        const Vector2 &point = ctx.samples.at(sample_idx);

        // Attempts to generate max_attempts candidates
        for (int attempt = 0; attempt < config.max_attempts; attempt++) {
            float angle = rand.next_float(TAU);
            float distance = rand.next_float(config.min_distance, 2 * config.min_distance);

            Vector2 candidate(
                point.x + distance * std::cos(angle),
                point.y + distance * std::sin(angle));

            if (!is_valid_candidate(ctx, candidate))
                continue;

            found = true;

            // Adds the valid candidate to the samples, active and grid list
            ctx.samples.push_back(candidate);
            ctx.active.push_back(ctx.samples.size() - 1);
            insert_grid(ctx, ctx.samples.size() - 1);
            break;
        }

        // Removes the sample point from the active list if no valid candidate was generated.
        if (!found) {
            ctx.active[active_idx] = ctx.active.back();
            ctx.active.pop_back();
        }
    }

    return ctx.samples;
}
