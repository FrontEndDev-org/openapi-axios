module.exports = {
  axiosImport: `import axios from '@/utils/axios';`,
  unwrapResponseData: true,
  dest: 'dist-test',
  list: [
    {
      name: 'swagger/pet1',
      spec: require('./petstore3.json'),
    },
    {
      name: 'swagger/pet2',
      spec: require('./petstore3.json'),
    },
  ],
};
