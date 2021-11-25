import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 440,
  },

  hover: {
    '&:hover': {
      cursor: "pointer"
    }
  },
  nohover: {

  }
}));

export default function GenericDataTable(props) {
  const classes = useStyles();

  const { headers, criteria, onRowSelect, onDataFetch, fetchId } = props; 

  const [totalRows, setTotalRows] = React.useState(0);
  const [rows, setRows] = React.useState();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  
  useEffect(() => {

    async function fetchRows() {
      
      return onDataFetch( 0, rowsPerPage)
    }

    setRows();
    setTotalRows(0)
    setPage(0)

    fetchRows().then(data => {

      if (data)
      {
        setRows(data.rows)
        setTotalRows(data.total)
      }
    })
  
  }, [  fetchId ]);
  

  const changePage = async (page, rpp) => {

    if (onDataFetch) {
      onDataFetch(page * rpp, rpp).then(data => {
        console.log(data)
        setRows(data.rows)
        setTotalRows(data.total)
      })
    }

    setPage(page);
  }

  const handleChangePage = (event, newPage) => {
   
    changePage(newPage, rowsPerPage)
  };

  const handleChangeRowsPerPage = (event) => {
    const nextRowsPerPage = +event.target.value
    setRowsPerPage(nextRowsPerPage);
    changePage(0, nextRowsPerPage);
  };

  const handleRowSelected = (row) => (evt) => {

    if (onRowSelect) {
      onRowSelect(row)
    }
  }

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              { headers.filter(h => h.display).map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {!rows && 
              <TableRow>
                <TableCell colSpan={headers.filter(h => h.display).length}></TableCell>
              </TableRow>
            }
            {rows && rows.map((row) => {
              return (
                <TableRow 
                hover tabIndex={-1} key={row.id}
                className={onRowSelect ? classes.hover : classes.nohover}
                onClick={handleRowSelected(row)}
                >
                  {headers.filter(h => h.display).map((column) => {
                    const value = row[column.id];
                    //console.log(`${value} - ${column.format}`)
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.format ? column.format(value) : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 100]}
        component="div"
        count={totalRows ? totalRows : 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  );
}