import React from 'react';
import { DataGrid } from '@material-ui/data-grid';

const columns = [
    { field: 'name', headerName: 'Name', width: 100 },
    { field: 'data', headerName: 'Data', width: 100 },
    { field: 'desc', headerName: 'Description', width: 300 },
];

const rows = [
    { id: 1, name: 'Test Note', desc: 'An example note', data: '' },
    { id: 2, name: 'Another Note', desc: 'Another example note', data: 'earthshaker.jpg' },
];

function onRowClick(rowData) {
    console.log("row click: " + rowData.id +  ' ' + rowData.name);
}

export default function Notes() {
    //const theme = useTheme();

    return (
        <React.Fragment>
            <div style={{height: 400, width: '100%' }}>
                <DataGrid 
                    rows={rows}
                    columns={columns}
                    pageSize={5}
                    onRowClick={(rowData) => onRowClick(rowData)}
                    disableSelectionOnClick={true}
                />
            </div>
        </React.Fragment>
    );
}