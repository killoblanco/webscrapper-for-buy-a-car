import { List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { getDataFiles } from '../utils/data';
import { tableCtx } from './table/context';

function DataList() {
  const [dataFiles, setDataFiles] = useState({});
  const { getFileData } = useContext(tableCtx);

  useEffect(() => {
    setDataFiles(getDataFiles());
  }, []);

  return (
    <List>
      {Object.entries<string>(dataFiles).map(([key, value]) => (
        <ListItem disablePadding key={key}>
          <ListItemButton onClick={() => getFileData(value!)}>
            <ListItemText primary={key} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
}

export default DataList;
