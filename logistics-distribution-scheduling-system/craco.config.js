const path = require('path')
// 配置具体的修改规则
const CracoLessPlugin = require('craco-less')
module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            // modifyVars: { "@primary-color": "#1DA57A" },
            javascriptEnabled: true
          }
        }
      }
    }
  ],
  babel: {
    plugins: [
      [
        'import',
        {
          libraryName: 'antd',
          libraryDirectory: 'es',
          style: true // 设置为true即是less
        }
      ]
    ]
  },
  // 配置代理解决跨域
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },
  webpack: {
    // 别名
    alias: {
      '@': path.resolve('src')
    }
  }
}
