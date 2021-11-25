import React, { useState, useEffect } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import IconButton from "@material-ui/core/IconButton";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";

import EmailIcon from "@material-ui/icons/Email";
import PhoneAndroidIcon from "@material-ui/icons/PhoneAndroid";
import SendIcon from "@material-ui/icons/Send";
import CancelIcon from "@material-ui/icons/Cancel";
import PageviewIcon from "@material-ui/icons/Pageview";
import HistoryIcon from "@material-ui/icons/History";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import Dialog from "@material-ui/core/Dialog";
import Checkbox from "@material-ui/core/Checkbox";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import CheckIcon from "@material-ui/icons/Check";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import LinkHistory from "./link-history";
import LabResult from "./lab-review";

import { isEmail, isMobilePhone } from "../../common/utils";
import LabReview from "./lab-review";

import { sendLink, updateVisitStatus } from "../services/lab-service";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ClipLoader from "react-spinners/ClipLoader";
import PublishIcon from '@material-ui/icons/Publish';
import DescriptionIcon from '@material-ui/icons/Description';
import FileUpload from '../../common/ui/file-upload'

const useStyles = makeStyles((theme) => ({
  wrapper: {},
  boxItem: {
    marginBottom: theme.spacing(2),
  },
  boxContainer: {
    minWidth: "450px",
  },
  actionContainer: {
    marginTop: theme.spacing(1),
  },
  actionButton: {
    marginBottom: theme.spacing(2),
  },
  actionRow: {
    marginBottom: theme.spacing(1),
  },
}));

