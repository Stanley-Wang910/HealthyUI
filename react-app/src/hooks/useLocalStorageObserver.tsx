import { useEffect, useState } from 'react'

const useLocalStorageObserver = <T,>(
  key: string,
  initialValue: T
): [T, (newValue: T) => void] => {
  const [value, setValue] = useState<T>(() => {
    const item = localStorage.getItem(key)
    return item ? (JSON.parse(item) as T) : initialValue
  })

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key) {
        setValue(
          event.newValue ? (JSON.parse(event.newValue) as T) : initialValue
        )
      }
    }

    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [key, initialValue])

  // Function to update local storage and state
  const updateValue = (newValue: T): void => {
    localStorage.setItem(key, JSON.stringify(newValue))
    setValue(newValue)
  }

  return [value, updateValue]
}

export default useLocalStorageObserver
