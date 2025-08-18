'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  addEditDepartment,
  ContentPermission,
  fetchSingleDepartment,
  IDepartment,
  updateDepartmentData
} from '@/redux/slices/departmentSlice';
import { useRouter, useSearchParams } from 'next/navigation';
import PageContainer from '@/components/layout/page-container';
import { fetchModuleList } from '@/redux/slices/moduleSlice';
import CustomTextField from '@/utils/CustomTextField';
import CustomDropdown from '@/utils/CusomDropdown';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.'
  })
});

interface ModulePermission {
  id: string;
  name: string;
  add: boolean;
  view: boolean;
  edit: boolean;
  delete: boolean;
  download: boolean;
}

export default function DepartmentForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const entityId = searchParams.get('id');
  const contentPermissionTypes = ['app', 'web', 'seo'];

  const {
    singleDepartmentState: { loading: dLoading, data: dData = {} }
  } = useAppSelector((state) => state.department);
  const {
    moduleListState: { loading: mLoading, data: mData = {} }
  } = useAppSelector((state) => state.module);

  const [modulePermissions, setModulePermissions] = React.useState<
    ModulePermission[]
  >([]);
  const [contentPermissions, setContentPermissions] =
    React.useState<ContentPermission>({
      app: false,
      web: false,
      seo: false
    });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: ''
    }
  });

  React.useEffect(() => {
    if (entityId) {
      dispatch(fetchSingleDepartment(entityId));
    } else {
      dispatch(fetchModuleList()).then((result) => {
        const modulePermissionsList = result.payload;
        const permissions = modulePermissionsList.map((module: any) => ({
          id: module._id,
          name: module.name,
          add: module.permission?.add || false,
          view: module.permission?.view || false,
          edit: module.permission?.edit || false,
          delete: module.permission?.delete || false,
          download: module.permission?.download || false
        }));
        setModulePermissions(permissions);
      });
    }
  }, [entityId]);

  React.useEffect(() => {
    if (dData && entityId) {
      const {
        name,
        modulePermissionsList = [],
        contentPermissions = {}
      } = dData;

      form.setValue('name', name || '');
      // form.setValue('contentPermission', validContentPermission);

      const permissions = modulePermissionsList.map((module: any) => ({
        id: module.id,
        name: module.name,
        add: module.add,
        view: module.view,
        edit: module.edit,
        delete: module.delete,
        download: module.download
      }));
      setModulePermissions(permissions);
      setContentPermissions(contentPermissions);
    }
  }, [dispatch, dData, form]);

  const handleContentPermissionChange = (type: keyof ContentPermission) => {
    setContentPermissions((prev) => {
      const updatedPermissions = {
        ...prev,
        [type]: !prev[type]
      };
      dispatch(
        updateDepartmentData({
          contentPermissions: updatedPermissions
        })
      );

      return updatedPermissions;
    });
  };

  const handlePermissionChange = (
    id: string,
    permission: keyof Omit<ModulePermission, 'id' | 'name'>,
    value: boolean
  ) => {
    // Update the local state for UI rendering
    setModulePermissions((prev) =>
      prev.map((module) =>
        module.id === id ? { ...module, [permission]: value } : module
      )
    );

    // Dispatch the update to Redux slice
    dispatch(
      updateDepartmentData({
        modulePermissionsList: modulePermissions.map((module) =>
          module.id === id ? { ...module, [permission]: value } : module
        )
      })
    );
  };

  const handleInputChange = (e: any) => {
    const { name, value, type, checked, files } = e.target;
    dispatch(
      updateDepartmentData({
        [name]:
          type === 'files'
            ? files[0]
            : type === 'checkbox'
            ? checked
            : type === 'number'
            ? Number(value)
            : value
      })
    );
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const payload = {
      name: values.name,
      modulePermissions: modulePermissions.map((module) => ({
        moduleId: module.id,
        view: module.view,
        add: module.add,
        edit: module.edit,
        delete: module.delete,
        download: module.download
      }))
    };
    // updateDepartmentData(payload);
    dispatch(addEditDepartment(entityId || null))
      .then((response) => {
        if (response.payload.success) {
          router.push('/dashboard/department');
          toast.success(response.payload.message);
        }
      })
      .catch((err) => console.error('Error:', err));
  };

  return (
    <PageContainer scrollable>
      <Card className="mx-auto mb-16 w-full">
        <CardHeader>
          <CardTitle className="text-left text-2xl font-bold">
            {`${entityId ? `Edit` : `Add`} Department Information`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-1">
                <CustomTextField
                  name="name"
                  control={form.control}
                  label="Name"
                  placeholder="Enter Your Department Name"
                  value={(dData as IDepartment)?.name}
                  onChange={handleInputChange}
                />
                {/* Map through contentPermissionTypes */}
                <FormLabel>Content Permission</FormLabel>
                <div className="flex items-center space-x-6">
                  {contentPermissionTypes.map((type: string) => (
                    <div key={type} className="flex items-center space-x-2">
                      <FormLabel>{type.toUpperCase()}</FormLabel>
                      {/* <input
                        type="checkbox"
                        checked={
                          contentPermissions[type as keyof ContentPermission]
                        } // Properly reference type
                        onChange={() =>
                          handleContentPermissionChange(
                            type as keyof ContentPermission
                          )
                        } // Cast to correct type
                      /> */}
                      <Checkbox
                        checked={
                          contentPermissions[type as keyof ContentPermission]
                        } // Properly reference type
                        onCheckedChange={
                          () =>
                            handleContentPermissionChange(
                              type as keyof ContentPermission
                            ) // Pass correct type
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Module Name</TableHead>
                    <TableHead className="text-center">Add</TableHead>
                    <TableHead className="text-center">View</TableHead>
                    <TableHead className="text-center">Edit</TableHead>
                    <TableHead className="text-center">Delete</TableHead>
                    <TableHead className="text-center">Download</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {modulePermissions.map((module) => (
                    <TableRow key={module.id}>
                      {/* Module Name */}
                      <TableCell>{module.name}</TableCell>

                      {/* Permissions checkboxes */}
                      {['add', 'view', 'edit', 'delete', 'download'].map(
                        (permission) => (
                          <TableCell key={permission} className="text-center">
                            <Checkbox
                              checked={Boolean(
                                module[permission as keyof ModulePermission]
                              )}
                              onCheckedChange={(checked: boolean) =>
                                handlePermissionChange(
                                  module.id,
                                  permission as
                                    | 'add'
                                    | 'view'
                                    | 'edit'
                                    | 'delete'
                                    | 'download',
                                  checked
                                )
                              }
                            />
                          </TableCell>
                        )
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
