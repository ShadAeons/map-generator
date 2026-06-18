#include "image.h"

#include "stb/stb_image_write.h"

Image::Image(int width, int height, Colour fill) : width(width), height(height) {
    size_t size = width * height;
    pixels.assign(size * 3, 0);

    for (size_t i = 0; i < size; i += 3) {
        pixels[i] = fill.r;
        pixels[i + 1] = fill.g;
        pixels[i + 2] = fill.b;
    }
}

void Image::set_pixel(int x, int y, Colour col) {
    int idx = x + y * width;
    pixels[idx] = col.r;
    pixels[idx + 1] = col.g;
    pixels[idx + 2] = col.b;
}

void Image::save_png(const char *out) {
    stbi_write_png(out, width, height, 3, pixels.data(), width * 3);
}
