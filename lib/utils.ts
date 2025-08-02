// Import type definitions for class name handling
import { clsx, type ClassValue } from "clsx";
// Import utility for merging Tailwind CSS classes
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names and merges Tailwind CSS classes
 * 
 * This utility function combines the functionality of `clsx` and `twMerge` to:
 * 1. Handle conditional class names with `clsx`
 * 2. Merge Tailwind CSS classes with `twMerge` to avoid conflicts
 * 
 * @param {...ClassValue[]} inputs - Class names or objects with conditional class names
 * @returns {string} A single string of combined and deduplicated class names
 * 
 * @example
 * ```tsx
 * // Basic usage
 * cn('p-2', 'text-red-500') // 'p-2 text-red-500'
 * 
 * // With conditional classes
 * cn(
 *   'p-2',
 *   isActive ? 'bg-blue-500' : 'bg-gray-500',
 *   isLarge && 'text-lg'
 * )
 * 
 * // With Tailwind class merging
 * cn('p-2 p-4') // 'p-4' (only the last padding is kept)
 * ```
 */
export function cn(...inputs: ClassValue[]): string {
  // First, process all class names with clsx to handle conditionals
  // Then, merge the result with twMerge to handle Tailwind classes
  return twMerge(clsx(inputs));
}

