import type { IBaseListResponse, IBaseResponse } from "~/types/api";
import type {
  IRole,
  IRoleFilter,
  IPermissionModule,
  IRoleCreateReq,
} from "~/types/role";

export default function RoleManagementService() {
  const { $api } = useNuxtApp();

  async function getList(filter?: IRoleFilter) {
    const res = await $api.get<IBaseListResponse<IRole>>("/merchant/roles", {
      params: filter,
    });

    return res.data;
  }

  async function getOne(uuid: string) {
    const res = await $api.get<IBaseResponse<IRole>>(`/merchant/roles/${uuid}`);

    return res.data.data;
  }

  async function create(data: IRoleCreateReq) {
    const res = await $api.post<IBaseResponse<IRole>>("/merchant/roles", data);

    return res.data.data;
  }

  async function update(uuid: string, data: IRoleCreateReq) {
    const res = await $api.put<IBaseResponse<IRole>>(
      `/merchant/roles/${uuid}`,
      data,
    );

    return res.data.data;
  }

  async function remove(uuid: string) {
    const res = await $api.delete<IBaseResponse<IRole>>(
      `/merchant/roles/${uuid}`,
    );

    return res.data.data;
  }

  async function getPermissions() {
    const res = await $api.get<IBaseResponse<IPermissionModule[]>>(
      "/merchant/permissions",
    );

    return res.data.data;
  }

  return {
    getList,
    getOne,
    create,
    update,
    remove,
    getPermissions,
  };
}
