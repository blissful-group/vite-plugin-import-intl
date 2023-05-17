type NestedObject = { [key: string]: { [key: string]: any } }

export interface IntlFunction {
  /**
   * Provide a globbing pattern or an array of globbing patterns
   * to load all intl locales in a folder, and group them onto an object by filename.
   */
  (glob: string | string[]): NestedObject
}
