#include "random.h"

Random::Random(uint32_t seed) : gen_(seed) {}

uint32_t Random::random_seed() {
    return std::random_device{}();
}

int Random::next_int(int max) {
    return std::uniform_int_distribution<>(0, max)(gen_);
}

int Random::next_int(int min, int max) {
    return std::uniform_int_distribution<>(min, max)(gen_);
}

float Random::next_float(float max) {
    return std::uniform_real_distribution<float>(0, max)(gen_);
}

float Random::next_float(float min, float max) {
    return std::uniform_real_distribution<float>(min, max)(gen_);
}
