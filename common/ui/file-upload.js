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
  Divider
} from "@material-ui/core";
import PublishIcon from "@material-ui/icons/Publish";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import ClearIcon from "@material-ui/icons/Clear";

import { upload } from "../services/file-service";
import byteSize from "byte-size";

import "react-toastify/dist/ReactToastify.css";
import FileList from './file-list'
import ClipLoader from "react-spinners/ClipLoader";

const useStyles = makeStyles((theme) => ({
  actionButton: {},
  fileListContainer: {
      marginTop: theme.spacing(2)
  }
}));

export default function FileUpload(props) {
  const { id, auth, onUploadSuccess, onUploadFailure } = props;
  const [uploadFileList, setUploadFileList] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ fetchCount, setFetchCount ] = useState(0)

  const classes = useStyles();

  const handleFileSelected = (evt) => {
    console.log(evt.target.files);

    let list = [];
    if (uploadFileList) {
      list = [...uploadFileList];
    }

    if (evt.target.files) {
      for (var i = 0; i < evt.target.files.length; i++) {
        const file = evt.target.files[i];

        // 20mb
        if (file.size > 20971520) {
          continue;
        }

        list.push(file);
      }
    }

    if (list.length <= 5 && list.length > 0) {
      setUploadFileList(list);
    }
  };

  const handleUpload = (evt) => {
    console.log(uploadFileList);

    setLoading(true)
    upload(auth, {
        id,
        files: uploadFileList.map(f => {
            return {
                file: f,
                name: f.name
            }
        })
    }).then((res) => {
        setLoading(false)

        console.log(res)

        setUploadFileList(null);
        if (onUploadSuccess) {
            onUploadSuccess('Successfully uploaded the file(s)')
        }
        setFetchCount(fetchCount + 1)

    }).catch(err => {
        setLoading(false)

        console.log(err)
        if (onUploadFailure) {
            onUploadFailure('Fail to upload the file(s)')
        }

    })
  };

  const handleCancel = (evt) => {
    setUploadFileList(null);
  };

  return (
    <div>
      <label htmlFor="btn-upload">
        <input
          id="btn-upload"
          name="btn-upload"
          style={{ display: "none" }}
          type="file"
          onChange={handleFileSelected}
        />
        <Button variant="outlined" component="span">
          Choose Files
        </Button>
      </label>

      {uploadFileList && (
        <Box display="flex" flexDirection="column">
          <List>
            {uploadFileList.map((f, idx) => (
              <ListItem key={`${idx}`}>
                <ListItemText primary={`${f.name} -  ${byteSize(f.size)}`} />
              </ListItem>
            ))}
          </List>

          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
            <Button
              variant="contained"
              color="default"
              onClick={handleCancel}
              endIcon={<ClearIcon />}
              className={classes.actionButton}
            >
              Cancel
            </Button>

            {loading ? (
              <Box display="flex" justifyContent="center">
                <ClipLoader color={"#315c8b"} loading={true} size={50} />
              </Box>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={handleUpload}
                endIcon={<PublishIcon />}
                className={classes.actionButton}
              >
                Upload
              </Button>
            )}
          </Box>
        </Box>
      )}

      <Box display="flex" flexDirection="column" className={classes.fileListContainer}>

      <Divider />

       <FileList auth={auth} id={id} forceFetch={fetchCount}/>
      </Box>
    </div>
  );
}
