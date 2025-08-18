'use client';
import { Checkbox } from '@/components/ui/checkbox';
import { Employee } from '@/constants/data';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { IEmployee } from '@/redux/slices/employeeSlice';
import { useAppDispatch } from '@/redux/hooks';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import {
  addEditDepartment,
  updateDepartmentData
} from '@/redux/slices/departmentSlice';

