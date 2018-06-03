import React, {Component} from 'react';
import { TouchableOpacity, Image, RefreshControl, ListView } from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Container, Header, Left, Body, Right, Button, Icon, Segment, Content, Text, Item, Input, Form, Label, View, List, ListItem, Spinner, Thumbnail,Card, CardItem, Toast } from 'native-base';
import {viewPendingOrders, viewOrderDetailById, acceptOrder, updateOrderStatus, completeOrder, cancelByCarrier, getProfileDetailById, createOrder} from './../database.js';
import {styles} from '../CSS/Main.js';
import SubmitOrder from './SubmitOrder.js';
import IconVector from 'react-native-vector-icons/Entypo';
import { PlaceChoose } from './PlaceChoose.js';

export class BuyerMain extends Component {
  
  static navigationOptions = {
    header: null
  }
  
  constructor(props) {
    super(props);
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    //console.log("this is props in buyerMain with get function" + this.props.get(whenLogan));
    this.state = {
      orderSubmitted : false,    
      placeChoose : false,
      order_data : this.props.get("order_data"),
      //buyer_whereLogan : this.props.get("buyer_whereLogan"),
      //buyer_whenLogan : this.props.get("buyer_whenLogan")
    }
    
    this.submitValidityCheck = this.submitValidityCheck.bind(this);
    //console.log("this is from buyermain" + this.state.buyer_whereLogan);
  }
  
  _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });
  _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });
  
  _handleDatePicked = (date) => {
    console.log('A date has been picked: ', date.toString());
    // Extract the hr:min part
    var time = date.toString().substring(16, 21);
    this.props.change("buyer_whenLogan", time);
    //this.setState({whenLogan: time});
    this._hideDateTimePicker();
  };
  
  submitValidityCheck = () => {
    if(this.props.get('buyer_whereLogan') == 'Specify a place' ||
       this.props.get('buyer_whenLogan') == 'Pick a time') {
      alert('Please fill out location & time!');
    } else if(this.props.get('order_data').length == 0) {
      alert(
        'Please order at least one drink!');
      } else {
        var id = createOrder(this.props.get('order_data'), 
                             this.props.get('buyer_whereLogan'), 
                             this.props.get('buyer_whenLogan'));
                             
        this.props.change('orderId', id);
        this.props.change('orderSubmitted', true);
        this.setState({orderSubmitted: true});
      }
    }
    
    // For swipable list delete one row
    deleteRow(secId, rowId, rowMap) {
      rowMap[`${secId}${rowId}`].props.closeRow();
      const newData = [...this.props.get('order_data')];
      newData.splice(rowId, 1);
      console.log(newData);
      this.props.change('order_data', newData);
      var newTotalPrice = 0;
      for(var i = 0; i < newData.length; i++) {
        newTotalPrice += newData[i].itemObject.price;
      }
      this.props.change('totalPrice', newTotalPrice);
      console.log(this.props.get('order_data'));
      this.setState({ order_data: newData });
    }
    
    
    
    
    render(){
      // For swipable list
      const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
      
      return(
        <Container style = {styles.Container}>
        
        {/* ------------------------------- Order submitted page ------------------------------- */}
        {this.state.orderSubmitted &&
          <SubmitOrder
          updateOrderSubmitted={this.props.get('updateOrderSubmitted')}
          order_data={this.props.get("order_data")}
          orderId={this.props.get("orderId")}
          />
        }
        
        {/* ---------------------------------- Ordering page ---------------------------------- */}
          {!this.state.orderSubmitted &&
          <View style= {styles.banner}>
            {/* ------------------------ When & Where section -------------------------- */}
            <Item regular style={styles.textInput}>
              <Button iconLeft style={styles.Whenbutton} onPress={this._showDateTimePicker}>
                <Icon style={styles.Whenwheretext} name='alarm' />
                <Text style={styles.Whenwheretext}>{this.props.get("buyer_whenLogan")}</Text>
              </Button>
              <DateTimePicker
                isVisible={this.state.isDateTimePickerVisible}
                onConfirm={this._handleDatePicked}
                onCancel={this._hideDateTimePicker}
                mode='time'
                titleIOS='Pick a time'
                is24Hour={true}
                timeZoneOffsetInMinutes={-7 * 60}
              />
            </Item>
          
            <Item regular style={styles.textInput}>
              <Button iconRight style={styles.Wherebutton} onPress={()=> {
                this.props.change("buyer_choosePlaces")}
              }>
                <Text style={styles.Whenwheretext}>{this.props.get("buyer_whereLogan")}</Text>
                <Icon style={styles.Whenwheretext} name='navigate' />
              </Button>
            </Item>
          
            {/* ------------------------------- Menu button section ------------------------------- */}
            <View style={styles.buttonItem}>
              <Button style={styles.buttons_menu}  color="#ffffff"
                onPress={() => this.props.navigation.navigate('menu', {
                  data: this.props.get("order_data"),
                  time: this.props.get("buyer_whenLogan"),
                  location: this.props.get("buyer_whereLogan")
                })}> 
                <Text style={styles.menuText}> Menu </Text>
              </Button>
            </View>
          
          
            {/* ------------------------ LIST OF ORDER ITEMS ------------------------- */}
            <View regular style={styles.orderItem}>
              <Text style={styles.orderDetailText}> Order Details </Text>

              <View style={styles.line}/>
              <View>
                {this.props.get("order_exists") &&
                <List dataSource={this.ds.cloneWithRows(this.props.get("order_data"))}

                  renderRow={data =>
                  <ListItem style={styles.listItems}>
                    <Card style={styles.orderCard}>
                      <View style = {{flexDirection: 'row'}}>

                        <Left>
                          <Thumbnail style={styles.itemImage} source={{uri: data.image}} />
                        </Left>
            
                        <View style = {styles.cardTextView}>
                          <Text style ={styles.cardPrimaryText}>
                            {data.name}
                          </Text>
                          <Text style ={styles.cardSecondaryText}>
                            {data.itemObject.size}
                          </Text>
                          <Text style ={styles.cardSecondaryText}>
                            ${data.itemObject.price}
                          </Text>
                        </View>
                      </View>
                    </Card>
                  </ListItem>}

                  renderRightHiddenRow={(data, secId, rowId, rowMap) =>
                  <Button full danger onPress={_ => this.deleteRow(secId, rowId, rowMap)}>
                  <Icon active name="trash" />
                  </Button>}
                  rightOpenValue={-75}
                />
                }

                {/* ------------------------- No orders ------------------------- */}
                {!this.props.get("order_exists") &&
                <Text style={styles.nothingText}>
                  Nothing yet: ) {'\n'} Click menu to place your first order
                </Text>}
              </View>
            </View>

            {/* ----------------------END OF LIST OF ORDER ITEMS ------------------------- */}

          
            {/* ----------------------- Estimated price section ------------------------- */}
            <View style={styles.priceView}>
              <Text style={styles.priceText}>
                Total Estimated Price: ${this.props.get('totalPrice')}
              </Text>
            </View>
          
            {/* ------------------------- Submit button section ----------------------------- */}
            <View style={styles.buttonItem}>
              <Button
                style={styles.buttons_submit}
                color="#ffffff"
                onPress={this.submitValidityCheck}> 
              <Text style={styles.submitText}> Submit </Text>
              </Button>
            </View>
          
          </View>}
        </Container>
      );
    }
  }
  export default BuyerMain;