#pragma once

struct Vector2 {
    float x, y;

    Vector2();
    Vector2(float x, float y);

    Vector2 operator+(const Vector2 &other) const;
    Vector2 operator-(const Vector2 &other) const;
    Vector2 operator*(float scale) const;
    bool operator==(const Vector2 &other) const;
};
