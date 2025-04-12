import { BaseHttp } from "@/utils/BackendConnect"
import { AxiosRequestConfig } from "axios";

export class TestClient extends BaseHttp {

    constructor() {
        super("http://192.168.177.129:8000")
    }

    public DoRequest = async () => {
        const config: AxiosRequestConfig = {
            method: 'get',
            url: '/test'
        };

        try {
            const response = await this.instance.request<any>(config);
            console.log(response)
            return response.data; // 返回响应数据
        } catch (error) {
            throw error; // 抛出错误
        }
    }
}