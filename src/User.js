import React, {useState, useEffect} from 'react';
import { makeStyles, ThemeProvider, useTheme} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { AmplifySignOut, withAuthenticator } from '@aws-amplify/ui-react';
import { API, Storage } from 'aws-amplify';


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

function User() {
    const classes = useStyles();
    const [email, setEmail] = useState('');

    useEffect(() => {
        getUser();
    }, []);

    async function getUser() {
        const userInfo = API.Auth.currentUserInfo();
        setEmail(userInfo.attributes.email);
    }

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
                    {email}
                </Typography>
            </div>
            <div>
                <Typography component="p" variant="h6">
                    Email:
                </Typography>
            </div>
            <div>
                <Typography className={classes.userText} component="p">
                    {email}
                </Typography>
            </div>
            <div style={{ marginTop: 10, width:50}}>
                <AmplifySignOut/>
            </div>
        </React.Fragment>
    );
}

export default withAuthenticator(User);