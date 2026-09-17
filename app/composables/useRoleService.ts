import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import type { MaybeRefOrGetter } from "vue";
import RoleManagementService from "~/services/roleService";
import type { IRoleCreateReq, IRoleFilter } from "~/types/role";

export function useRoleListService(
  filter?: MaybeRefOrGetter<IRoleFilter | undefined>,
) {
  const roleService = RoleManagementService();

  return useQuery({
    queryKey: computed(() => ["role-list", toValue(filter)]),
    queryFn: () => roleService.getList(toValue(filter)),
  });
}

export function useRoleDetailService(
  uuid: MaybeRefOrGetter<string | undefined>,
) {
  const roleService = RoleManagementService();

  return useQuery({
    queryKey: computed(() => ["get-role-detail", toValue(uuid)]),
    queryFn: () => roleService.getOne(toValue(uuid)!),
    enabled: computed(() => Boolean(toValue(uuid))),
  });
}

export function useCreateRoleService() {
  const roleService = RoleManagementService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["create-role"],
    mutationFn: (data: IRoleCreateReq) => roleService.create(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["role-list"] });
    },
  });
}

export function useUpdateRoleService() {
  const roleService = RoleManagementService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["update-role"],
    mutationFn: ({ uuid, data }: { uuid: string; data: IRoleCreateReq }) =>
      roleService.update(uuid, data),
    onSuccess: async (role, { uuid }) => {
      queryClient.setQueryData(["get-role-detail", uuid], role);
      await queryClient.invalidateQueries({ queryKey: ["role-list"] });
    },
  });
}

export function useDeleteRoleService() {
  const roleService = RoleManagementService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["delete-role"],
    mutationFn: (uuid: string) => roleService.remove(uuid),
    onSuccess: async (_, uuid) => {
      queryClient.removeQueries({ queryKey: ["get-role-detail", uuid] });
      await queryClient.invalidateQueries({ queryKey: ["role-list"] });
    },
  });
}

export function useGetRolePermissionsService() {
  const roleService = RoleManagementService();

  return useQuery({
    queryKey: ["role-permissions"],
    queryFn: roleService.getPermissions,
  });
}
