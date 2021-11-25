import styles from "../styles/Page.module.scss";
import { makeStyles } from "@material-ui/core/styles";
import TopMenu from "../common/top-menu";
import withSession from "../lib/session";
import wrapper from "../common/store";
import { loggedIn } from "../aaa/auth-action";
import { connect } from "react-redux";
import React, { useState, useEffect } from "react";

import GenericDataTable from "../common/ui/generic-data-table";
import SendResultDialog from "../lab-result/ui/send-result";
import SearchBar from "../lab-result/ui/search-bar";
import Box from "@material-ui/core/Box";
import moment from "moment";

import { search } from "../lab-result/services/lab-service"
import { getUser } from "../aaa/services/auth-service"

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ClipLoader from "react-spinners/ClipLoader";
import { ContactsOutlined } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  wrapper: { width: "95%" },
}));

function createData(v) {

  var resultValue = "Not detected";
  var collectedAt;
  var collectedAtStr;
  var orderStatus;

  if (v.labResults && Array.isArray(v.labResults))
  {
      v.labResults.forEach( r => {
        collectedAt = r.labCollectedAt
        collectedAtStr = r.labCollectedAtStr
        orderStatus = r.labOrderStatusNameE

        if (r.labProcessCode == "COVIDPCR" || r.labProcessCode == "COVMRT" || r.labProcessCode == 'COVIDAG') {
          resultValue = r.resultValue
        }
      })
  }

  var multiResults = "";
  if (v.labResults && v.labResults.length > 1)
  {
    multiResults = "Multiple Results"
  }

  let nameL = v.user ? `${v.user.nameL}` : ''
  let nameE = v.user ? `${v.user.nameE}` : ''

  return {
    id: v.id,
    //visitCode: v.code,
    status: v.status,
    hn: v.hn,
    nameL: nameL,
    nameE: nameE,
    name: nameE.length > 0 ? nameE : nameL,
    dob: v.user ? `${v.user.dob}` : '',
    email: v.user ? `${v.user.email}` : '',
    mobilePhone: v.user ? `${v.user.mobilePhone}` : '',

    labCollectedAt: moment.utc(collectedAt),
    labCollectedAtStr: collectedAtStr,

    labOrderStatus: orderStatus,

    result: resultValue,
    multipleResults: multiResults,
    visitDate: moment.utc(v.visitDate),
    visitDateStr: v.visitDateStr,
    raw: v
  }
}

const columns = [
  {
    id: "visitDate",
    label: "Visit\u00a0Date",
    minWidth: 25,
    display: true,
    format: (v) => { return v.format('YYYY-MM-DD HH:mm') }
  },
  { id: "hn", label: "HN", minWidth: 30,  display: true },
  // { id: "visitCode", label: "Visit\u00a0Code", minWidth: 40,  display: true },
  {
    id: "name",
    label: "Name",
    minWidth: 80,
    display: false
  },
  {
    id: "nameE",
    label: "Name (E)",
    minWidth: 80,
    display: true
  },
  {
    id: "nameL",
    label: "Name (L)",
    minWidth: 80,
    display: true
  },
  {
    id: "dob",
    label: "Date of Birth",
    minWidth: 50,
    display: true,
    format: (v) => {  return moment(v).isValid() ? v : '' }
  },
  {
    id: "email",
    label: "Email",
    minWidth: 30,
    display: true
  },
  {
    id: "mobilePhone",
    label: "Phone",
    minWidth: 30,
    display: true
  },
  {
    id: "labCollectedAtStr",
    label: "Collection",
    minWidth: 30,
    display: false,
  },
  {
    id: "labOrderStatus",
    label: "Order",
    minWidth: 20,
    display: false 
  },
  {
    id: "result",
    label: "Result",
    minWidth: 40,
    display: true
  },
  {
    id: "multipleResults",
    label: "Multiple Results",
    minWidth: 40,
    display: false
  },
  {
    id: "status",
    label: "Status",
    minWidth: 30,
    //format: (v) => { return (v === 'A') ? "Reviewed" : "Not Reviewed"; },
    format: (v) => { return getReviewStatus(v); },
    display: false
  },
  {
    id: "id",
    display: false
  },
];

function getReviewStatus(req) {

  var status;

  switch(req) {
    case 'A':
      status = 'Reviewed'
      break;
    case 'S':
      status = 'Sent'
      break;
    default:
      status = 'Not Reviewed'
      // code block
  }

  return status;   // The function returns the product of p1 and p2
}

