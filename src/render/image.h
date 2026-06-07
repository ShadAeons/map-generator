#pragma once

#include <cstdint>
#include <vector>

struct Colour {
    uint8_t r, g, b;
};

struct Image {
    int width, height;
    std::vector<uint8_t> pixels;

    Image(int width, int height, Colour fill);
    void set_pixel(int x, int y, Colour col);

    void save_png(const char *out);
};
