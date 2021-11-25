
import styles from "../styles/Page.module.scss";

import React from 'react'
import LoginForm from '../aaa/ui/login-form'
import TopMenu from '../common/top-menu'
import withSession from "../lib/session";
import wrapper from '../common/store';
import {connect} from 'react-redux';
import { loggedIn } from '../aaa/auth-action'

function LoginPage(props) {

    const { auth } = props;
    
    return (
        <div className={styles.root}>
            <TopMenu />
            <div className={styles.mainContent}>
                <LoginForm auth={auth} />
            </div>
        </div>
    )
}


export const getServerSideProps = withSession(wrapper.getServerSideProps(
    ({store, req, res, ...etc}) => {
        
        let auth = null;
  
        if(req.session)
        {  
            auth = req.session.get('auth')
            console.log(auth);
        }
  
        if (auth) {
            store.dispatch( loggedIn(auth) );
        }
    }
  ));
  
  export default connect(state => state)(LoginPage);