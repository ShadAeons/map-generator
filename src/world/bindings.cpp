#ifdef __EMSCRIPTEN__

#include <emscripten/bind.h>

#include "world.h"

using namespace emscripten;

void bind_world() {
    value_object<MapBounds>("MapBounds")
        .field("width", &MapBounds::width)
        .field("height", &MapBounds::height);
}

#endif // __EMSCRIPTEN__
