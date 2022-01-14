import { Visibility } from '@mui/icons-material';
import { IconButton, Link } from '@mui/material';

function LinkCell({ value }: { value: string }) {
  return (
    <IconButton component={Link} href={value} target="_blank">
      <Visibility />
    </IconButton>
  )
}

export default LinkCell;
