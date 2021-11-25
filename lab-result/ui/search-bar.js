import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";

import Box from "@material-ui/core/Box";

import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import moment from "moment";
import SearchIcon from "@material-ui/icons/Search";
import Button from "@material-ui/core/Button";
import FormLabel from '@material-ui/core/FormLabel';

import { DatePicker } from "@material-ui/pickers";
import { Label } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  wrapper: {},
  dateField: {
    marginRight: theme.spacing(2),
    width: 120,
  },
  selectField: {
    marginRight: theme.spacing(2),
    width: 120,
  },
  textField: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(2),
  },
  labelField: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(2),
  }
}));

function SearchBar(props) {
  const classes = useStyles();
  const { onSearch, defaultValue } = props;


  
  const [values, setValues] = useState();

  useEffect(() => {
    setValues(defaultValue);
  }, [defaultValue, setValues]);

  const handleChange = (key) => (event) => {
    const nextValues = {
      ...values,
      [key]: event.target.value,
    };

    setValues(nextValues);
  };

  const handleDateChange = (key, date) => {
    const nextValues = {
      ...values,
      [key]: date.format('YYYY-MM-DD')
    };

    setValues(nextValues);
  };

  const handleSearch = () => {

    console.log(values);
    if (onSearch) {
      onSearch(values);
    }
  };

  return (
    <div>
      {values && (
        <Box
          display="flex"
          flexDirection="row"
          m={1}
          justifyContent="space-between"
          alignItems="center"
        >
          <Box display="flex" flexDirection="Column" m={1}>
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
            >
              <DatePicker
                label="From"
                value={values.from}
                onChange={(date) => handleDateChange("from", date)}
                minDate={new Date("2021-01-01")}
                maxDate={new Date()}
                format="YYYY-MM-DD"
                className={classes.dateField}
              />

              <DatePicker
                label="To"
                value={values.to}
                onChange={(date) => handleDateChange("to", date)}
                minDate={new Date("2021-01-01")}
                maxDate={new Date()}
                format="YYYY-MM-DD"
                className={classes.dateField}
              />

              <FormControl variant="outlined" className={classes.selectField}>
                <InputLabel htmlFor="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  id="status-id"
                  value={values.status}
                  onChange={handleChange("status")}
                  inputProps={{
                    name: "age",
                    id: "age-native-simple",
                  }}
                  label="Status"
                  readOnly = "true"
                >
                  <MenuItem value="All">
                    <em>All</em>
                  </MenuItem>
                  <MenuItem value={"A"}>Reviewed</MenuItem>
                  <MenuItem value={"NA"}>Not Reviewed</MenuItem>
                  <MenuItem value={"S"}>Sent</MenuItem>
                </Select>
              </FormControl>

              <FormControl variant="outlined" className={classes.selectField}>
                <InputLabel htmlFor="result-label">Result</InputLabel>
                <Select
                  labelId="result-label"
                  id="result-id"
                  value={values.result}
                  onChange={handleChange("result")}
                  inputProps={{
                    name: "age",
                    id: "age-native-simple",
                  }}
                  label="Result"
                  readOnly = "true"
                >
                  <MenuItem value="A">
                    <em>All</em>
                  </MenuItem>
                  <MenuItem value={"D"}>Detected</MenuItem>
                  <MenuItem value={"N"}>Not detected</MenuItem>
                </Select>
              </FormControl>

            </Box>

            <Box className={classes.textField}>
              <TextField
                variant="outlined"
                label="HN / Name"
                value={values.keyword}
                fullWidth
                onChange={handleChange("keyword")}
              />
            </Box>

          {/* <Box className={classes.labelField}>
            <label>
              กรุณตรวจสอบความถูกต้องกรณี ผลเป็น Detected หรือกรณีผลเป็น Multiple Results
            </label>
          </Box> */}

          </Box>

          <Box>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSearch}
              endIcon={<SearchIcon />}
            >
              Search
            </Button>
          </Box>
        </Box>
      )}
    </div>
  );
}

export default SearchBar;
