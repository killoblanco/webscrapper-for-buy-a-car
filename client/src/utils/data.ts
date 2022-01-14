import { format } from 'date-fns';

export function getDataFiles() {
  const ctx = require.context('../../../data', true, /\.json$/);
  const files: { [key: string]: string } = {};
  ctx.keys().forEach(key => {
      const timestamp = +key.replace('./', '').replace('.json', '');
      const name = format(timestamp, 'MMM dd, yyyy');
      files[name] = `${timestamp}.json`;
    },
  );
  return files;
}

export function loadFileData(file: string | null, setter: any) {
  if (!!file) {
    const resource = require(`../../../data/${file}`);
    setter(
      resource.filter((res: any) =>
        (res.brand ?? '').toLowerCase().includes('kicks')
        || (res.model ?? '').toLowerCase().includes('kicks'),
      ),
    );
  }
}
