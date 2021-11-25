
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
    console.log(auth);

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
        
        if(req.session)
        {  
            req.session.destroy();

        }
    }
  ));
  
  export default connect(state => state)(LoginPage);