package main

import (
	"fmt"
	"sync/atomic"

	"runtime/debug"
	"unsafe"
)

// #include <stdbool.h>
// #include <stdint.h>
// #include <stdio.h>
// #include <stdlib.h>
import "C"

var allocCount int32

//Import Unsafe after C for C.GoString

//export FreeResult
func FreeResult(result *C.char) C.bool {
	defer func() {
		if r := recover(); r != nil {
			fmt.Printf("Recovered in FreeResult: %v\n", r)
			fmt.Printf("Stack trace:\n%s\n", debug.Stack())
		}
	}()

	fmt.Printf("Entered FreeResult\n")
	fmt.Printf("Result: %v\n", result) // Print address of result
	fmt.Printf("Allocated memory before freeing: %d\n", atomic.LoadInt32(&allocCount))

	if result != nil {
		C.free(unsafe.Pointer(result))
		atomic.AddInt32(&allocCount, -1)
		fmt.Println("Freed result")
		fmt.Println("Allocated memory after freeing: ", atomic.LoadInt32(&allocCount))
		return C.bool(true)
	} else {
		fmt.Println("Error: result is nil")
		return C.bool(false)
	}
}

//export GetAllocCount
func GetAllocCount() C.int {
	return C.int(atomic.LoadInt32(&allocCount))
}

func CStrArrayToSlice(cStrArray **C.char, length C.int) []string {
	ptrSlice := unsafe.Slice(cStrArray, int(length))
	goSlice := make([]string, 0, int(length))
	for i := 0; i < int(length); i++ {
		if ptrSlice[i] != nil {
			goSlice = append(goSlice, C.GoString(ptrSlice[i]))
		}
	}
	return goSlice
}
