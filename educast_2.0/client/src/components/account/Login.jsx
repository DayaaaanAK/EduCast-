import React, { useState, useEffect, useContext } from 'react';

import PasswordStrengthBar from 'react-password-strength-bar';
import { TextField, Box, Button, Typography, styled,Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { API } from '../../service/api';
import { DataContext } from '../../context/DataProvider';
import { color } from '@mui/system';
import eImage from '../image/ET.png';
import zxcvbn from 'zxcvbn';
import './index1.css';
import designimage from '../image/d.png';
//import { toast } from 'react-toastify';//
//import 'react-toastify/dist/ReactToastify.css';//
import { Snackbar } from '@mui/material';//extra














const designURL = designimage;

const Component = styled(Box)`
  width: 900px;
  height: 740px;
  margin: auto;
  box-shadow: 5px 2px 5px 2px rgb(0 0 0/ 0.6);
  background-size: cover;
  background-position: center;
  background-color: #abd4b5;
  margin-right: 80px; /* adjust this value to your liking */
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-image: url(${designURL});
`;








// const Component = styled(Box)`
// width: 1080px;
//  height: 720px;
//   margin: auto;
//   box-shadow: 5px 2px 5px 2px rgb(0 0 0/ 0.6);
//   background-size: cover;
//   background-position: center;
//   background-color: #abd4b5;
  
//   margin-right: 80px; /* adjust this value to your liking */
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   margin: auto;
//   position: relative;
  
// `;
// const Component = styled(Box)`
//   width: 768px;
//   height: 480px;
//   box-shadow: 5px 2px 5px 2px rgb(0 0 0/ 0.6);
//   background-size: cover;
//   background-position: center;
//   background: linear-gradient(to right, #348c26 50%, transparent 50%);
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   margin: auto;
//   position: relative;
// `;


const Image = styled('img')({
    width: 100,
    display: 'flex',
    margin: 'auto',
    padding: '50px 0 0',
    filter: 'brightness(100%)' /* adjust this value to make the image darker or lighter */
  });
  

const Wrapper = styled(Box)`
    padding: 25px 35px;
    display: flex;
    flex: 1;
    overflow: auto;
    flex-direction: column;
    & > div, & > button, & > p {
        margin-top: 20px;
    }
`;

const LoginButton = styled(Button)`
  text-transform: none;
  background: #348c26;
  color: #fff;
  height: 48px;
  border-radius: 24px; /* set the border-radius to half of the height */
  
`;

const SignupButton = styled(Button)`
  text-transform: none;
  background: #fff;
  color: black;
  height: 48px;
  border-radius: 24px; /* set the border-radius to half of the height */
  box-shadow: 0 2px 4px 0 rgb(0 0 0 / 20%);
 
`;


const Text = styled(Typography)`
    color: #878787;
    font-size: 12px;
`;

const Error = styled(Typography)`
    font-size: 10px;
    color: #ff6161;
    line-height: 0;
    margin-top: 10px;
    font-weight: 600;
`

const loginInitialValues = {
    username: '',
    password: ''
};

const signupInitialValues = {
    name: '',
    username: '',
    password: '',
};




const Login = ({ isUserAuthenticated }) => {
    const [login, setLogin] = useState(loginInitialValues);
    const [signup, setSignup] = useState(signupInitialValues);
    const [error, showError] = useState('');
    const [account, toggleAccount] = useState('login');
 
    const navigate = useNavigate();
    const { setAccount } = useContext(DataContext);
 
    const imageURL = eImage;
 
    useEffect(() => {
        showError(false);
    }, [login])
 
    const onValueChange = (e) => {
        setLogin({ ...login, [e.target.name]: e.target.value });
    }
 
    const onInputChange = (e) => {
        setSignup({ ...signup, [e.target.name]: e.target.value });
    }
 
    const loginUser = async () => {
        if (!login.username || !login.password) {
          window.alert('Please enter both username and password');
          return;
        }
        let response = await API.userLogin(login);
        if (response.isSuccess) {
          showError('');
          sessionStorage.setItem('accessToken', `Bearer ${response.data.accessToken}`);
          sessionStorage.setItem('refreshToken', `Bearer ${response.data.refreshToken}`);
          setAccount({ name: response.data.name, username: response.data.username });
          isUserAuthenticated(true);
          setLogin(loginInitialValues);
          window.alert('Login Successful!'); // move this line before the setTimeout function
          setTimeout(() => navigate('/'), 3000); // navigate to next page after 3 seconds
        } else {
          showError('Something went wrong! please try again later');
        }
      }
 
 
      const signupUser = async () => {
        if (!signup.name || !signup.username || !signup.password) {
          window.alert('Please fill in all fields');
          return;
        }
 
        const passwordStrength = zxcvbn(signup.password);
        if (passwordStrength.score < 3) {
          window.alert('Please choose a stronger password');
          return;
        }
 
        let response = await API.userSignup(signup);
        if (response.isSuccess) {
          showError('');
          setSignup(signupInitialValues);
          toggleAccount('login');
          window.alert('Sign-up Successful!'); // add this line
        } else {
          showError('Something went wrong! please try again later');
        }
      }
 
 
 
 
 
    const toggleSignup = () => {
        account === 'signup' ? toggleAccount('login') : toggleAccount('signup');
    }
    const [showPassword, setShowPassword] = useState(false);

    return (
        <Component>
            
            <Box>
                <Image src={imageURL} alt="Educast" style={{ width: '200px', height: '180px'}} />
                {
                    account === 'login' ?
                        <Wrapper>
                            <TextField helperText="Please enter your username" id="demo-helper-text-misaligned"  value={login.username} onChange={(e) => onValueChange(e)} name='username' label='Enter Username' />
                            <TextField helperText="Please enter your password" id="demo-helper-text-misaligned" type="password" value={login.password} onChange={(e) => onValueChange(e)} name='password' label='Enter Password' />

                            {error && <Error>{error}</Error>}

                            <LoginButton variant="contained" onClick={() => loginUser()} >Login</LoginButton>
                            <Text style={{ textAlign: 'center', color:'black' }}>OR</Text>
                            <SignupButton onClick={() => toggleSignup()} style={{ marginBottom: 50 }}>Create an account</SignupButton>
                        </Wrapper> :
                        
                      

                        
                    

                        // <Wrapper>
                        //     {/* <TextField type="text" variant="standard" onChange={(e) => onInputChange(e)} name='name' label='Enter Name' /> */}

                        //     <TextField helperText="Please enter your name" id="demo-helper-text-misaligned" onChange={(e) => onInputChange(e)} name='name' />

                        //     <TextField helperText="Please enter your user name" id="demo-helper-text-misaligned"  onChange={(e) => onInputChange(e)} name='username'  />
                        //     {/* <TextField variant="standard" onChange={(e) => onInputChange(e)} name='password' label='Enter Password' /> */}
                        //     { <TextField helperText="Please enter your password" id="demo-helper-text-misaligned" type="password"  onChange={(e) => onInputChange(e)} name='password'  /> }
                            
      
                        //     <SignupButton onClick={() => signupUser()} >Signup</SignupButton>
                        //     <Text style={{ textAlign: 'center',color:'black' }}>OR</Text>
                        //     <LoginButton variant="contained" onClick={() => toggleSignup()}>Already have an account</LoginButton>
                        // </Wrapper>
                        <Wrapper>
    <TextField helperText="Please enter your name" id="demo-helper-text-misaligned" onChange={(e) => onInputChange(e)} name='name' />

    <TextField helperText="Please enter your user name" id="demo-helper-text-misaligned" onChange={(e) => onInputChange(e)} name='username' />

    <TextField helperText="Please enter your password" id="demo-helper-text-misaligned" type="password" onChange={(e) => onInputChange(e)} name='password' />
                    
    {/* {signup.password && (
        <PasswordStrengthBar
            password={signup.password}
            minLength={6}
            shortScoreWord="Short"
            scoreWords={['Weak', 'Fair', 'Good', 'Strong', 'Secure']}
            thickness={300}
        />
    )} */}
   {signup.password && (
    <PasswordStrengthBar
        password={signup.password}
        minLength={6}
        shortScoreWord="Short"
        scoreWords={['Weak', 'Fair', 'Good', 'Strong', 'Secure']}
        style={{
            height: '10px', // change the height of the progress bar
            borderRadius: '0', // remove rounded corners from the progress bar
            backgroundColor: '#eee', // set background color for the progress bar
            marginTop: '10px', // add margin to the top of the progress bar
            border: 'none', // remove the border from the progress bar
        }}
        barColors={[
            '#dc3545', // change color for score 0
            '#ffc107', // change color for score 1
            '#17a2b8', // change color for score 2
            '#28a745', // change color for score 3
            '#20c997', // change color for score 4
        ]}
        barWidth={80} // change the thickness of the colors
    />
)}




    {error && <Error>{error}</Error>}
    <SignupButton onClick={() => signupUser()} >Signup</SignupButton>
                            <Text style={{ textAlign: 'center',color:'black' }}>OR</Text>
                            <LoginButton variant="contained" onClick={() => toggleSignup()}>Already have an account</LoginButton>

    {/* <SignupButton onClick={() => signupUser()} style={{ marginBottom: 50 }}>Create an account</SignupButton>
    <Text>Already have an account? <Link to='/' style={{ color: '#348c26' }}>Login</Link></Text> */}
</Wrapper>


                }
            </Box>
        </Component>
    )
}

export default Login;