# refs
- https://github.com/hey-api/openapi-ts

# TODOs
- [ ] <https://github.com/orgs/FrontEndDev-org/projects/1/views/1>
- [ ] 提供类型方法获取请求类型、响应类型
- [ ] 3.1 的完全支持 https://www.apimatic.io/blog/2021/09/migrating-to-and-from-openapi-3-1
- [ ] 支持 query 多参格式 https://swagger.io/docs/specification/serialization/
- [ ] 修正单根值类型提升
- [x] mock zod-mock
- [ ] 支持重命名类型
- [ ] 支持过滤 path
- [ ] 文档，参考 <https://typed-openapi-astahmer.vercel.app/>、
- [ ] 支持 SSE
- [x] 去除 requestConfig 类型的配置 `type AxiosRequestConfig = Parameters<typeof axios>[0]`
- [ ] 升级为 Monorepo，支持 openapi-axios、openapi-dio(dart/flutter)
- [ ] openapi 解析、升级、修正，https://github.com/scalar/scalar
- [ ] 流行的 openapi 文档：https://github.com/scalar/awesome-openapi
- [x] 必要依赖检查 axios、zod、zod-mock、faker 等
