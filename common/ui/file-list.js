import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  withStyles,
  Divider,
  Table,
  IconButton,
  TableRow,
  TableCell,
  TableBody,
} from "@material-ui/core";

import { getFiles, downloadFile, deleteFile } from "../services/file-service";
import byteSize from "byte-size";
import ClipLoader from "react-spinners/ClipLoader";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import DeleteIcon from "@material-ui/icons/Delete";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  button: {
    marginRight: theme.spacing(1),
  },
  fileListContainer: {
    marginTop: theme.spacing(2),
  },
}));

function FileListItem(props) {
  const { auth, file, onDelete } = props;
  const classes = useStyles();

  const [downloading, setDownloading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDownload = (evt) => {
    setDownloading(true);
    downloadFile(auth, {
      id: file.id,
    })
      .then((resp) => {
        setDownloading(false);
        if (resp.status === 200) {
          const url = window.URL.createObjectURL(new Blob([resp.data]));
          const link = document.createElement("a");
          link.href = url;
          const fn = file.originalName;
          link.setAttribute("download", fn); //or any other extension
          document.body.appendChild(link);
          link.click();
        }
      })
      .catch((error) => {
        console.log(error);
        setDownloading(false);
      });
  };

  const handleDelete = () => {
    setDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    setDeleteConfirm(false);

    deleteFile(auth, {
        id: file.id
    }).then(resp => {

        if (resp.status == 200) {
            if (onDelete) {
                onDelete()
            }
        }

    }).catch(err => {
        console.log(err)
    })
  };

  const handleCancelDelete = () => {
    setDeleteConfirm(false)
  };

  return (
    <TableRow>
      {file && (
        <React.Fragment>
          <TableCell>{file.originalName}</TableCell>
          <TableCell>{`${byteSize(file.size)}`}</TableCell>
          <TableCell>{`Expired: ${
            file.expiredAt ? moment(file.expiredAt).format("DD MMM YYYY") : ""
          }`}</TableCell>

          <TableCell>
            <Box display="flex" flexDirection="row" justifyContent="flex-end">
              {downloading ? (
                <Box display="flex" justifyContent="center">
                  <ClipLoader color={"#315c8b"} loading={true} size={30} />
                </Box>
              ) : (
                <IconButton
                  aria-label="download"
                  className={classes.button}
                  onClick={handleDownload}
                >
                  <CloudDownloadIcon />
                </IconButton>
              )}

              {deleteConfirm ? (
                <React.Fragment>
                  <IconButton
                    aria-label="confirm-delete"
                    color="secondary"
                    onClick={handleConfirmDelete}
                  >
                    <DeleteIcon />
                  </IconButton>

                  <IconButton
                    aria-label="not-confirm-delete"
                    color="primary"
                    onClick={handleCancelDelete}
                  >
                    <ClearIcon />
                  </IconButton>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  {deleting ? (
                    <Box display="flex" justifyContent="center">
                      <ClipLoader color={"#315c8b"} loading={true} size={30} />
                    </Box>
                  ) : (
                    <IconButton
                      aria-label="delete"
                      color="default"
                      onClick={handleDelete}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </React.Fragment>
              )}
            </Box>
          </TableCell>
        </React.Fragment>
      )}
    </TableRow>
  );
}

export default function FileList(props) {
  const { auth, id, forceFetch } = props;
  const classes = useStyles();
  const [fileList, setFileList] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetch = async () => {
    setLoading(true);

    getFiles(auth, { id })
      .then((res) => {
        console.log(res);

        if (res.status === 200 && res.data) {
          setFileList(res.data.files);
        }

        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  useEffect(async () => {
   
    if (!fileList) {
      console.log(`fetching...${forceFetch}`);
      await fetch();
    }
  }, [auth, fileList, forceFetch]);

  const handleDelete = () => {
    fetch();
  }

  /*

  const handleDownload = (f) => (evt) => {
    downloadFile(auth, {
      id: f.id,
    })
      .then((resp) => {
        if (resp.status === 200) {
          const url = window.URL.createObjectURL(new Blob([resp.data]));
          const link = document.createElement("a");
          link.href = url;
          const fn = f.originalName;
          link.setAttribute("download", fn); //or any other extension
          document.body.appendChild(link);
          link.click();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  */

  return (
    <React.Fragment>
      {loading ? (
        <Box display="flex" justifyContent="center" flexGrow="1">
          <ClipLoader color={"#315c8b"} loading={true} size={50} />
        </Box>
      ) : (
        <Table size="small">
          <TableBody>
            {fileList &&
              fileList.map((f) => (
                <FileListItem key={f.id} auth={auth} file={f} onDelete={handleDelete} />
              ))}
          </TableBody>
        </Table>
      )}
    </React.Fragment>
  );
}
