import React, {Component} from 'react';
//import {
//  Button,
//  StyleSheet,
//  View,
//  Text,
//  Image,
//  TextInput,
//  KeyboardAvoidingView,
//  TouchableWithoutFeedback
//} from 'react-native';
import { Container, Header, Content, Form, Item, Input, Label, Button, Text } from 'native-base';
import {styles} from '../CSS/Login.js';
import {StackNavigator} from 'react-navigation'
import {userLogin} from '../database.js'

export class Login extends Component {

  static navigationOptions = {
    header: null,
  }

  constructor(props) {
    super(props);
    this.state = {
      titleText: "CaffeineMated",
      //bodyText: 'This is not really a bird nest.',
      email: 'Email',
      password: 'Password',
      forgotPassword: 'Forgot Password?',
      signup: 'Don\'t have an account? '
    };

    // Bind login related functions
    this.login = this.login.bind(this);
    this.login_cb = this.login_cb.bind(this);
  }

  // Function called when user clicked the login button
  login() {
     userLogin(this.state.email, this.state.password, this.login_cb);
  }

  // Callback function used for login process
  login_cb(msg) {
    if(msg === 0) {
      alert("Login Successful!");
      this.props.navigation.navigate('main');
    } else {
      alert(msg);
    }
  }

  render() {
    return (
      <Container>
        <Content>
          <Form style={styles.login_form}>
            <Item floatingLabel>
              <Label>User Email</Label>
              <Input />
            </Item>
            <Item floatingLabel last>
              <Label>Password</Label>
              <Input />
            </Item>
          </Form>
          <Button style={styles.buttons}>
            <Text>Login</Text>
          </Button>
        </Content>
      </Container>
      //<KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
      //  <View style={styles.container}>
      //    <View style={styles.banner}>
      //      <Text style={styles.titleText}>{this.state.titleText}</Text>
      //      <TouchableWithoutFeedback onPress={() => this.props.navigation.navigate('start')}>
      //      <Image
      //        style={styles.logo}
      //        source={require('../resources/wei_logo.png')}
      //      />
      //      </TouchableWithoutFeedback>
      //    </View>
      //    <View style={styles.white_banner}/>
      //    <View style={styles.textSection}>
      //      <TextInput
      //        style={styles.textInput}
      //        onChangeText={(text) => this.setState({email: text})}
      //        keyboardType='email-address'
      //        value={this.state.email}
      //        //placeHolder={this.state.email}
      //      />
      //      <TextInput
      //        style={styles.textInput}
      //        onChangeText={(text) => this.setState({password: text})}
      //        keyboardType='visible-password'
      //        value={this.state.password}
      //        //placeHolder={this.state.password}
      //      />
      //      <View style={styles.buttons}>
      //        <Button
      //          title="Login"
      //          color="#ffffff"
      //          accessibilityLabel="Learn more about this purple button"
      //          onPress={this.login}
      //        />
      //      </View>
      //      <View style={styles.textView}>
      //        <Text style={styles.subText}>{this.state.forgotPassword}</Text>
      //        <View style={{flexDirection: 'row'}}>
      //          <Text style={styles.subText}>{this.state.signup}</Text>
      //          <Text
      //            style={{fontSize:12}}
      //            onPress={() => this.props.navigation.navigate('signup')}
      //          >Sign Up</Text>
      //        </View>
      //      </View>
      //    </View>
      //  </View>
      //</KeyboardAvoidingView>
    );
  }
}

export default Login;