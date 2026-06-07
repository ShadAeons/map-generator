#ifdef __EMSCRIPTEN__

#include <emscripten/bind.h>

#include "poisson.h"

using namespace emscripten;

void bind_geometry() {
    register_vector<Vector2>("VectorVector2");

    value_object<PoissonDiscConfig>("PoissonDiscConfig")
        .field("minDistance", &PoissonDiscConfig::min_distance)
        .field("maxAttempts", &PoissonDiscConfig::max_attempts);

    function("generateSites", &generate_sites);
}

#endif // __EMSCRIPTEN__
