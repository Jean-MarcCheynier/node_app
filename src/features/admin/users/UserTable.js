import React, { useState} from 'react';
import MaterialTable from 'material-table';
import { MuiThemeProvider } from '@material-ui/core/styles';
import moment from 'moment';

import {MUIIconTable} from '../../../app/utils/MUIIconTable';
import {MUITheme} from '../../../app/utils/MUITheme';

export default function UserTable({onRowUpdate, onRowDelete, ...rest}) {
  
    const [columns] = useState([
      { title: 'Username', field: 'local.login', editable: 'never' },
      { title: 'Created at', field: 'dateCreate', render: rowData => moment(rowData.dateCreate).format("DD/MM/yy, hh:mm:ss"), editable: 'never' },
      { title: 'Role', field: 'role', lookup: { admin: 'Admin', user: 'User', pre: 'Pre' }, editable: 'always'},
    ]);


  
    return (
        <MuiThemeProvider theme={MUITheme}>
        <MaterialTable
            columns={columns}
            icons={MUIIconTable}
            options={{
                showTitle: false
            }}
            editable={{
                onRowUpdate: onRowUpdate,
                onRowDelete: onRowDelete,
            }}
            localization={{
                 body: { 
                     editRow: { 
                         deleteText: "Are you sure you want to delete this user?" 
                    }
                }
            }}
            {...rest}
        />
        </MuiThemeProvider>
    )
  }
  