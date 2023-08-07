import type { Config } from 'jest'

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/setup/navigator.ts'],
  moduleNameMapper: {
    '^@src(.*)$': '<rootDir>/src$1',
  },
}

export default config
