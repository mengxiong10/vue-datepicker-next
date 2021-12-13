module.exports = {
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'vue'],
  transform: {
    '^.+\\.(js|ts|tsx)$': '<rootDir>/node_modules/babel-jest',
    '^.+\\.svg$': '<rootDir>/jest-transform-svg.js',
  },
  transformIgnorePatterns: ['/node_modules/(?!date-format-parse).+\\.js$'],
  snapshotSerializers: ['jest-serializer-vue'],
  moduleNameMapper: {
    'vue-datepicker-next': '<rootDir>/lib',
  },
  coverageReporters: ['text', 'text-summary'],
};
