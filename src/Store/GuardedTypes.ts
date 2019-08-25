// Type guard function type
export type GuardFunction = (x: any) => x is any;

// Get guarded type of type guard function
export type GuardedType<T> = T extends (x: any) => x is infer T ? T : never;

// Extract guarded types from the Array of guard functions
export type GuardedTypes<T> = {
  [K in Extract<keyof T, number>]: T[K] extends GuardFunction ? GuardedType<T[K]> : never;
}[Extract<keyof T, number>];
