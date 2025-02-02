import type { AxiosRequestConfig } from "axios";

declare module "axios" {
  export interface AxiosInstance {
    get<T = unknown>(
      url: string,
      config?: AxiosRequestConfig,
    ): Promise<
      AxiosResponse<{
        data: T;
        message: string;
        status: boolean;
        statusCode: number;
      }>
    >;
    post<T = unknown>(
      url: string,
      data?: unknown,
    ): Promise<
      AxiosResponse<{
        data: T;
        message: string;
        status: boolean;
        statusCode: number;
      }>
    >;
  }
}
