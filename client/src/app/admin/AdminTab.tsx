import FormControl from "@/components/ui/formControl";
import Input from "@/components/ui/formControl/Input";
import Label from "@/components/ui/formControl/Label";
import Select, { Option } from "@/components/ui/formControl/Select";
import {
  Table,
  THeader,
  Th,
  TBody,
  Tr,
  TableDescription,
} from "@/components/ui/table";
import Typography from "@/components/ui/Typography";
import { useDebouncedState } from "@/hooks/useDebouncedState";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import Pagination from "./Pagination";
import { Query } from "@/types/query";
import { WithCount } from "@/types/withCount";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";

type ObjWithId = {
  id: string;
};

type ColumnHeaderType = Array<
  | string
  | {
      display: string;
      key: string;
    }
>;

type AdminTabProps<T extends ObjWithId> = {
  title: string;
  tableColumns: ColumnHeaderType;
  renderRow: (obj: T) => React.ReactNode;
  renderDescription: (obj: WithCount<T>) => React.ReactNode;
  queryKey: string;
  queryFn: (query: Query) => Promise<WithCount<T>>;
};

function AdminTab<T extends ObjWithId>({
  title,
  renderRow,
  tableColumns,
  queryKey,
  queryFn,
  renderDescription,
}: AdminTabProps<T>) {
  const [page, setPage] = useState(10);
  const [pageLimit, setPageLimit] = useState(20);
  const [input, setInput, debouncedInput] = useDebouncedState("");
  const [orderedBy, setOrderedBy] = useState<string | undefined>();
  const { data, isSuccess, isLoading } = useQuery({
    queryKey: [queryKey, debouncedInput, page, pageLimit, orderedBy],
    queryFn: async () =>
      queryFn({ limit: pageLimit, page, search: input, orderBy: orderedBy }),
  });

  function handleChangeOrderedBy(key: string) {
    if (!orderedBy?.includes(key)) return setOrderedBy(`${key}-asc`);

    if (orderedBy.includes("asc")) return setOrderedBy(`${key}-desc`);

    return setOrderedBy(undefined);
  }

  function handleArrow(key: string) {
    if (!orderedBy?.includes(key)) return null;

    if (orderedBy.includes("asc"))
      return <MdKeyboardArrowUp className="ml-auto inline-block" />;
    return <MdKeyboardArrowDown className="ml-auto inline-block" />;
  }

  useEffect(() => {
    setPage(1);
  }, [input, pageLimit]);

  if (isLoading) return <Typography>Loading...</Typography>;

  if (isSuccess)
    return (
      <>
        <div className="flex items-baseline justify-between mb-4">
          <Typography bold size="lg">
            {title}
          </Typography>
          <div className="flex gap-8">
            <FormControl className="flex items-baseline gap-4">
              <Label>Items per Page</Label>
              <Select setValue={setPageLimit} value={pageLimit}>
                <Option value={5}>5</Option>
                <Option value={10}>10</Option>
                <Option value={20}>20</Option>
                <Option value={50}>50</Option>
              </Select>
            </FormControl>
            <FormControl className="flex items-baseline gap-4">
              <Label>Search</Label>
              <Input
                value={input}
                onChange={(e) => {
                  setInput(e.currentTarget.value);
                  setPage(1);
                }}
              />
            </FormControl>
          </div>
        </div>
        <Table>
          <THeader>
            <Tr>
              {tableColumns.map((col) => {
                if (typeof col === "string")
                  return (
                    <Th className="select-none" key={col}>
                      {col}
                    </Th>
                  );

                return (
                  <Th
                    className="select-none"
                    key={col.key}
                    onClick={() => handleChangeOrderedBy(col.key)}
                  >
                    {col.display}
                    {handleArrow(col.key)}
                  </Th>
                );
              })}
            </Tr>
          </THeader>
          <TBody>{data.data.map((entry) => renderRow(entry))}</TBody>
        </Table>
        <TableDescription>{renderDescription(data)}</TableDescription>
        <Pagination
          setPage={setPage}
          itemsPerPage={pageLimit}
          total={data.count}
          page={page}
          setNext={() => setPage((p) => p + 1)}
          setPrev={() => setPage((p) => p - 1)}
        />
      </>
    );
}

export default AdminTab;
