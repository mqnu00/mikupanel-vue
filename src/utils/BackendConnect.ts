import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ElMessage } from 'element-plus';

export class BaseWebsocket {
    public socket: WebSocket 

    constructor () {
        this.socket = new WebSocket(import.meta.env.VITE_API_BASE_WS_URL)
    }

    public wsSend = (msg: any) => {
        if (this.socket.readyState !== WebSocket.OPEN) {
            if (this.socket.readyState === WebSocket.CONNECTING) {
                setTimeout(() => {
                    this.wsSend(msg)
                }, 100)
            }
        } else {
            this.socket.send(JSON.stringify(msg))
        }
    }
}

export class BaseHttp {
    protected instance: AxiosInstance;

  constructor(baseURL: string) {
    this.instance = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
      },
    });

    // 请求拦截器
    

    // 响应拦截器
  }

  // 封装通用请求方法
  protected async request<T>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.instance.request<T>(config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // 封装 GET 请求
  public async get<T>(url: string, params?: any): Promise<T> {
    return this.request<T>({ method: 'get', url, params });
  }

  // 封装 POST 请求
  public async post<T>(url: string, data?: any): Promise<T> {
    return this.request<T>({ method: 'post', url, data });
  }

  // 封装 PUT 请求
  public async put<T>(url: string, data?: any): Promise<T> {
    return this.request<T>({ method: 'put', url, data });
  }

  // 封装 DELETE 请求
  public async delete<T>(url: string, data?: any): Promise<T> {
    return this.request<T>({ method: 'delete', url, data });
  }
}

class TestSocket extends BaseWebsocket {
    
    constructor () {
        super()
    }
}