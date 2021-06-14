declare module '@openzeppelin/test-helpers' {
  const expectRevert: {
    assertion: (promise: Promise<any>) => Promise<void>,
    outOfGas: (promise: Promise<any>) => Promise<void>,
    unspecified: (promise: Promise<any>) => Promise<void>
  } & ((promise: Promise<any>, expectedError: string) => Promise<void>)
}