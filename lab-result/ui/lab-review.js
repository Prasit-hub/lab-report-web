import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";

import { getVisit } from "../services/lab-service";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";


const useStyles = makeStyles((theme) => ({
  wrapper: {},
  button: {},
  actionRow: {
    marginBottom: theme.spacing(1),
  },
}));

function LabReview(props) {
  const classes = useStyles();

  const { id, auth } = props;

  const [visit, setVisit] = useState(null);

  useEffect(() => {
    if (id && auth) {
      getVisit(auth, { id })
        .then((res) => {
          if (res.status === 200) {
 
            const visit = res.data.visit;
            setVisit(visit);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [id, setVisit]);



  return (
    <Box display="flex" flexDirection="column">
      {visit && (
        <React.Fragment>
        
          <Box display="flex">
            <TableContainer component={Paper}>
              <Table className={classes.table} size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Accession No</TableCell>
                    <TableCell>Specimen No</TableCell>
                    <TableCell>Status</TableCell>
                   
          
                    <TableCell>Process Name</TableCell>
                    <TableCell>Result</TableCell>
                    <TableCell>Notes</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {visit.labResults &&
                    visit.labResults.map((r) => {
                      return (
                        <TableRow key={r.id}>
                          <TableCell>{r.accessionNo}</TableCell>
                          <TableCell>{r.specimenNo}</TableCell>
                          <TableCell>{r.labOrderStatusNameE}</TableCell>
                  
             
                          <TableCell>{r.labProcessNameE}</TableCell>
                          <TableCell>{r.resultValue}</TableCell>
                          <TableCell>{r.notes}</TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </React.Fragment>
      )}
    </Box>
  );
}

export default LabReview;
