cmake_minimum_required(VERSION 3.20)

project(NewWorld LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 23)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

add_executable(newworld
    src/main.cpp
    src/bindings.cpp

    src/core/random.cpp
    src/core/vector2.cpp

    src/geometry/geometry.cpp

    src/terrain/terrain.cpp

    src/world/world.cpp
    src/world/bindings.cpp

    src/external/stb.cpp
    src/external/voronoi.cpp

    src/render/image.cpp
)

target_include_directories(newworld PRIVATE
    src
    libs
)

target_link_options(newworld PRIVATE
    --bind
    -sALLOW_MEMORY_GROWTH=1
    -sMODULARIZE=1
    -sEXPORT_ES6
    -sEXPORT_NAME=NewWorld
    -sEXPORTED_RUNTIME_METHODS=['ccall','cwrap']
    -sENVIRONMENT=web
)
