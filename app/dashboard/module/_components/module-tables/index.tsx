import { DataTable } from '@/components/ui/table/data-table';
import { columns } from './columns';
import { IModule } from '@/redux/slices/moduleSlice';

export default function ModuleTable({
  data,
  totalData
}: {
  data: IModule[];
  totalData: number;
}) {
  return (
    <div className="space-y-4">
      <div className=" w-full">
        <DataTable columns={columns} data={data} totalItems={totalData}/>
      </div>
    </div>
  );
}
