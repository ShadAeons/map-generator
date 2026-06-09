#include "vector2.h"

Vector2::Vector2() : x(0), y(0) {}
Vector2::Vector2(float x, float y) : x(x), y(y) {}

Vector2 Vector2::operator+(const Vector2 &other) const {
    return Vector2(x + other.x, y + other.y);
}

Vector2 Vector2::operator-(const Vector2 &other) const {
    return Vector2(x - other.x, y - other.y);
}

Vector2 Vector2::operator*(float scale) const {
    return Vector2(x * scale, y * scale);
}

bool Vector2::operator==(const Vector2 &other) const {
    return x == other.x && y == other.y;
}
