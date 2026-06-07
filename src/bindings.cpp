#ifdef __EMSCRIPTEN__

#include <emscripten/bind.h>

void bind_core();
void bind_geometry();
void bind_world();

EMSCRIPTEN_BINDINGS(newworld) {
    bind_core();
    bind_geometry();
    bind_world();
}

#endif