function LabPage(props) {

  const classes = useStyles();
  const [headers, setHeaders] = useState(columns);

  const { auth } = props;

  const [searchCriteria, setSearchCriteria] = useState({
    from: moment().add(-2, "days").format("YYYY-MM-DD"),
    to: moment().format("YYYY-MM-DD"),
    status: "S",
    keyword: "",
    result: "A",
  });

  const [currentItem, setCurrentItem] = useState();
  const [open, setOpen] = React.useState(false);

  const [offset, setOffset] = useState(0)
  const [limit, setLimit] = useState(10)
  const [fetchId, setFetchId] = useState(1)

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseRefresh = () => {
    setOpen(false);
    setFetchId(fetchId + 1)
  }

  const handleRowSelected = async (row) => {
    console.log(row);

    setTimeout(
      () => {
      
        const nextItem = {
          id: row.id,
          hn: row.hn,
          name: row.name,
          nameE: row.nameE,
          nameL: row.nameL,
          dob: row.dob,
          email: row.raw.user.email,
          mobilePhone: row.raw.user.mobilePhone,
          status: getReviewStatus(row.status),
          result: row.result,
          userId: row.raw.user.id,
          raw: row.raw,
          labResults: row.labResults,
        };

        setCurrentItem(nextItem);

        setOpen(true);
      }
    , 10)
  
  };

  const fetchData = async (criteria, o, l) => {

    console.log(`Offset: ${o} Limit: ${l}`)

    return search(auth, {
      ...criteria,
      offset: o, limit: l
    }).then(res => {

      if (res.status === 200 && res.data){
        const data = res.data;
        console.log(data);

        var ret 

        if (criteria.result == 'A') {
          ret = {
            total: data.count,
            rows: data.visits.map(v => {
              return createData(v)
            })
          }
        } else if (criteria.result == 'D') { 

          let labData = []
          
          data.visits.forEach(v => {
            let result = getLabResult(v) 

            if (result == "Detected")
            {
              labData.push(createData(v))
            }
          })

          ret = {
            total: data.count,
            rows: labData,
          }
        } else if (criteria.result == 'N') { 

          let labData = []
          
          data.visits.forEach(v => {
            let result = getLabResult(v) 

            if (result == "Not detected")
            {
              labData.push(createData(v))
            }
          })

          ret = {
            total: labData.count,
            rows: labData,
          }
        }

        return ret;
      }

    }).catch(error => {
      console.log(error)

      if (error && error.response)
      {
        const status = error.response.status;
        if (status === 404)
        {
          toast('Not Found')
        }
         
      } else {
        toast('Enable to fetch data')
      }
    })
  }

  function getLabResult(v) {
    var resultValue = 'Not detected' 

    if (v.labResults && Array.isArray(v.labResults))
    {
        v.labResults.forEach( r => {
          if (r.labProcessCode == "COVIDPCR" || r.labProcessCode == "COVMRT") {
            resultValue = r.resultValue
          }
        })
    }

    return resultValue
  }

  const handleDataFetch = async ( o, l) => {

    setOffset(o)
    setLimit(l)
   
    
    return fetchData(searchCriteria, o, l)
    
    //const nextRows = ROWS.slice(offset, offset + limit);
    //console.log(nextRows);
    //return { rows: nextRows, total: ROWS.length };

    // return { rows: [], total: 0 }
  };

  const handleSearch = async (value) => {

    setSearchCriteria(value)
    setFetchId(fetchId + 1)
  };

  return (
    <div className={styles.root}>
      <TopMenu />
      <div className={styles.mainContent}>
        <Box display="flex" flexDirection="column" className={classes.wrapper}>
          <SearchBar onSearch={handleSearch} defaultValue={searchCriteria} />

          <GenericDataTable
            fetchId={fetchId}
            criteria={searchCriteria}
            headers={headers}
            onDataFetch={handleDataFetch}
            // todo for external (hetel)
            // onRowSelect={handleRowSelected}
          />
        </Box>
      </div>

      <div>
        <SendResultDialog item={currentItem} 
          onClose={handleClose} 
          onCloseRefresh={handleCloseRefresh}
        
          open={open} auth={auth}/>
      </div>

      <ToastContainer />
    </div>
  );
}

export const getServerSideProps = withSession(wrapper.getServerSideProps(
  async ({store, req, res, ...ctx}) => {
      let auth = null;

      if(req.session)
      {  
          auth = req.session.get('auth')
      }

      if (!auth || !auth.isLoggedIn) {
        return {
            redirect: {
                destination: '/login?backUrl=/lab',
                permanent: false
            }
        }
    } 

    console.log(auth);

    const ret = {}

    await getUser(auth).then(res => {

      if (res.status === 200 && res.data) {
     
        const { user } = res.data

        if (user && user.permissions && user.permissions.length > 0) {
          console.log(user.permissions)

        } else {
          ret.redirect = {
            destination: '/login?backUrl=/lab',
            permanent: false
          }
        }
      }

    }).catch(async (err) => {

      console.log(err);

      req.session.unset('auth')
      await req.session.save();
  
      ret.redirect = {
        destination: '/login?backUrl=/lab',
        permanent: false
      }

    })

    if (auth) {
        store.dispatch( loggedIn(auth) );
    }

    return ret;
  }
));

export default connect(state => state)(LabPage);