const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true, // 保持此行，如果它存在的话

  // 配置开发服务器
  devServer: {
    // 前端开发服务器的端口，通常默认为 8080 或 8081 等。
    // 如果不设置，Vue CLI 会自动为你找一个可用端口。
    // 如果你想指定一个端口，但要确保它不与后端端口冲突：
    // port: 8081, // 比如设置为 8081，避免和后端 8080 冲突

    // 代理配置，用于转发 API 请求
    proxy: {
      // 任何以 '/api' 开头的请求（例如：/api/users）都将被代理
      '/api': {
        // 目标后端 URL。这必须是你的 Spring Boot 服务器的“协议 + 主机 + 端口”。
        // 注意：这里不需要包含后端配置的 /api 上下文路径。
        target: 'http://localhost:8080',
        // 更改请求头中的 Host 字段为目标 URL 的 Host。
        // 这通常是必要的，以便后端正确处理请求，避免 CORS 问题。
        changeOrigin: true,
        // 如果后端有额外的上下文路径（例如 /backend-api），
        // 并且你希望前端直接请求 /api 但转发到 /backend-api，可以使用 pathRewrite。
        // 但根据你的后端配置，后端 API 已经是以 /api 开头，所以这里不需要 pathRewrite。
        // 示例（如果后端 API 在 /my-backend-api 下）：
        // pathRewrite: { '^/api': '/my-backend-api' }
      }
    }
  }
});