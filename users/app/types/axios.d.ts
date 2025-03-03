import type { AxiosRequestConfig, AxiosResponse } from "axios";

type CustomResponse<T = unknown> = Promise<
  AxiosResponse<{
    data: T;
    path: string;
    message: string;
    status: boolean;
    statusCode: number;
  }>
>;

declare module "axios" {
  export interface AxiosInstance {
    get<T = unknown>(
      url: string,
      config?: AxiosRequestConfig,
    ): CustomResponse<T>;

    post<T = unknown>(
      url: string,
      data?: AxiosRequestConfig,
    ): CustomResponse<T>;
  }
}
