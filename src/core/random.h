#pragma once

#include <cstdint>
#include <random>

class Random {
private:
    std::mt19937 gen_;

public:
    explicit Random(uint32_t seed = random_seed());

    static uint32_t random_seed();

    int next_int(int max);
    int next_int(int min, int max);
    float next_float(float max);
    float next_float(float min, float max);
};
