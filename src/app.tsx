import { FC } from 'react';
import { FileButton, Button, Notification, Paper } from '@mantine/core';
import { readString } from 'react-papaparse';
import { useMainStore } from './stores/useMainStore';
import { processCSV } from './lib/csvProcessing';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

const FILE_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const FILE_EXTENSION = 'xlsx';

const App: FC = () => {
  const { setData, error, setError, clearError } = useMainStore();

  const handleCSVFile = (file: File) => {
    const fileReader = new FileReader();
    fileReader.onloadend = () => {
      readString(fileReader.result as string, {
        worker: true,
        complete: results => {
          try {
            const data = processCSV(results.data as string[][]);

            for (const [material, values] of Object.entries(data)) {
              const worksheet = XLSX.utils.aoa_to_sheet(values);
              console.log(worksheet);
              const workbook = { Sheets: { data: worksheet }, SheetNames: [material] };
              const excelBuffer = XLSX.write(workbook, { bookType: 'biff8', type: 'array' });
              const data = new Blob([excelBuffer], { type: 'application/vnd.ms-excel' });
              saveAs(data, `TEST ${material}.xls`);
            }
          } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Unknown error');
          }
        },
        delimiter: ';',
        newline: '\r\n',
        skipEmptyLines: true,
      });
    };
    fileReader.readAsText(file);
  };

  return (
    <div className='main'>
      <div className='error'>
        {!!error && (
          <Notification color='red' onClose={clearError}>
            {error}
          </Notification>
        )}
      </div>
      <Paper radius={0} className='content'>
        <FileButton onChange={handleCSVFile} accept='text/csv, .csv, application/vnd.ms-excel'>
          {props => <Button {...props}>Choose CSV</Button>}
        </FileButton>
      </Paper>
    </div>
  );
};

export default App;
