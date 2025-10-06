import { ModulePermission } from '@/redux/slices/departmentSlice';
import { IEmployee } from '@/redux/slices/employeeSlice';
import { IModule } from '@/redux/slices/moduleSlice';

type BaseState<T> = {
  loading?: boolean | null;
  addEditLoading?: boolean | null;
  exportLoading?: boolean | null;
  searchLoading?: boolean | null;
  resetLoading?: boolean | null;
  error?: any;
  data?: T;
};

type PaginationState<T> = BaseState<T> & {
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
  };
};

type BaseModel = {
  active?: boolean;
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
};

type TCurrentEmployee = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  id?: string | null;
  role?: string | null;
  permissionType?: string | null;
  accessToken?: string | null;
};

type TCurrentEmployeePermission = {
  permission: ModulePermission;
  employeeId: IEmployee;
  moduleId: IModule;
};
