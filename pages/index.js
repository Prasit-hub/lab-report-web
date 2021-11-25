import Head from "next/head";
import styles from "../styles/Page.module.scss";
import TopMenu from "../common/top-menu";
import withSession from "../lib/session";
import wrapper from "../common/store";
import { connect } from "react-redux";
import { loggedIn } from "../aaa/auth-action";


function Home(props) {
  return (
    <div className={styles.root}>
      <TopMenu />
      <div className={styles.mainContent}>
    
      </div>
    </div>
  );
}

export const getServerSideProps = withSession(
  wrapper.getServerSideProps(({ store, req, res, ...etc }) => {
    
      let auth = null;

      if(req.session)
      {  
          auth = req.session.get('auth')
      }
    
      if (!auth || !auth.isLoggedIn || !auth.user) {
          return {
              redirect: {
                  destination: '/login',
                  permanent: false
              }
          }
      } 

      if (auth) {
        store.dispatch( loggedIn(auth) );
        return {
          redirect: {
              destination: '/lab',
              permanent: false
          }
      }
    }

    
  })
);

export default connect((state) => state)(Home);
