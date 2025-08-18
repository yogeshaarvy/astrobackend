'use client';
import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import PageContainer from '@/components/layout/page-container';
import {
  updateEmployeeData,
  setEmployeeData,
  IEmployee,
  addEditEmployee,
  fetchSingleEmployee
} from '@/redux/slices/employeeSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import CustomTextField from '@/utils/CustomTextField';
import { FileUploader } from '@/components/file-uploader';
import CustomDropdown from '@/utils/CusomDropdown';
import CustomRadioSelector from '@/utils/CustomRadioSelector';
import { handleReduxResponse } from '@/utils/HandleReduxResponse';
import { useEffect } from 'react';
import { fetchDepartmentList, IDepartment, ModulePermission } from '@/redux/slices/departmentSlice';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { fetchModuleList } from '@/redux/slices/moduleSlice';
import { toast } from 'sonner';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.'
  }),
  department: z.string({
    required_error: 'Please select a Department.'
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.'
  }),
  phone: z.string().min(10, {
    message: 'Please enter a valid number'
  }),
  bio: z.string().min(10, {
    message: 'Please enter a valid bio'
  }),
  countryCode: z.string().min(2, {
    message: 'Please enter a valid Country Code'
  }),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  // .refine(
  //   (data) => /[a-z]/.test(data),
  //   'Password must contain at least one lowercase letter'
  // )
  // .refine(
  //   (data) => /[A-Z]/.test(data),
  //   'Password must contain at least one uppercase letter'
  // )
  // .refine(
  //   (data) => /[0-9]/.test(data),
  //   'Password must contain at least one number'
  // )
  // .refine(
  //   (data) => /[!@#$%^&*(),.?":{}|<>]/.test(data),
  //   'Password must contain at least one special character'
  // ),
  // image: z.array(z.instanceof(File)).min(1, {
  //   message: 'Please add Profile pic'
  // }),
  permissionType: z.enum(['default', 'custom'], {
    required_error: 'Please select a PermissionType'
  }),
  role: z.enum(['admin', 'employee'], {
    required_error: 'Please select a Role.'
  })
});

