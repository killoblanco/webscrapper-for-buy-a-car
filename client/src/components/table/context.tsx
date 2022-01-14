import { createContext, PropsWithChildren, useEffect, useMemo, useState } from 'react';
import { useSortBy, useTable } from 'react-table';
import { loadFileData } from '../../utils/data';
import LinkCell from './cells/link';

export const tableCtx = createContext({
  table: {},
  getFileData: (file: string) => { }
});


function TableProvider({ children }: PropsWithChildren<any>) {
  const [fileData, setFileData] = useState<string | null>(null);
  const [tableData, setTableData] = useState<any[]>([]);

  useEffect(() => {
    if (!!fileData) {
      console.log('Loading file data...');
      loadFileData(fileData, setTableData);
    }
  }, [fileData]);

  const columns = useMemo(() => [
    { Header: 'Brand', accessor: 'brand' },
    { Header: 'Model', accessor: 'model' },
    { Header: 'Price', accessor: 'price' },
    { Header: 'KM', accessor: 'km' },
    { Header: 'Year', accessor: 'year' },
    { Header: 'Status', accessor: 'status' },
    { Header: 'City', accessor: 'city' },
    { Header: 'License Plate', accessor: 'licensePlate' },
    { Header: 'Transmission', accessor: 'transmission' },
    { Header: 'Fuel', accessor: 'fuel' },
    { Header: 'Cylinder Capacity', accessor: 'cylinderCapacity' },
    { Header: 'Color', accessor: 'color' },
    { Header: 'Link', accessor: 'link', Cell: LinkCell },
    { Header: 'Site', accessor: 'site' },
  ], []);

  const data = useMemo(() => tableData, [tableData]);

  const table = useTable({ columns, data }, useSortBy);

  const getFileData = (file: string) => {
    console.log('getFileData', file);
    setFileData(file);
  };

  return (
    <tableCtx.Provider value={{ table, getFileData }}>
      {children}
    </tableCtx.Provider>
  );
}

export default TableProvider;
