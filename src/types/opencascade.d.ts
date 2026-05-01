declare module 'opencascade.js' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function initOpenCascade(config?: any): Promise<any>
  export default initOpenCascade
}

declare module 'opencascade.js/dist/opencascade.wasm.js' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const factory: (config?: any) => Promise<any>
  export default factory
}
