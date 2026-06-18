#ifdef __EMSCRIPTEN__

#include <emscripten/bind.h>

using namespace emscripten;

void bind_world();

EMSCRIPTEN_BINDINGS(newworld) {
    bind_world();
}

#endif
