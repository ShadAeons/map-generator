cmake_minimum_required(VERSION 3.20)

project(WorldGenerator LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 23)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

set(SRC_DIR ${CMAKE_CURRENT_SOURCE_DIR}/generator/src)

add_executable(worldgen
    ${SRC_DIR}/main.cpp
    ${SRC_DIR}/bindings.cpp

    ${SRC_DIR}/core/random.cpp
    ${SRC_DIR}/core/vector2.cpp

    ${SRC_DIR}/geometry/geometry.cpp

    ${SRC_DIR}/terrain/terrain.cpp

    ${SRC_DIR}/world/world.cpp
    ${SRC_DIR}/world/bindings.cpp

    ${SRC_DIR}/external/stb.cpp
    ${SRC_DIR}/external/voronoi.cpp

    ${SRC_DIR}/render/image.cpp
)

target_include_directories(worldgen PRIVATE
    ${SRC_DIR}
    ${CMAKE_CURRENT_SOURCE_DIR}/generator/libs
)

set_target_properties(worldgen PROPERTIES RUNTIME_OUTPUT_DIRECTORY "${CMAKE_CURRENT_SOURCE_DIR}/src/wasm")

target_link_options(worldgen PRIVATE
    --bind
    -sALLOW_MEMORY_GROWTH=1
    -sMODULARIZE=1
    -sEXPORT_ES6
    -sEXPORT_NAME=WorldGenerator
    -sEXPORTED_RUNTIME_METHODS=['ccall','cwrap']
    -sENVIRONMENT=web
)
