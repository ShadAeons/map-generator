#include "terrain.h"

#include "core/vector2.h"
#include "perlin/PerlinNoise.hpp"

#include <algorithm>

namespace {
    struct FBMParams {
        siv::BasicPerlinNoise<float> perlin;
        int octaves;
        float gain;
        float lacunarity;
    };

    float fbm(const FBMParams &params, const Vector2 &p) {
        float freq = 1.0;
        float amp = 1.0;
        float value = 0.0;

        for (int i = 0; i < params.octaves; ++i) {
            value += params.perlin.noise2D(p.x * freq, p.y * freq) * amp;
            amp *= params.gain;
            freq *= params.lacunarity;
        }

        return value;
    }

    float domain_warp(const FBMParams &params, const Vector2 &p, float strength = 1.5f) {
        Vector2 q(fbm(params, p), fbm(params, p + Vector2(5.2f, 1.3f)));

        Vector2 r(
            fbm(params, p + q * strength + Vector2(1.7f, 9.2f)),
            fbm(params, p + q * strength + Vector2(8.3f, 2.8f)));

        return fbm(params, p + r * strength);
    }

    void normalise_heightmap(std::vector<float> &heightmap) {
        float min_h = *std::min_element(heightmap.begin(), heightmap.end());
        float max_h = *std::max_element(heightmap.begin(), heightmap.end());

        for (float &h : heightmap) {
            h = (h - min_h) / (max_h - min_h);
        }
    }

    float smoothstep(float e0, float e1, float t) {
        t = std::clamp((t - e0) / (e1 - e0), 0.0f, 1.0f);
        return t * t * (3.0f - 2.0f * t);
    }

    float falloff(const Vector2 &p, float strength = 0.4f) {
        float x = p.x * 2.0f - 1.0f;
        float y = p.y * 2.0f - 1.0f;

        float d = std::max(std::abs(x), std::abs(y));
        // float d = std::sqrt(x * x + y * y);

        return 1.0f - smoothstep(strength, 1.0f, d);
    }
}

TerrainData generate_terrain(const MapBounds &bounds, uint32_t seed, const GeometryData &geometry, const TerrainParams &params) {
    FBMParams fbm_params;
    fbm_params.perlin = siv::BasicPerlinNoise<float>{seed};
    fbm_params.gain = 0.5f;
    fbm_params.octaves = 6;
    fbm_params.lacunarity = 2.0f;

    TerrainData res;
    res.heightmap.resize(geometry.sites.size());

    for (size_t i = 0; i < geometry.sites.size(); ++i) {
        const Vector2 &site = geometry.sites[i];

        Vector2 p(site.x / bounds.width, site.y / bounds.height);

        res.heightmap[i] = domain_warp(fbm_params, p, params.warp_strength);
    }

    // Normalise all heightmap values to [0, 1]
    normalise_heightmap(res.heightmap);

    // Apply falloff
    for (size_t i = 0; i < geometry.sites.size(); ++i) {
        const Vector2 &site = geometry.sites[i];

        Vector2 p(site.x / bounds.width, site.y / bounds.height);

        res.heightmap[i] *= falloff(p, params.falloff_strength);
    }

    return res;
}
