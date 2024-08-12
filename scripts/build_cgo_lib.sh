#!/bin/bash

# Build C Wrapper Library for Python to interface with Go
go build -buildmode=c-shared -v -x -o library.dll go/*.go