export default function EmployeeForm() {
  const params = useSearchParams();
  const entityId = params.get('id');
  const dispatch = useAppDispatch();
  const router = useRouter();
  const {
    singleEmployeeState: { loading, data: eData }
  } = useAppSelector((state) => state.employee);
  const {
    departmentListState: {
      loading: departmentListLoading,
      data: departmentData = [],
      pagination: { totalCount }
    }
  } = useAppSelector((state) => state.department);
  const { moduleListState: { loading: mLoading, data: mData = {} } } = useAppSelector((state) => state.module);
  const [files, setFiles] = React.useState<File[]>([]);
  const [modulePermissions, setModulePermissions] = React.useState<ModulePermission[]>([]);

  const form = useForm<IEmployee>({
    // resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      department: '',
      email: '',
      phone: '',
      bio: '',
      countryCode: '',
      password: '',
      permissionType: 'default',
      role: 'employee'
    }
  });


  React.useEffect(() => {
    if (entityId) {
      dispatch(fetchSingleEmployee(entityId));
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
    if (eData && entityId) {
      const modulePermissionsList = (eData as IEmployee)?.modulePermissionList;
      // const {name, email, phone, countryCode, password, bio , role , permissionType} = eData;
      form.setValue('email', (eData as IEmployee)?.email || '');
      form.setValue('name', (eData as IEmployee)?.name || '');
      form.setValue('phone', (eData as IEmployee)?.phone || '');
      form.setValue('department', ((eData as IEmployee)?.department as IDepartment)?._id || '');
      form.setValue('countryCode', (eData as IEmployee)?.countryCode || '');
      form.setValue('password', (eData as IEmployee)?.password || '');
      form.setValue('bio', (eData as IEmployee)?.bio || '');
      form.setValue('permissionType', (eData as IEmployee)?.permissionType ?? '');
      form.setValue('role', (eData as IEmployee)?.role || '');

      const permissions = modulePermissionsList?.map((module: any) => ({
        id: module.id,
        name: module.name,
        add: module.add,
        view: module.view,
        edit: module.edit,
        delete: module.delete,
        download: module.download,
      })) || [];
      setModulePermissions(permissions);
    }
  }, [eData, entityId, form])

  // Handle Input Change
  const handleInputChange = (e: any) => {
    const { name, value, type, files, checked } = e.target;

    dispatch(
      updateEmployeeData({
        [name]:
          type === 'file'
            ? files?.[0]
            : type === 'checkbox'
              ? checked
              : type === 'number'
                ? Number(value)
                : value
      })
    );
  };

  const handlePermissionChange = (
    id: string,
    permission: keyof Omit<ModulePermission, 'id' | 'name'>,
    value: boolean
  ) => {
    // Update the local state for UI rendering
    setModulePermissions((prev) =>
      prev.map((module: any) =>
        module.id === id ? { ...module, [permission]: value } : module
      )
    );

    // Dispatch the update to Redux slice
    dispatch(
      updateEmployeeData({
        modulePermissionList: modulePermissions.map((module: any) =>
          module.id === id ? { ...module, [permission]: value } : module
        )
      })
    );
  };


  // Handle Dropdown Change
  const handleDropdownChange = (e: any) => {
    const { name, value } = e;
    dispatch(
      updateEmployeeData({ [name]: value }) // .then(handleReduxResponse());
    );
  };

  // Handle File Change

  // const handleFileUpload = async (files: File[]) => {
  // };
  useEffect(() => {
    if (files && files?.length > 0) {
      dispatch(updateEmployeeData({ image: files }));
    }
  }, [files]);

  function onSubmit() {
    dispatch(addEditEmployee(entityId || null))
      .then((response) => {
        if (response.payload.success) {
          router.push('/dashboard/employee');
          toast.success(response.payload.message);
        }
      })
      .catch((err: any) => toast.error('Error:', err));
  }

  useEffect(() => {
    dispatch(fetchDepartmentList({ page: 1, pageSize: 1000 }));
    dispatch(fetchModuleList({page: 1, pageSize: 500}))
  }, [dispatch]);

  return (
    <PageContainer scrollable>
      <Card className="mx-auto mb-16 w-full">
        <CardHeader>
          <CardTitle className="text-left text-2xl font-bold">
            Employee Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <CustomTextField
                  name="name"
                  control={form.control}
                  label="Name"
                  placeholder="Enter your name"
                  value={(eData as IEmployee)?.name}
                  onChange={handleInputChange}
                />

                {/* Department Select */}
                <CustomDropdown
                  control={form.control}
                  label="Department"
                  name="department"
                  placeholder="Select a Department"
                  value={form.getValues('department')} // Use the value from the form state
                  defaultValue={form.getValues('department') || ''} // Set the default value if available
                  loading={departmentListLoading ?? false}
                  data={departmentData}
                  onChange={handleDropdownChange}
                />


                <CustomTextField
                  name="email"
                  control={form.control}
                  label="Email"
                  placeholder="Enter your email"
                  value={(eData as IEmployee)?.email}
                  onChange={handleInputChange}
                  type="email"
                />

                <CustomTextField
                  name="phone"
                  control={form.control}
                  label="Phone"
                  value={(eData as IEmployee)?.phone}
                  placeholder="Enter your phone"
                  onChange={handleInputChange}
                  type="tel"
                />

                <CustomTextField
                  name="countryCode"
                  control={form.control}
                  label="Country Code"
                  value={(eData as IEmployee)?.countryCode}
                  placeholder="Enter your Country Code"
                  onChange={handleInputChange}
                />

                <CustomTextField
                  name="password"
                  control={form.control}
                  label="Password"
                  placeholder="Enter your Password"
                  value={(eData as IEmployee)?.password}
                  onChange={handleInputChange}
                  type="password"
                />

                {/* Permission Type Select */}
                <CustomDropdown
                  control={form.control}
                  label="Permission Type"
                  name="permissionType"
                  placeholder="Select a Permission Type"
                  defaultValue="default"
                  data={[
                    { name: 'Default', _id: 'default' },
                    { name: 'Custom', _id: 'custom' }
                  ]}
                  onChange={handleDropdownChange}
                />

                {/* Radio Selector */}
                <CustomRadioSelector
                  name="role"
                  control={form.control}
                  // value = {'admin'}
                  label="Role"
                  options={[
                    { value: 'admin', label: 'Admin' },
                    { value: 'employee', label: 'Employee' }
                  ]}
                  onChange={handleDropdownChange}
                />
              </div>

              {
                (eData as IEmployee)?.permissionType === "custom" ? <>
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
                  </Table></> : ''
              }
              <CustomTextField
                label="Bio"
                name="bio"
                control={form.control}
                placeholder="Enter a brief bio"
                onChange={handleInputChange}
                value={(eData as IEmployee)?.bio}
                multiple={true}
              />

              <FormItem className="space-y-3">
                <FormLabel>Profile</FormLabel>
                <FileUploader
                  value={files}
                  onValueChange={setFiles}
                  // onUpload={handleInputChange}
                  accept={{ 'image/*': [] }}
                  // maxFiles={2}
                  maxSize={1024 * 1024 * 2}
                // multiple
                />
              </FormItem>

              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