const titleStyles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogTitle = withStyles(titleStyles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CancelIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

function SendResultDialog(props) {
  const classes = useStyles();
  const { item, open, onClose, onCloseRefresh, auth } = props;

  const [values, setValues] = useState();
  const [statusText, setStatusText] = useState(null);

  const [showHistory, setShowHistory] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [showFiles, setShowFiles] = useState(false);

  const [reviewed, setReviewed] = useState(false);
  const [reviewValue, setReviewValue] = useState(false);

  const [sending, setSending] = useState(false);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    setValues({
      id: item ? item.id : "",
      userId: item ? item.userId : "",
      hn: item ? item.hn : "",
      name: item ? item.name : "",
      dob: item ? item.dob : "",
      email: item ? item.email : "",
      status: item ? item.status : "",
      ccEmail: "",
      result: item ? item.result : "",
      mobilePhone: item ? item.mobilePhone : "",
      raw: item ? item.raw: null,
      labResults: item ? item.labResults: null,
      sentOption: item ? item.sentOption: "R",
    });

    if (item && item.status === "Reviewed") {
      setReviewed(true);
      setReviewValue(true);
    } else {
      setReviewed(false);
      setReviewValue(false);
    }
  }, [item, setValues]);

  const handleSend = () => {
    setStatusText(null);

    const validates = [];

    if (!values.mobilePhone && !values.email) {
      validates.push("Mobile Phone or Email is required.");
    }

    if (values.email) {
      // Split using a space character
      let arr = values.email.split(';');

      arr.forEach(element => {

        if (!isEmail(element)) {
          validates.push("Email format is not correct.");
        }
      })  
    }

    // if (values.email && !isEmail(values.email)) {
    //   validates.push("Email format is not correct.");
    // }

    if (values.ccEmail && !isEmail(values.ccEmail)) {
      validates.push("CC Email format is not correct.");
    }
    
    if (!values.result) {
      validates.push("No result associated");
    }

    if (values.mobilePhone && !isMobilePhone(values.mobilePhone)) {
      validates.push("Mobile Phone must contain only digits.");
    }

    if (validates.length > 0) {
      setStatusText(validates.join(" "));
    } else {
      setSending(true);
      sendLink(auth, values)
        .then((res) => {
          if (res.status === 200) {
            toast("Link and SMS have been sent.");
            // Update send status
            updateVisitStatus(auth, { id: values.id, status: "S" })
          }
        })
        .catch((err) => {
          toast("Error: unable to send email link or sms.");
        })
        .finally(() => {
          setSending(false);
        });
    }
  };

  const handleClose = () => {
    setShowHistory(false);
    setShowReview(false);

    if (onClose) {
      onClose();
    }
  };

  const handleChange = (key) => (event) => {
    const nextValues = {
      ...values,
      [key]: event.target.value,
    };

    setValues(nextValues);
  };

  const handleReviewConfirmed = () => {
    setConfirming(true);
    updateVisitStatus(auth, { id: values.id, status: "A" })
      .then((res) => {
        if (res.status == 200) {
          toast("Successfully Updated");
          setShowHistory(false);
          setShowReview(false);

          setValues({ ...values, status: "Reviewed" });
          setValues({ ...values, sentOption: "R" });
          setReviewed(true)
          setReviewValue(true)
          setShowHistory(true);
        }
      })
      .catch((err) => {
        toast(err);
      })
      .finally(() => {
        setConfirming(false);
      });
  };

  const handleUploadSuccess = (txt) => {
    toast(txt)

  }

  return (
    <Dialog onClose={handleClose} open={open}>
      {values && (
        <DialogTitle id="title" onClose={handleClose}>
          HN: {values.hn}
        </DialogTitle>
      )}
      <DialogContent dividers>
        {values && (
          <Box display="flex" m={1} flexDirection="row">
            <Box
              display="flex"
              m={1}
              flexDirection="column"
              className={classes.boxContainer}
            >
              <Box className={classes.boxItem}>
                <TextField
                  label="Name"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={values.name}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Box>

              <Box className={classes.boxItem}>
                <TextField
                  label="Status"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={values.status}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Box>
              <Box className={classes.boxItem}>
                <TextField
                  label="Result"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={values.result}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Box>

              <Box className={classes.boxItem}>
                <TextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  required={true}
                  size="small"
                  value={values.email}
                  onChange={handleChange("email")}
                  InputProps={{
                    startAdornment: <EmailIcon />,
                  }}
                />
              </Box>

              <Box className={classes.boxItem}>
                <TextField
                  label="cc"
                  variant="outlined"
                  fullWidth
                  required={true}
                  size="small"
                  value={values.ccEmail}
                  onChange={handleChange("ccEmail")}
                  InputProps={{
                    startAdornment: <EmailIcon />,
                  }}
                />
              </Box>

              <Box className={classes.boxItem}>
                <TextField
                  label="Mobile Phone"
                  variant="outlined"
                  fullWidth
                  required={true}
                  size="small"
                  value={values.mobilePhone}
                  onChange={handleChange("mobilePhone")}
                  InputProps={{
                    startAdornment: <PhoneAndroidIcon />,
                  }}
                />
              </Box>

              {showReview && (
                <React.Fragment>
                  <Box
                    display="flex"
                    flexDirection="row"
                    justifyContent="flex-end"
                    className={classes.actionRow}
                  >
                    <FormControl component="fieldset">
                      <FormControlLabel
                        control={
                          <Checkbox
                            color="primary"
                            checked={reviewValue}
                            disabled={reviewed}
                            onChange={(e) => {
                              setReviewValue(!reviewValue);
                            }}
                          />
                        }
                        label="Reviewed"
                        labelPlacement="end"
                      />
                    </FormControl>

                    {!reviewed && (
                      <React.Fragment>
                        {confirming ? (
                          <Box
                            display="flex"
                            justifyContent="center"
                            flexGrow="1"
                          >
                            <ClipLoader
                              color={"#315c8b"}
                              loading={true}
                              size={50}
                            />
                          </Box>
                        ) : (
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={handleReviewConfirmed}
                            endIcon={<CheckIcon />}
                            className={classes.button}
                            disabled={!reviewValue}
                          >
                            Confirm
                          </Button>
                        )}
                      </React.Fragment>
                    )}
                  </Box>
                </React.Fragment>
              )}

              {statusText && (
                <Box className={classes.boxItem}>
                  <Typography variant="h6" color={"error"}>
                    { `${statusText}` }
                  </Typography>
                </Box>
              )}
            </Box>

            <Box
              display="flex"
              flexDirection="column"
              className={classes.actionContainer}
            >
              <Button
                variant="contained"
                color="default"
                onClick={() => {
                  setShowReview(true);
                  setShowHistory(false);
                  setShowFiles(false);
                }}
                endIcon={<PageviewIcon />}
                className={classes.actionButton}
              >
                Review
              </Button>

              <Button
                variant="contained"
                color="default"
                onClick={() => {
                  setShowHistory(false);
                  setShowReview(false);
                  setShowFiles(true);
                }}
                endIcon={<DescriptionIcon />}
                className={classes.actionButton}
              >
                Files
              </Button>

              <Button
                variant="contained"
                color="default"
                onClick={() => {
                  setShowHistory(true);
                  setShowReview(false);
                  setShowFiles(false);
                }}
                endIcon={<HistoryIcon />}
                className={classes.actionButton}
                disabled={values.status !== "Reviewed" && values.status !== "Sent"}
              >
                History
              </Button>

             {sending ? (
                <Box display="flex" justifyContent="center" flexGrow="1">
                  <ClipLoader color={"#315c8b"} loading={true} size={50} />
                </Box>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSend}
                  endIcon={<SendIcon />}
                  className={classes.actionButton}
                  //disabled={values.status !== "Reviewed" && values.status !== "Sent"}
                  //disabled={values.status !== "Reviewed"}
                >
                  Send
                </Button>
              )}

             <InputLabel htmlFor="result-label">Sent options</InputLabel>
                <Select
                  labelId="result-label"
                  id="result-id"
                  value={values.sentOption}
                  onChange={handleChange("sentOption")}
                  label="Result"
                >
                  <MenuItem value="R">
                    <em>Lab Result</em>
                  </MenuItem>
                  <MenuItem value={"D"}>Attach files</MenuItem>
                </Select>
            </Box>
          </Box>
        )}
      </DialogContent>

      {showHistory && (
        <DialogContent>
          <LinkHistory id={values.id} auth={auth} />
        </DialogContent>
      )}

      {showReview && (
        <DialogContent>
          <LabReview id={values.id} auth={auth} />
        </DialogContent>
      )}

      {showFiles && (
         <DialogContent>
           <FileUpload id={values.id} auth={auth} onUploadSuccess={handleUploadSuccess} />
         </DialogContent>
      )}

      <ToastContainer />
    </Dialog>
  );
}

export default SendResultDialog;
