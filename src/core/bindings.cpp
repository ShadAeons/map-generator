#ifdef __EMSCRIPTEN__

#include <emscripten/bind.h>

#include "vector2.h"

using namespace emscripten;

void bind_core() {
    value_object<Vector2>("Vector2")
        .field("x", &Vector2::x)
        .field("y", &Vector2::y);
}

#endif // __EMSCRIPTEN__
