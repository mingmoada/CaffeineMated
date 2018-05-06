import firebase from 'firebase';

// Firebase configuration
var config = {
  apiKey: "AIzaSyAQSNocuGrjIBtwErRJeHV7nUsfQGZC_uE",
  authDomain: "cmdatabase-c3084.firebaseapp.com",
  databaseURL: "https://cmdatabase-c3084.firebaseio.com",
  projectId: "cmdatabase-c3084",
  storageBucket: "cmdatabase-c3084.appspot.com",
  messagingSenderId: "964208744011"
};
// Firebase initialization
firebase.initializeApp(config);

/*
 * Name: userLogin
 * Parameters: email - string; user login email
 *             password - string; user login password
 * Return:
 *  Error Condition: 1) Error Message indicates what went wrong
 *                   2) Error Inputs
 * Success: 1
 */
export function userLogin (email, password, login_cb) {
  firebase.auth().signInWithEmailAndPassword(email, password).then(
    function() {
      // callback with 0 indicating login success
      login_cb(0);
    }
  ).catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    // callback with errorMessage
    login_cb(errorMessage);
  });
}

/*
 * Name: userSignUp
 * Parameters: string: email, string: password
 * Return:
 * Error Condition: errorMessage
 * Success: 1 represents sign in successfully
 */
export function userSignup (email, password, signup_cb) {
    firebase.auth().createUserWithEmailAndPassword(email, password).then(
      function() {
      // callback with 0 indicating login success
        signup_cb(0);
      }
    ).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      // callback with errorMessage
      signup_cb(errorMessage);
    });
}

/*
 * Name: displayMenu
 * Parameters: call back function
 * Return: List of pairs. [[img, TypeName]...]
 * Error Condition: None
 */
export function displayMenu (displayMenu_cb) {
    // access the Menu field in firebase
    const firebaseRef = firebase.database().ref("Menu");

    firebaseRef.on('value', function(snapshot){
      let menu = [];
      let type = [];

      // Find the value of the Menu field
      let types = snapshot.val();
      var typeName;

      // loop through all types in menu
      for( typeName in types){
        // for each different type, get the value
        let typeField = types[typeName];
        type = [];

        // find image and name
        type.push(typeField.image);
        type.push(typeName);
        menu.push(type);
      }

      // return menu, for debug, uncomment the next step
      console.log(menu);
      displayMenu_cb(menu);

    }, function(errorObject){
      alert("failed:" + errorObject.code);
    });
}

/*
 * Name: displayType
 * Parameters: string: type
 * Return: an array contains each item with image, id, and name.
 * @image: url
 * @id: string
 * @name: string
 */
export function displayType (type, displayType_cb) {
    let firebaseRef = firebase.database().ref('Menu');
    let drinks = [];
    firebaseRef.on('value', dataSnapshot => {
      let menu = dataSnapshot.val();
      var index;
      for (index in menu[type].items) {
        let item = menu[type].items[index];
        let drink = {image: item.image, id: index, name: item.name}
        drinks.push(drink);
      }
      displayType_cb(drinks);
    });
  }

/*
 * Name: displayItem
 * Parameters: string: type, string: item_id, displayItem_cb
 * Return:
 * The array containing name, description, image.
 *
 */
export function displayItem (type, item_id, displayItem_cb) {
    // get the direction
    dir = "Menu/" + type + "/items/" + item_id;
    var information = [];
    firebase.database().ref(dir).on("value", function (snapshot) {
        var coffee = snapshot.val();
        // push information to the array
        information.push(coffee.name);
        information.push(coffee.description);
        information.push(coffee.image);
        displayItem_cb(information);
    });
}

/*
 * Name: saveOrder
 * Description: save order object to database
 * Parameters: object: order, function: saveOrder_cb
 * Return:
 * Error Condition: none
 * Success: return order id of saved order
 */
export function saveOrder (order, saveOrder_cb) {
  let orderRef = firebase.database().ref("Orders"); 
  let order_id = 0; 
  orderRef.once("value", dataSnapshot => {
    order_id = dataSnapshot.val().size; 
    if (!order_id) {
      order_id = 0; 
    }
    orderRef.child("items").child(order_id).set(order); 
    orderRef.child("size").set(++order_id); 
    saveOrder_cb(order_id); 
  }); 
}
