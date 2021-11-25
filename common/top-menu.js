import React from 'react'
import styles from "../styles/TopMenu.module.scss";
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';

function TopMenu()
{
    return (<div className={styles.root}>
        <AppBar position="static" style={{ backgroundColor: '#315c8b' }}>
            <Toolbar>
                <a href={'/'}>
                    <img className={styles.logo} src={'/mp-reverse-logo.png'}  />
                </a>
            </Toolbar>
        </AppBar>
    </div>)
}

export default TopMenu;