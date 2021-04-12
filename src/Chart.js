import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import {LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer} from 'recharts';
import { Typography } from '@material-ui/core';

function createData(time, amount) {
    return {time, amount};
}

const data = [
    createData('00:00', 0),
    createData('03:00', 300),
    createData('06:00', 600),
    createData('09:00', 800),
    createData('12:00', 1500),
    createData('15:00', 2000),
    createData('18:00', 2400),
    createData('21:00', 2400),
    createData('24:00', undefined),
];



export default function User() {
    const theme = useTheme();

    return (
        <React.Fragment>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
                Create or Update a Note
            </Typography>
            <input
            onChange={e => setFormData({ ...formData, 'name': e.target.value})}
            placeholder="Note name"
            value={formData.name}
          />
          <input
            onChange={e => setFormData({ ...formData, 'description': e.target.value})}
            placeholder="Note description"
            value={formData.description}
          />
          <button onClick={createNote}>Create Note</button>
          <input
            type="file"
            onChange={onChange}
          />
        </React.Fragment>
    );
}