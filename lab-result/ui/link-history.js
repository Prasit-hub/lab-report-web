import React, { useState, useEffect } from "react";
import { makeStyles, responsiveFontSizes } from "@material-ui/core/styles";

import { getLinkHistory } from "../services/lab-service"
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import moment from "moment";

const useStyles = makeStyles({
  table: {
    width: 'auto',
  },
});



function LinkHistory(props) {

    const classes = useStyles();

    const { auth, id  } = props
    const [ rows, setRows ] = useState()

    useEffect( () => {
        
        getLinkHistory(auth, {id}).then(res => {

            if (res.status === 200) {
                if (res.data.activities) {
                    console.log(res.data.activities);
                    setRows(res.data.activities)
                }
            }

        }).catch(error => {

            if (error && error.response)
            {
                if (error.response.status) {

                }
            }
        })

    }, [ auth, id ])

    return ( <TableContainer component={Paper}>
        <Table className={classes.table} size="small">
        <TableHead>
          <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>By</TableCell>
           
              <TableCell>Mobile Phone</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Cc</TableCell>
              </TableRow>
              </TableHead>
              <TableBody>
                  {rows && rows.map(r => 
                  <TableRow key={r.id}>
                      <TableCell>{r.createdAt ? moment(r.createdAt).format('YYYY-MM-DD HH:mm') : '' }</TableCell>
                      <TableCell>{r.internalUser.username}</TableCell>
                     
                      <TableCell>{r.mobilePhone}</TableCell>
                      <TableCell>{r.email}</TableCell>
                      <TableCell>{r.ccEmail}</TableCell>
                      <TableCell>{r.toStatusName}</TableCell>
                  </TableRow>
                  )}
              </TableBody>
        </Table>
    </TableContainer>)
}

export default LinkHistory