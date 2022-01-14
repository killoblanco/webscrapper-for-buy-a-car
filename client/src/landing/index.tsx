import { Container, Grid } from '@mui/material';
import DataList from '../components/data-list';
import Table from '../components/table';
import TableProvider from '../components/table/context';

function Landing() {
  return (
    <TableProvider>
      <Container maxWidth={false}>
        <Grid container spacing={2}>
          <Grid item xs={1.25}>
            <DataList />
          </Grid>
          <Grid item xs={10.75}>
            <Table />
          </Grid>
        </Grid>
      </Container>
    </TableProvider>
  );
}

export default Landing;
