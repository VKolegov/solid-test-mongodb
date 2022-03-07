import type {AxiosInstance} from "axios";
import axios from "axios";

export default class Api<T> {
    private axios: AxiosInstance;

    constructor(endpoint: string) {
        this.axios = axios.create(
            {
                baseURL: endpoint
            }
        );
    }

    async index(request: APIRequest): Promise<APIResponse<T>> {
        const r = await this.axios.get("/", {
            params: request
        });

        return r.data;
    }
}