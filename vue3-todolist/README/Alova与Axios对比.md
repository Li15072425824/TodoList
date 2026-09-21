# Alova 与 Axios 对比

本文档旨在记录将项目中的网络请求库从 Axios 迁移到 Alova 的过程，并详细对比两者的使用差异和 Alova 的优势点。

## 1. 核心理念与定位

*   **Axios**: 一个基于 Promise 的 HTTP 客户端，用于浏览器和 Node.js。它是一个低级别的 HTTP 请求库，专注于发送请求和接收响应，不涉及状态管理、缓存等高级功能。
*   **Alova**: 一个高效的请求策略库，完美兼容各种 HTTP 客户端（如 Axios、Fetch API）和 UI 框架。它在 HTTP 客户端之上提供了一层抽象，专注于解决前端请求中的状态管理、缓存、请求去重、分页等常见问题，旨在减少样板代码并提升开发体验。

## 2. 使用方式差异

### 2.1 Axios 的使用方式 (旧)

在 `src/api/request.js` 中，Axios 被封装为一个 `service` 实例，并提供一个通用的 `request` 方法。

```javascript
// src/api/request.js (旧)
import axios from 'axios';

const service = axios.create({
  // baseURL: baseUrl,
  timeout: 10000,
});

const request = async (config) => {
  try {
    const response = await service(config);
    return response.data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

export default request;
```

在 `src/api/redisData.js` 中，通过 `request` 方法发送具体的业务请求。

```javascript
// src/api/redisData.js (旧)
import request from './request';

export const fetchRedisData = async () => {
  return request({
    url: '/api/get-data',
    method: 'get'
  });
};
```

### 2.2 Alova 的使用方式 (新)

在 `src/api/request.js` 中，Alova 被创建为一个 `alovaInstance`，并使用 `@alova/adapter-axios` 作为请求适配器，这意味着 Alova 内部仍然使用 Axios 来发送实际的 HTTP 请求。`request` 方法被重构为根据 `method` 参数调用 Alova 实例的 `Get`, `Post`, `Put`, `Delete` 等方法。

```javascript
// src/api/request.js (新)
import { createAlova } from 'alova';
import VueHook from 'alova/vue';
import { axiosRequestAdapter } from '@alova/adapter-axios';

const apiBase = import.meta.env.VITE_API_BASE_URL || '';
const baseUrl = apiBase.endsWith('/') ? apiBase.slice(0, -1) : apiBase;

const alovaInstance = createAlova({
  baseURL: baseUrl,
  statesHook: VueHook,
  requestAdapter: axiosRequestAdapter,
  timeout: 10000,
});

const request = async (config) => {
  try {
    let methodInstance;
    const { url, method, data, params, ...restConfig } = config;

    switch (method.toLowerCase()) {
      case 'get':
        methodInstance = alovaInstance.Get(url, { params, ...restConfig });
        break;
      case 'post':
        methodInstance = alovaInstance.Post(url, data, { params, ...restConfig });
        break;
      case 'put':
        methodInstance = alovaInstance.Put(url, data, { params, ...restConfig });
        break;
      case 'delete':
        methodInstance = alovaInstance.Delete(url, data, { params, ...restConfig });
        break;
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }
    const response = await alovaInstance.send(methodInstance);
    return response.data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

export default request;
```

在 `src/api/redisData.js` 中，由于 `request.js` 已经处理了 Alova 的封装，`redisData.js` 的调用方式保持不变，这使得迁移过程对业务逻辑层的影响最小。

```javascript
// src/api/redisData.js (新)
import request from './request';

export const fetchRedisData = async () => {
  return request({
    url: '/api/get-data',
    method: 'get'
  });
};
```

## 3. Alova 的优势点

尽管在这个项目中，我们只是将 Axios 替换为 Alova 的适配器，并保持了上层 API 的调用方式不变，但 Alova 在更复杂的场景下能带来显著优势：

1.  **状态管理集成**: Alova 提供了 `useRequest` 等 Hook，可以自动管理请求的 `loading`, `data`, `error` 状态，大大减少了手动维护这些状态的样板代码。这在 Vue 3 的 Composition API 中尤为方便。
2.  **请求策略**: Alova 内置了多种高性能请求策略，如请求去重、缓存、分页、轮询、预加载等。开发者可以根据业务场景灵活选择，无需手动实现复杂的逻辑。
3.  **缓存机制**: Alova 提供了强大的缓存机制，支持 SWR (Stale-While-Revalidate) 策略、缓存失效、TTL (Time-To-Live) 配置等，有效提升用户体验和应用性能。
4.  **请求拦截与响应拦截**: 类似于 Axios，Alova 也支持请求和响应拦截器，可以方便地进行统一的请求头添加、错误处理、数据转换等操作。
5.  **轻量级与可扩展性**: Alova 核心库非常轻量，并且设计为可插拔的架构，可以通过适配器和插件轻松扩展功能，例如支持不同的 HTTP 客户端或添加自定义功能。
6.  **开发体验**: 通过其提供的 Hook 和模块化设计，Alova 使得 API 集成更加高效，开发者可以更专注于业务逻辑的实现，而不是繁琐的请求管理。

## 4. 总结

通过引入 Alova，项目为未来的复杂请求场景打下了基础。虽然本次迁移主要集中在底层请求库的替换，但 Alova 的高级功能（如状态管理、缓存策略）可以在后续开发中逐步引入，进一步优化应用性能和开发效率。
