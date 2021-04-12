import React from 'react';
import { makeStyles, ThemeProvider, useTheme} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { AmplifySignOut } from '@aws-amplify/ui-react';


function preventDefault(event) {
    event.preventDefault();
}

const useStyles = makeStyles((theme) => ({
    context: {
        flex: 1,
    },
    userText: {
        color: theme.palette.text.secondary,
    },
}));

export default function User() {
    const classes = useStyles();
    const userName = "mdg0501@gmail.com";

    return (
        <React.Fragment>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
                Portal User
            </Typography>
            <div>
                <Typography component="p" variant="h6">
                    Username:
                </Typography>
            </div>
            <div>
                <Typography className={classes.userText} component="p">
                    {userName}
                </Typography>
            </div>
            <div>
                <Typography component="p" variant="h6">
                    Email:
                </Typography>
            </div>
            <div>
                <Typography className={classes.userText} component="p">
                    {userName}
                </Typography>
            </div>
            <div style={{ marginTop: 10, width:50}}>
                <AmplifySignOut/>
            </div>
        </React.Fragment>
    );
}